<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Lunchactivity;
use App\Referrals;
use App\Useractions;
use App\Counters;
use App\Activities;
use App\Students;
use Carbon\Carbon;
use DB;

class LunchDetentionController extends Controller
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


        $lunchStudents = Students
            ::with('user')
            ->with(['referred' => function ($q) use ($date) {
                $q
                    //->where('RefferalStatus', 0)
                    ->where('Date', $date)
                    ->whereIn('ReferralTypeId', array_merge(Referrals::$issReferralTypes, Referrals::$lunchReferralType, Referrals::$ossReferralType))
                    ->where('RefferalStatus','!=',99)
                    ->with('referralType', 'user', 'teacher', 'activity', 'consequence.referralType')
                    ->orderBy('ReferralTypeId', 'DESC');
            }])
            ->whereHas('user', function ($q) use ($schoolId) {
                $q->where('SchoolId', $schoolId);
            })
            ->whereHas('referred', function ($q) use ($date) { // only with not processed lunch  referrals for $date
                $q
                    //->where('refferals.RefferalStatus', 0)
                    ->where('ReferralTypeId', 9)
                    ->where('Date', $date);
            })
            ->whereHas('counters', function ($q) {
                //$q->where('LunchDetentionsToBeServed', '>', 0);
            })
            ->join('aspnetusers', 'aspnetusers.id', '=', 'students.Id')
            ->orderBy('LastName', 'ASC')
            ->select('students.*')
            ->get();

        $refsWithNoOverlaps = Referrals::getReferralsWithNoOverlaps($lunchStudents,Referrals::$issReferralTypes);
        $lunchStudentsCount = $refsWithNoOverlaps->count();


        return $request->count?compact('lunchStudentsCount'):compact('lunchStudents','lunchStudentsCount');
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
        $date = $this->getDate($request);
        $useraction = Useractions::firstOrcreate([
            'ActionDate' => $date,
            'ActionByUserId' => $this->userId,
            'ActionType' => 10,
            'ActionToUserId' => $request->StudentId,
            'Comment' => '[Student Was Referred to Lunch Detention at:'
                . $date . ' Student Was Tardy At:'
                . $request->TardyTime . '(System)]'
        ]);
        $referral = Referrals::firstOrcreate([
            'Date' => $date,
            'UserId' => $this->userId,
            'StudentId' => $request->StudentId,
            'TeacherId' => 0,
            'PeriodId' => $request->PeriodId,
            'TardyTime' => $request->TardyTime,
            'ReferralTypeId' => 9,
        ]);

        if(!$referral->wasRecentlyCreated){
            $msg = 'Student was already referred Lunch detention, discarding';
        }else{
            $msg = 'Success: referral made';
        }

        /* for table RelationShip Between  Refferals and UserActions */
        //ReferralsActions::create(['ReferralId'=>$referral->Id, 'UseractionId'=>$useraction->Id ]);
        // now this referral is linked to an action(s)

        $counters = Counters::firstOrCreate(['Id' => $request->StudentId]);
        $counters->increment('LunchDetentionsToBeServed');
        $counters->increment('LDReferrals');
        return compact('useraction', 'referral', 'counters', 'msg');
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
       // DB::beginTransaction();
        //
        $today = $this->getDate($request);
        $tomorrow = $today->copy()->addWeekDay();
        $activity = Activities::find($request->ActionType);

        // change referral status to attendance taken and set the activity type id accordingly
        $referral = Referrals::find($id);
        $referral->RefferalStatus = 1;
        $referral->ActivityTypeId = $request->ActionType;
        $referral->save();

        $useraction = Useractions::create([
            'ActionDate' => $today,
            'ActionByUserId' => $this->userId,
            'ActionType' => $request->ActionType,
            'ActionToUserId' => $referral->StudentId,
            'Comment' => $request->Comment]);


        $counters = Counters::find($referral->StudentId);
        // present for lunch
        if ($request->ActionType == 31) {
            $msg = 'Student Was Present';
            $counters->decrement('LunchDetentionsToBeServed');

            $pendingLunchs = Referrals
            ::where('Date', $today)
                ->where('RefferalStatus', 0)// pending
                ->where('ReferralTypeId', 9)
                ->where('RefferalStatus','!=',99)
                ->where('StudentId', $referral->StudentId)
                ->update(['date' => $tomorrow]);
        } // ditch for lunch
        else if ($request->ActionType == 32 || $request->ActionType == 35 || $request->ActionType == 36) {
            $msg = 'Student Ditched Lunch Detention, Assigning Oroom for Today';
            $counters->LunchDetentionsToBeServed = 0;
            $useraction = Useractions::create([
                'ActionDate' => $today,
                'ActionByUserId' => $this->userId,
                'ActionType' => 44,
                'ActionToUserId' => $referral->StudentId,
                'Comment' => 'Student Ditched Lunch Detention on ' . Carbon::now()
                    . ' Assigning Oroom for Today (System)']);

//            $referralCopy = $referral->replicate();
//            $referralCopy->Date = $tomorrow;
//            $referralCopy->save();
//            $referralCopy->created_at = $referral->created_at;
//            $referralCopy->save();



            $consequence = Referrals::create([
                'UserId' => $this->userId,
                'StudentId' => $referral->StudentId,
                'TeacherId' => 0,
                'ReferralTypeId' => 2,// lunch -> ORM
                'Date' => Carbon::today()
            ]);
            $referral->update(['RefferalStatus'=>1, 'ActivityTypeId'=> $request->ActionType, 'ConsequenceId'=>$consequence->Id]);
            // set lunch detention refs status to 13 = lunch -> oroom => lunchs = 0
            $pendingLunchs = Referrals
                ::where('Date', $today)
                ->where('RefferalStatus', 0)// pending
                ->where('ReferralTypeId', 9)
                ->where('StudentId', $referral->StudentId);
             //   ->update(['RefferalStatus' => 13]);
            $counters->increment('ORoomsToBeServed');
        }
        else {
            $msg = 'Rescheduling Lunch Detention For Tomorrow';
            $useraction = Useractions::create([
                'ActionDate' => $today,
                'ActionByUserId' => $this->userId,
                'ActionType' => $request->ActionType,
                'ActionToUserId' => $referral->StudentId,
                'Comment' => 'Rescheduling Lunch Detention For Tomorrow(System)']);

//            $referralCopy = $referral->replicate();
//            $referralCopy->Date = $tomorrow;
//            $referralCopy->save();
//            $referralCopy->created_at = $referral->created_at;
//            $referralCopy->save();

            $referral->update(['RefferalStatus'=>1, 'ActivityTypeId'=> $request->ActionType]);

            $pendingLunchs = Referrals
                ::where('Date', $today)
                ->where('RefferalStatus', 0)// pending
                ->where('ReferralTypeId', 9)
                ->where('StudentId', $referral->StudentId);
               // ->update(['date' => $tomorrow]);
        }
        $counters->save();
        $referral->load('activity');
        return compact('msg', 'useraction', 'referral', 'counters', 'consequence');
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
	