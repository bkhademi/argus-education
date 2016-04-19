<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Ossactivity;
use App\Referrals;
use App\Useractions;
use Carbon\Carbon;
use DB;

class OSSController extends Controller
{

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        //
        $schoolId = $this->user->SchoolId;
        $date = $this->getDate($request);

        switch ($request->param) {
            case 'parentMeetingList':
                $oss = Referrals::with('user', "teacher", 'referralType', 'activity')
                    ->with(['studentUser.student' => function ($q) {
                        $q->with('counters')
                            ->with(['referred' => function ($q) {

                                $q->with('teacher', 'referralType')
                                ->where('RefferalStatus', 0 );
                            }]);
                    }])
                    ->ofSchoolId($schoolId)
                    ->ofType(11)// OSS Referrals
                    ->ofStatus(0)
                    //->where('RefferalStatus', 0) // get all since the activity is recorded along the referral
                    ->join('aspnetusers', 'aspnetusers.id', '=', 'refferals.StudentId')
                    ->orderBy('LastName', 'ASC')
                    ->select('refferals.*')
                    ->get();
                break;
            case 'ossList':
            case 'roster':

                $oss = Referrals::with('user', 'studentUser.student.counters', 'teacher', 'referralType', 'activity')
                    ->wherehas('studentUser', function ($q) use ($schoolId) {
                        $q->where('SchoolId', $schoolId);
                    })
                    ->where('ReferralTypeId', 11)// OSS Referrals

                    ->where('Date','<=', $date)
                    ->where('DateEnd','>=',$date)
                    //->where('RefferalStatus', 0) // get all since the activity is recorded along the referral
                    ->join('aspnetusers', 'aspnetusers.id', '=', 'refferals.StudentId')
                    ->orderBy('LastName', 'ASC')
                    ->select('refferals.*')
                    ->get();
                break;
            default :
                return response(['msg' => 'Invalid parameter'], 500);
        }


        if ($request->has('count'))
            return ['count' => count($oss)];
        return $oss;
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //DB::beginTransaction();
        $referral = Referrals::find($id);
        $counters = \App\Counters::find($referral->StudentId);
        if ($request->has('OssPresent')) {
            $msg = 'Parent Meeting Cleared';
            $referral->update(['RefferalStatus' => 1]);
            $counters->decrement('OSSPMP');
            $useraction = Useractions::create([
                'ActionDate' => Carbon::today(),
                'ActionByUserId' => $this->userId,
                'ActionType' => 62,
                'ActionToUserId' => $referral->StudentId,
                'Comment' => $request->Comment
            ]);
        } else if ($request->has('attendance')) {
            $msg = 'OSS attendances marked as present and selected referrals removed';
            $result = Referrals::decreaseCountersAndRemoveReferrals($request->ToRemoveReferralIds, $request->StudentId);

            // register act
            $useraction = Useractions::create([
                'ActionDate' => Carbon::today(),
                'ActionByUserId' => $this->userId,
                'ActionType' => 62, // PM : Present
                'ActionToUserId' => $request->StudentId,
                'Comment' => $request->Comment . ""
            ]);

            // modify referral status
            $referral->update(['RefferalStatus' => 1, 'ActivityTypeId' => 62]);

            $referralsLeft = Referrals
                ::where('StudentId', $request->StudentId)
                ->where('RefferalStatus', 0)
                ->get();

            $referral->load('activity');

            return ['referrals' => $referralsLeft, 'action' => $useraction, 'referral' => $referral, 'msg' => $msg];

        } else if ($request->has('reschedule')) {
            $msg = 'OSS Reschedule ';
            $useraction = Useractions::create([
                'ActionDate' => Carbon::today(),
                'ActionByUserId' => $this->userId,
                'ActionType' => 90, // PM : no show
                'ActionToUserId' => $request->StudentId,
                'Comment' => $request->Comment
            ]);
            $referralCopy =  $referral->replicate();
            $referralCopy->update([]);
            $referral->update(['RefferalStatus' => 1, 'ActivityTypeId' => 90]);

        } else if ($request->has('noshow')) {
            $msg = 'OSS Noshow, Moving to Parent Meeting Followup List';
            $useraction = Useractions::create([
                'ActionDate' => Carbon::today(),
                'ActionByUserId' => $this->userId,
                'ActionType' => 61, // PM : no show
                'ActionToUserId' => $request->StudentId,
                'Comment' => $request->Comment. ""
            ]);
            //what else to do with all other referrals
            //pending

            $referral->update(['RefferalStatus' => 32 /*pending followup status*/, 'ActivityTypeId' => 61/* no show*/]);

        } else if ($request->has('PMPInfo')) {
            $msg = 'Meeting Info Updated';
            $referral = Referrals::find($id);
            $referral->update([
                'TeacherId' => $request->MeetingWithId,
                'ReferralTypeId' => 11,
                'Date' => new Carbon($request->DateOfSuspension),
                'Time' => $request->MeetingTime,
                'NewDate' => new Carbon($request->MeetingDate)
            ]);

            $referral = Referrals::find($id)->with('activity', 'referralType', 'studentUser.student.counters', 'teacher', 'user');
        } else {
            $referral->update(['ReferralTypeId' => 15, 'RefferalStatus' => 0]);
            $msg = 'Referral has been sent to the Parent Meeting Followup List';
            $action = Useractions::create([
                'ActionDate' => Carbon::today(),
                'ActionByUserId' => $this->userId,
                'ActionType' => 61,
                'ActionToUserId' => $referral->StudentId,
                'Comment' => $request->Comment
            ]);
        }
        return compact('msg', 'referral', 'useraction');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }

}
