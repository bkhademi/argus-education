<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Issactivity;
use App\Referrals;
use App\Useractions;
use App\Counters;
use App\Students;
use App\Activities;
use Carbon\Carbon;
use App\User;
use Excel;
use DB;

class ISSController extends Controller
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

        if ($request->has('followup')) {


            $iss = Referrals::with('user', 'studentUser.student.counters', 'studentUser.student.classes.professor_class.room', 'teacher', 'referralType', 'activity')
//			->where('Date', $date)
                ->wherehas('studentUser', function ($q) use ($schoolId) {
                    $q->where('SchoolId', $schoolId);
                })
                ->wherehas('referralType', function ($q) {
                    $q->whereIn('ReferralTypeId', [7, 5, 6, 17, 10]);
                })
                ->where('RefferalStatus', 16)//  is followup
                ->get();
        } else {


            $iss = Students
                ::with('counters', 'user', 'classes.professor_class.classs', 'classes.professor_class.room')
                ->with(['referred' => function ($q) use ($date) {
                    $q
                        //->where('RefferalStatus', 0)
                        ->where('Date', $date)
                        ->whereNotIn('ReferralTypeId', [9])// dont load lunch
                        //->where('RefferalStatus', '!=', 99)
                        ->with('user', 'activity', 'referralType','consequence.referralType')
                        ->join('referraltypes', 'referraltypes.id', '=', 'ReferralTypeId')
                        ->orderBy('Priority', 'ASC')
                        ->select('refferals.*');
                }])
                ->wherehas('user', function ($q) use ($schoolId) { // from the school the user requested
                    $q->where('SchoolId', $schoolId);
                })
                ->whereHas('counters', function ($q) {
                    //$q->where('ISSDays', '>', 0);
                })
                ->whereHas('referred', function ($q) use ($date) {
                    $q
                        //->where('refferals.RefferalStatus', 0)
                        ->whereIn('ReferralTypeId', [5, 6, 7, 10, 15, 17])
                        ->where('Date', $date);
                })
                ->join('aspnetusers', 'aspnetusers.id', '=', 'students.Id')
                ->orderBy('LastName', 'ASC')
                ->select('students.*')
                ->get();
        }
        if ($request->has('count'))
            return ['count' => count($iss)];
        return $iss;
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
        $date = $this->getDate($request);
        // action type = 20,21
        // referralType = 5,10
        // find iss referrals that might already be scheduled for the requested day
        $student = User::find($request->StudentId);

        $msg = $student->FirstName . ', ' . $student->LastName . ' Was referred ISS ';

        $useraction = Useractions::create([
            'ActionDate' => $date,
            'ActionByUserId' => $this->userId,
            'ActionType' => $request->ActionType,
            'ActionToUserId' => $request->StudentId,
            'Comment' => $request->Comment]);

        $referral = Referrals::create([
            'UserId' => $this->userId,
            'StudentId' => $request->StudentId,
            'TeacherId' => 0,
            'ReferralTypeId' => $request->ReferralTypeId,
            'Date' => $date]);

        /* for table RelationShip Between  Refferals and UserActions */
        //ReferralsActions::create(['ReferralId'=>$referral->Id, 'UseractionId'=>$useraction->Id ]);
        // now this referral is linked to an action(s)

        $counters = Counters::firstOrCreate(['Id' => $student->id]);
        $counters->increment('ISSDays');
        $counters->increment('ISSReferrals');
        return compact('msg', 'referral');
    }

    /**
     * Display the specified resource.
     *
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {

        $yesterday = Carbon::today()->subWeekDay();

        $iss = \App\Students::with(['referred' => function ($q) use ($yesterday) {
            $q->whereNotIn('ReferralTypeId', [12, 18])
                ->where('RefferalStatus', 0)
                ->whereBetween('Date', [Carbon::today()->subWeekDays(2), $yesterday]);
        }])
            ->whereHas('referred', function ($q) use ($yesterday) {
                $q->whereBetween('Date', [Carbon::today()->subWeekDays(2), $yesterday])//->orWhere('Date',Carbon::today()->subWeekDays(2))
                ;
            })
            ->whereHas('counters', function ($q) {
                $q->where('ISSDays', '>', 0);
            })->get();
        // move all yesterday referrals for students with iss for today
        // this includes all orm, and other iss referrals
        foreach ($iss as $stu) {
            foreach ($stu->referred as $ref) {
                $ref->update(['Date' => Carbon::today()]);
            }
        }
        return ['ok'];
        /* AEC */
        $date = new Carbon('Feb 1 2016');
        $schoolId = 2; // estacado
        $aecCounters = [
            'Assign' => 0,
            'present' => 0,
            'reschedule' => 0,
            'clear' => 0,
            'noshow' => 0,
            'leftschool' => 0,
            'schoolabsent' => 0,
            'sentout' => 0,
            'walkedout' => 0,
            'other' => 0,
            'absent' => 0,
        ];
        $DateCounters = [];
        for ($i = 0; $i < 14; $i++) {
            $currentAssigned = Useractions::
            where('ActionDate', $date)
                ->whereHas('student', function ($q) use ($schoolId) {
                    $q->where('SchoolId', $schoolId);
                })
                ->whereIn('ActionType', [48, 60])
                ->get();
            $dateUserActions = Useractions::
            where('ActionDate', $date)
                ->whereHas('student', function ($q) use ($schoolId) {
                    $q->where('SchoolId', $schoolId);
                })
                ->whereIn('ActionType', [49, 51, 52, 53, 54, 55, 56, 57, 58])
                ->get();
            $actions = [];

            $aecCounters['Assign'] = count($currentAssigned->toArray());
            foreach ($currentAssigned as $ass) {

                $uact = Useractions::
                where('ActionDate', $date)
                    ->whereHas('student', function ($q) use ($ass) {
                        $q->where('Id', $ass->ActionToUserId);
                    })
                    ->whereIn('ActionType', [49, 50, 55, 56, 57])
                    ->first();
                $uactoffset = Useractions::
                where('ActionDate', (new Carbon($date))->addWeekDay())
                    ->whereHas('student', function ($q) use ($ass) {
                        $q->where('Id', $ass->ActionToUserId);
                    })
                    ->whereIn('ActionType', [51, 52, 53, 54, 57, 58])
                    ->first();
                if (!$uact)
                    goto next;

                switch ($uact->ActionType) {

                    case 49:
                        $aecCounters['present']++;
                        break;
                    case 50:
                        $aecCounters['reschedule']++;
                        break;
                    case 55:
                        $aecCounters['sentout']++;
                        break;
                    case 56:
                        $aecCounters['walkedout']++;
                        break;
                    case 57:
                        $aecCounters['other']++;
                        break;

                }
                next:
                if (!$uactoffset)
                    continue;
                switch ($uactoffset->ActionType) {
                    case 51:
                        $aecCounters['clear']++;
                        break;
                    case 52:
                        $aecCounters['noshow']++;
                        break;
                    case 53:
                        $aecCounters['leftschool']++;
                        break;
                    case 54:
                        $aecCounters['schoolabsent']++;
                        break;
                    case 57:
                        $aecCounters['sentout']++;
                        break;
                    case 58:
                        $aecCounters['walkedout']++;
                        break;
                }
            }

            $DateCounters[$date->toDateString()] = $aecCounters;

            $aecCounters = [
                'Assign' => 0,
                'present' => 0,
                'reschedule' => 0,
                'clear' => 0,
                'noshow' => 0,
                'leftschool' => 0,
                'schoolabsent' => 0,
                'sentout' => 0,
                'walkedout' => 0,
                'other' => 0,
                'absent' => 0,
            ];

            $date = $date->addDay();
        }

        return $DateCounters;
//			Excel::create('AECEstacado', function($excel)use($DateCounters) {
//
//				$excel->sheet('Sheet1', function($sheet)use($DateCounters) {
//
//					$sheet->fromArray($DateCounters);
//				});
//			})->download('csv');
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
        $schoolId = $this->user->SchoolId;

        $today = $this->getDate($request);

        if ($today->eq(Carbon::today())) {
            $tomorrow = Carbon::today()->addWeekDay();
        } else if ($today->lt(Carbon::today())) { // can only be yesterday
            $tomorrow = Carbon::today();
        } else {
            $tomorrow = $today->copy()->addWeekDay();
        }

        $now = Carbon::now();

        if ($request->has('attendance')) {
            $referral = Referrals::find($id)->Update(['ActivityTypeId' => $request->ActivityTypeId]);
            return response('successfully Modified iss attendance', 200);
        }
        else if ($request->has('followup')) {
            $msg = 'Student Was scheduled for Parent meeting on ' . $request->Date .
                ', at ' . $request->Time;
            // schedule OSS for given  day.
            $referral = Referrals::find($id);
            $counters = Counters::find($request->StudentId);
            $useraction = Useractions::create([
                'ActionDate' => $today,
                'ActionByUserId' => $this->userId,
                'ActionType' => $request->ActionType,
                'ActionToUserId' => $referral->StudentId,
                'Comment' => $request->Comment
            ]);
            $counters->increment('OSSPMP');
            $counters->increment('Cycles');
            $referralOSS = Referrals::create([
                'UserId' => $this->userId,
                'StudentId' => $referral->StudentId,
                'TeacherId' => $referral->TeacherId,
                'ReferralTypeId' => 11,
                'Date' => $today,
                'Time' => $request->Time
            ]);

            $referral->update(['Date' => $today->addWeekDay(2), 'ReferralTypeId' => 10]);
        }
        else {

            $activity = Activities::find($request->ActionType);
            $referral = Referrals::find($id);
            $counters = Counters::find($referral->StudentId);
            $useraction = Useractions::create([
                'ActionDate' => $today,
                'ActionByUserId' => $this->userId,
                'ActionType' => $request->ActionType,
                'ActionToUserId' => $referral->StudentId,
                'Comment' => $request->Comment
            ]);
            // move other today's referrals for tomorrow
            $pendingReferrals = Referrals
                ::where('Date', $today)
                ->where('RefferalStatus', 0)// pending
                ->whereNotIn('ReferralTypeId', [12, 18, 9])// dont move reteach and aec  LD
                ->where('StudentId', $referral->StudentId);


            // present for iss
            if ($request->ActionType == 38) {
                //check if datepicker  is more that 1 day away from current date use today
                $msg = 'Student Was Present, Decreasing ISSDays ';

                // leave a trace in the orm referral list
                $ormTraceReferral  = $this->leaveTraceInORMList($request->ActionType, $request->StudentId,$today,$tomorrow);

                // mark current with the action type
                $referral->update(['RefferalStatus' => 1, 'ActivityTypeId' => $request->ActionType]);

                $referrals = $this->getISSReferrals($today,$request->StudentId);


                Referrals
                    ::where('Date', $today)
                    ->where('RefferalStatus', 0)// pending
                    ->whereIn('ReferralTypeId', array_merge(Referrals::$issReferralTypes, Referrals::$oroomReferralTypes))// dont move reteach and aec  LD
                    ->where('StudentId', $referral->StudentId)
                    ->update(['Date' => $tomorrow]);

                $counters->decrement('ISSDays');
            }
            // ditched iss,  only move to ISS followup// leave a trace in this list(auto)
            else if ($request->ActionType == 39 || $request->ActionType == 42 || $request->ActionType == 43) {
                $msg = 'Student Ditched ISS, Moving to ISS Followup';

                // leave a trace in the orm referral list
                $ormTraceReferral  = $this->leaveTraceInORMList($request->ActionType, $request->StudentId,$today,$tomorrow);

                // mark current with the action type and set status to 16 to move to follup list and set its action type
                $referral->update(['RefferalStatus' => 16, 'ActivityTypeId' => $request->ActionType /*, 'ReferralTypeId' => 15*/]);

                $pendingReferrals->update(['Date' => $today]);

                $useraction->update(['Comment' => $useraction->Comment . '[Student Ditched ISS, Moving to ISS Followup List(System)]']);

                $referrals = $this->getISSReferrals($today,$request->StudentId);
            }
            // clear iss referrals
            else if ($request->ActionType == 87) {
                $toRemoveReferralIds = $request->ToRemoveReferralIds;



                if ($request->RemoveAll) {
                    $msg = 'Removing/Clearing All ISS referrals';
                    // grab 1 from the referrals to remove to use as trace
                    $traceReferral = Referrals::find(array_shift($toRemoveReferralIds));

                    // leave a trace in the orm referral list only if taking iss from previous day
//                    if((new Carbon($referral->Date))->ne(Carbon::today()))
//                        $ormReferral  = $this->leaveTraceInORMList($request->ActionType, $request->StudentId,$today,$tomorrow);
                    $traceReferral->update(['RefferalStatus' => 1, 'ActivityTypeId' => $request->ActionType]);
                    Counters::find($request->StudentId)->decrement('ISSDays');// decrease one here as 1 will not be removed
                } else {
                    $msg = 'Removing '. count($toRemoveReferralIds) .' ISS refferals and ';
                    // grab one of the referrals that are not going to be removed

                    $moveDate = new Carbon($request->MoveClearToDate);
                    if ($moveDate->eq(Carbon::today())) { // leave trace and use as real
                        $msg .= 'leaving pending to serve on ';

                    } else { //  mark trace as clear, dont move orm.. serving orm today and iss tomorrow
                        $msg .= 'moving pending to ';
                        $traceReferral = Referrals::find(array_shift($toRemoveReferralIds));
                        $traceReferral->update(['RefferalStatus' => 1, 'ActivityTypeId' => $request->ActionType]);

                        $pendingReferrals = Referrals
                            ::where('Date', $today)
                            ->where('RefferalStatus', 0)// pending
                            ->ofTypes( Referrals::$issReferralTypes)// move iss
                            ->Where('Id', '!=', $traceReferral->Id)// dont move trace?? WONT BE MOVED< IS ALREADY MARKED AS 1
                            ->where('StudentId', $referral->StudentId)
                            ->update(['Date' => $moveDate]);
                        Counters::find($request->StudentId)->decrement('ISSDays');// decrease one here as 1 will not be removed

                    }



                    $msg .= $moveDate->toDateString();
                }
                $result = Referrals::decreaseCountersAndRemoveReferrals($toRemoveReferralIds, $referral->StudentId);

                $referrals = $this->getISSReferrals($today,$request->StudentId);
                $useraction->update(['Comment' => $useraction->Comment . "[Clearing " . count($toRemoveReferralIds) . " ISS referrals (System)]"]);

            }
            // left school, school absent, other
            else {// left School, school absent, other
                $msg = 'Rescheduled For Tomorrow';
                // before start rotating referrals , make a copy,
                $referralCopy = $referral->replicate();
                $referralCopy->save();
                $referralCopy->update(['created_at' => $referral->created_at, 'Date' => $tomorrow, 'RefferalStatus' => 0]);
                $referral->update(['RefferalStatus' => 1, 'ActivityTypeId' => $request->ActionType]);

                // leave a trace in the orm referral list
                $ormTraceReferral  = $this->leaveTraceInORMList($request->ActionType, $request->StudentId,$today,$tomorrow);


                $pendingReferrals->update(['Date' => $tomorrow]);
                $useraction->update(['Comment' => $useraction->Comment . '[Rescheduling For Next Day(System)]']);
                $referrals = $this->getISSReferrals($today,$request->StudentId);
            }
        }
        $referral->load('activity', 'referralType', 'teacher', 'user');
        return compact('msg', 'referral','referrals','traceReferral', 'useraction','ormTraceReferral');
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
        $deleted = Referrals::find($id)->destroy();


        return compact('deleted');
    }

    private function leaveTraceInORMList($activityTypeId, $studentId, $fromDate, $toDate){
        $ormReferral = Referrals
            ::where('Date', $fromDate)
            ->where('RefferalStatus', 0)// pending
            ->whereIn('ReferralTypeId', [1, 2, 3, 16, 19])
            ->where('StudentId', $studentId)
            ->join('referraltypes', 'referraltypes.id', '=', 'ReferralTypeId')
            ->orderBy('Priority', 'ASC')
            ->select('refferals.*')
            ->first();

        if ($ormReferral) {
            $ormReferralCopy = $ormReferral->replicate();
            $ormReferralCopy->save();
            $ormReferralCopy->update(['created_at' => $ormReferral->created_at, 'Date' => $toDate, 'RefferalStatus' => 0]);
            $ormReferral->update(['RefferalStatus' => 1, 'ActivityTypeId' => $activityTypeId]);
        }
        return $ormReferral;
    }

    private function getISSReferrals($date,$studentId){
        $referrals = Referrals::with('activity','referralType','user')
            ->where('Date',$date)
            ->ofTypes(Referrals::$issReferralTypes)
            ->where('StudentId',$studentId)
            ->join('referraltypes', 'referraltypes.id', '=', 'ReferralTypeId')
            ->orderBy('Priority', 'ASC')
            ->select('refferals.*')
            ->get();
        return $referrals;
    }
}
	