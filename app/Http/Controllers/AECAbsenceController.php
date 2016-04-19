<?php

namespace App\Http\Controllers;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use DB;
use App\Referrals;
use App\Useractions;
use App\Counters;
use App\User;
use Carbon\Carbon;

class AECAbsenceController extends Controller
{
    protected $attendances = array('NoShow' => 52, 'LeftSchool' => 53, 'SchoolAbsent' => 54, 'Other' => 57, 'Clear' => 51);

    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index(Request $request)
    {
        $date = $this->getDate($request);
        $schoolId = $this->user->SchoolId;

        $refs =  User
            ::with('student', 'classes.professor_class.room')
            ->with(['referred' => function ($q) use ($date) {
                $q
                    ->where('RefferalStatus', 4)
                    ->where('ReferralTypeId', 12)
                    // ->where('Date', $date)
                    ->with('assignment', 'teacher', 'activity');
            }])
            ->where('SchoolId', $schoolId)
            ->whereHas('referred', function ($q) use ($date) {
                $q
                    ->where('RefferalStatus', 4)
                    ->where('ReferralTypeId', 12)// ->where('Date', $date)
                ;
            })
            ->orderBy('LastName', 'ASC')
            ->get();
        if($request->count)
            $refs = ['aecAbsentCount'=>$refs->count()];

        return $refs;
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @return Response
     */
    public function store()
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int $id
     * @return Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int $id
     * @return Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  int $id
     * @return Response
     */
    public function update($id, Request $request)
    {
        //DB::beginTransaction();
        $today = Carbon::today();
        $tomorrow = Carbon::today()->addWeekDay();
        $studentId = $id;
        $lastPendingFollowupAction = Useractions::where('ActionToUserId', $studentId)
            ->where('ActionType', 58)
            ->orderBy('created_at', 'DESC')
            ->first();

        if ($request->ActionType == $this->attendances['NoShow'] || $request->ActionType == $this->attendances['Clear']) {

            if ($request->ActionType == $this->attendances['Clear']) { // CLEAR
                $msg = 'Student Cleared From AEC';
                $referrals = Referrals::whereIn('Id', $request->referrals);
                $referrals->update(['RefferalStatus' => 2, 'ActivityTypeId' => $request->ActionType]);
                $lastPendingFollowupAction->Comment .= "\n Followup Comment: \n " . $request->Comment
                    . '[Student Cleared (System)]';
                $lastPendingFollowupAction->ActionType = $request->ActionType;
                $lastPendingFollowupAction->save();

            } else { // NO Show (52)
                $msg = 'No Show. AEC->ORM.';
                $referrals = $request->referred;
                // GOES TO OROOM
                $consequence = Referrals::create([
                    'UserId' => $this->userId,
                    'StudentId' => $id,
                    'ReferralTypeId' => 16,
                    'Date' => $today
                ]);
                foreach ($referrals as $ref) {
                    $referral = Referrals::find($ref['Id']);

                    if ($ref['HasFolder']) {
                        // has folder. Reschedule AEC (resubmit)
                        $msg .= ' (Has Folder for ' . $ref['assignment']['Name'] . ', AEC Rescheduled)  ';
                        // leave a copy to mark this date
                        $new_ref = $referral->replicate();
                        $new_ref->Date = Carbon::today();
                        $new_ref->RefferalStatus = 0;
                        $new_ref->ActivityTypeId = 0;
                        $new_ref->save();
                        $new_ref->created_at = $referral->created_at;

                    } else {
                        $msg .= ' (Doesn\'t have folder for ' . $ref['assignment']['Name'] . ', no AEC)  ';
                        $incomplete = true;

                    }
                    // update the contents on the referral to be shown in the roster
                    $referral->update(['HasFolder' => $ref['HasFolder'], 'RefferalStatus' => 2, 'ActivityTypeId' => $request->ActionType, 'ConsequenceId'=>$consequence->Id]);
                }


                $counters = Counters::find($id);
                $counters->increment('ORoomsToBeServed');

                $lastPendingFollowupAction->update(['Comment' => $lastPendingFollowupAction->Comment . "\n Followup Comment: \n "
                    . $request->Comment .' [' . $msg . ' (System)]', 'ActionType' => $request->ActionType]);
            }

            $referrals = Referrals::whereIn('Id', $request->referrals)->get();
            return compact('msg', 'referrals', 'lastPendingFollowupAction', 'consequence', 'counters');
        }//ditched
        else if ($request->ActionType == $this->attendances['LeftSchool'] || $request->ActionType == $this->attendances['SchoolAbsent'] || $request->ActionType == $this->attendances['Other']) {// left school(53) , school absent(54), other(57)

            $msg = '';
            $referrals = $request->referred;

            foreach ($referrals as $ref) {
                $referral = Referrals::with('assignment')->findOrFail($ref['Id']);
                if ($ref['HasFolder']) {// leave a copy/trace behind
                    $msg .= ' (Has Folder for ' . $referral->assignment->Name . ', AEC Rescheduled)  ';
                    // leave a copy to mark this date
                    $new_ref = $referral->replicate();
                    $new_ref->RefferalStatus = 0;
                    $new_ref->Date = Carbon::today();
                    $new_ref->save();
                    $new_ref->created_at = $referral->created_at;
                    $new_ref->save();

                } else {
                    $msg .= ' (Doesnt has folder for ' . $referral->assignment->Name . ', no AEC)  ';

                }
                $referral->update(['HasFolder' => $ref['HasFolder'], 'RefferalStatus' => 2, 'ActivityTypeId' => $request->ActionType]);

            }

            $lastPendingFollowupAction->update(['Comment' => $lastPendingFollowupAction->Comment . "\n Followup Comment: \n "
                . $request->Comment .' [' . $msg . ' (System)]', 'ActionType' => $request->ActionType]);


            return compact('msg', 'referral', 'lastPendingFollowupAction', 'action');
        }else{ // no Action Type,, therefore, had overlap.

        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int $id
     * @return Response
     */
    public function destroy($id)
    {
        //
    }

}
