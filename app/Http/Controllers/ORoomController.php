<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Oroomactivity;
use App\Referrals;
use App\Useractions;
use App\Counters;
use App\Activities;
use Carbon\Carbon;
use DB;
use App\Referraltypes;
use App\Students;

class ORoomController extends Controller
{

    /**
     * Display a listing of the resource.
     * @queryString
     *      Date    - Date of the requested referrals
     *      roster  - return only roster or roster and ormDay Activity
     *      count   - return only the number in each list (roster, ormDay)
     * @return \Illuminate\Http\Response
     *      reftable    -
     *      OroomList   -
     */
    public function index(Request $request)
    {
        $schoolId = $this->user->SchoolId;
        $date = $this->getDate($request);

        if ($request->has('roster')) {
            $OroomList = Students
                ::with('counters', 'user')
                ->withPeriodRoomsWherePeriodsIn($request->Periods)
                ->with(['referred' => function ($q) use ($date) {
                    $q
                        ->whereNotIn('ReferralTypeId', [9])// dont load LD
                        ->where('Date', $date)
                        ->with('user', 'teacher', 'referralType', 'assignment', 'activity','consequence.referralType')
                        ->sortByPriority();

                }])
                ->ofSchoolId( $schoolId)
                ->whereHas('counters', function ($q) {
                    //$q->where('ORoomsToBeServed', '>', 0);
                })
                ->whereHas('referred', function ($q) use ($date) { // not processed with oroom referrals for $date
                    $q
                        ->whereIn('ReferralTypeId',Referrals::$oroomReferralTypes)
                        ->where('Date', $date)
                    ;
                })
                ->join('aspnetusers', 'aspnetusers.id', '=', 'students.Id')
                ->orderBy('LastName', 'ASC')
                ->select('students.*')
                ->get();
            $reftable = collect([]);
        }
        else {
            $OroomList = Students
                ::with(['counters' => function ($q) {
                    $q->select('Id', 'ORoomsToBeServed', 'ISSDays');
                }])
                ->with(['referred'=>function($q){
                        $q->where('Date','2016-01-31 18:34:25');
                    }])
                ->with('user')
                ->whereHas('counters', function ($q) {
                    $q->where('OroomsToBeServed', '>', 0);
                })
                ->wherehas('user', function ($q) use ($schoolId) { // from the school the user requested
                    $q->where('SchoolId', $schoolId);
                })
                ->join('aspnetusers', 'aspnetusers.id', '=', 'students.Id')
                ->orderBy('LastName', 'ASC')
                ->select('students.Id', 'students.Grade')
                ->get();


            $reftable = Oroomactivity
                ::with('student.student.counters', 'teacher', 'period', 'activity')
                ->where('Date', $date)
                ->wherehas('student', function ($q) use ($schoolId) { // from the school the user requested
                    $q->where('SchoolId', $schoolId);
                })
                ->orderBy('Id', 'DESC')
                ->get();


        }
        $refsWithNoOverlaps = $OroomList->reject(function($student){
            // filter referrals to get only iss referrals
            $student->referred = $student->referred->filter(function($item){
                $issReferrals = collect(Referrals::$issReferralTypes);
                // true if  is iss referral && is not cleared (has valid Overlap)
                return   $issReferrals->contains($item->ReferralTypeId) && $item->ActivityTypeId != 87 ;
            });

            return  $student->referred->count() > 0;
        });
        $OroomListCount = $refsWithNoOverlaps->count();
        $reftableListCount = $reftable->count();

        if ($request->has('count')) {
            $OroomList = $refsWithNoOverlaps->count();
            $reftable = $reftable->count();
        }

        return compact('OroomList', 'reftable', 'OroomListCount', 'reftableListCount');
    }

    /**
     * Show the form for creating a new resource.
     * @urlEncodedParams
     * reftable, ormList, referral
     * @return \Illuminate\Http\Response
     * {record saved}
     */
    public function create(Request $request)
    {

    }

    /**
     * Store a newly created resource in storage.
     *
     *  *@incoming
     * {studentId, sentOutById, activityId, deferralIn,date, periodID}
     *
     * * @urlEncodedParams
     * reftable, ormlist, referral
     *
     *
     * @param  \Illuminate\Http\Request $request
     *
     *
     * @return \Illuminate\Http\Response
     * {record saved}
     */
    public function store(Request $request)
    {
        // used to make 2 or more kinds of ORM referrals therefore request contains the referralType
        // and the activity type

        if ($request->has('reftable')) {  // ADD STUDENT TO OROOM ACTIVITY TABLE


            $record = Oroomactivity::create([
                "StudentId" => $request->StudentId,
                'PeriodId' => $request->PeriodId,
                'ActivityId' => $request->ActivityId,
                'Date' => new Carbon($request->Date)
            ]);

            $record->load('student.student', 'teacher', 'period', 'activity');
            return $record;
        }
        else if ($request->has('ormlist')) {   // CREATE A REFERRAL FOR THE STUDENT
            // check the student status to define the Activity Type
            $date = $this->getDate($request);

            $useraction = Useractions::create([
                'ActionDate' => $date,
                'ActionByUserId' => $request->TeacherId === 0 ? $this->userId : $request->TeacherId,
                'ActionType' => $request->ActivityTypeId,
                'ActionToUserId' => $request->StudentId,
                'Comment' => $request->Comment
            ]);

            $referral = Referrals::create([
                'UserId' => $this->userId,
                'StudentId' => $request->StudentId,
                'TeacherId' => $request->TeacherId,
                'ReferralTypeId' => $request->ReferralTypeId,
                'Date' => $date
            ]);

            /* for table RelationShip Between  Refferals and UserActions */
            //ReferralsActions::create(['ReferralId'=>$referral->Id, 'UseractionId'=>$useraction->Id ]);
            // now this referral is linked to an action(s)

            $counters = Counters::firstOrCreate(['Id' => $request->StudentId]);
            if ($request->ReferralTypeId === 1) {
                $counters->increment('ORoomsToBeServed');
                $counters->increment('ORMReferrals');
            } else {
                $counters->increment('ISSDays');
                $counters->increment('ISSReferrals');
            }

            $counters->save();

            $referral = Students::with('counters', 'user')->find($request->StudentId);

            return ['UserAction' => $useraction, 'Referral' => $referral, 'Counters' => $counters];
        }

        return 'wrong parameters';
    }

    /**
     * Display the ORM referrals of a student
     *
     * @param  int $id
     * @param Request $request
     * @queryString
     *      light   - boolean specify if only referral or all its relations must be returned
     * @payload
     * @return \Illuminate\Http\Response
     */
    public function show($id, Request $request)
    {
        $referrals = Referrals::where('StudentId', $id)->get();
        if (!$request->light)
            $referrals->load('user', 'teacher', 'studentUser', 'assignment', 'referralType', 'activity');

        return $referrals;

    }

    /**
     * Show the form for editing the specified resource.
     *
     * @incomming
     *
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
     * $@urlEncodedParams
     * reftable (sentoutby, activity, referralin), ormlist()
     *
     * @param  \Illuminate\Http\Request $request
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //DB::beginTransaction();

        $schoolId = $this->user->SchoolId;

        $today = $this->getDate($request);
        $tomorrow =$today->copy()->addWeekDay();
        $now = Carbon::now();

        if ($request->has('reftable')) {/// OROOM ACTIVITY
            $updated = Oroomactivity::findOrFail($id)->update($request->except('reftable'));
        } else if ($request->has('ormlist')) {
            //work some logic with the counters
        } else if ($request->has('attendance')) {

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



//            if ($referral) {
//                $referral->update(['ActivityTypeId' => $request->ActionType]);
//            }

            // if( $referral->RefferalStatus == 1 )   ,  return; // already taked attendance;

            //present
            if ($request->ActionType == 24) {
                $msg = 'Present, Oroom Completed';
                $counters->decrement('ORoomsToBeServed');
                $referral->update(['RefferalStatus' => 1, 'ActivityTypeId' => $request->ActionType]);


                /*
                    SHOULD ONLY MOVE OROOMS BECAUSE, IF IT HAS ISS THIS CAN'T HAPPEN
                */
                $pendingReferrals = Referrals// move other today's referrals for tomorrow
                ::where('Date', $today)
                    ->where('RefferalStatus', 0)// pending
                    ->whereIn('ReferralTypeId', Referrals::$oroomReferralTypes)// Orooms
                    ->where('StudentId', $referral->StudentId);



                $pendingReferrals->update(['Date' => $tomorrow]);


                //if AEC was completed mark it as AEC present complete
//					$AECPresentActivityId = 49;
//					if ($request->aecComplete) {
//						$pendingAECReferrals = Referrals
//							::where('Date', $today)
//							->where('RefferalStatus', 0)
//							->where('ReferralTypeId', 12)
//							->where('StudentId', $referral->StudentId);
//
//						$pendingAECReferrals->update(['RefferalStatus' => 0, 'Overlap' => 1, 'OverlapId' => 6, 'OverlapActionId' => $request->ActionType]);
//
//						$useraction = Useractions::create([
//								'ActionDate' => $today,
//								'ActionByUserId' => $this->userId,
//								'ActionType' => 49,
//								'ActionToUserId' => $referral->StudentId,
//								'Comment' => $request->Comment . ' In ORoom '
//						]);
//					} else {// Reschedule To Next Day 
//					}


                if ($referral->ReferralTypeId !== 3) {// no ORM+1, set debt to 0
                    $counters->debt = 0;
                } else {
                    $msg = 'Present, Oroom + 1 Completed, Oroom(s) Left ';
                }
            }
            //ditch (No Show, Sent Out, Walked Out
            else if ($request->ActionType == 25 || $request->ActionType == 28 || $request->ActionType == 29) {

                // before start rotating referrals , make a copy,
                $referralCopy = $referral->replicate();
                $referralCopy->save();
                $referralCopy->update(['created_at'=>$referral->created_at]);

                $referral->update(['RefferalStatus' => 1, 'ActivityTypeId'=> $request->ActionType]);
                // link the current to the copy
                /*
                 * $referral->Next = $currentReferralCopy->Id
                 */

                $pendingReferrals = Referrals// move other today's referrals for tomorrow
                ::where('Date', $today)
                    ->where('RefferalStatus', 0) // pending
                    ->whereNotIn('ReferralTypeId', [12, 18]) //Dont move AEC or Reteach. Leave as it is
                    ->where('StudentId', $referral->StudentId)
                    ->update(['Date' => $tomorrow]);


                // beyond this point, a consequence will be created,, either ORM -> ISS (),  ORM+1 -> ISS (),  ORM->ORM+1 ()

                // assume consequence will be ORM + 1
                $consequence = Referrals::create([ // create new consequence for tomorrow
                    'UserId' => $this->userId,
                    'StudentId' => $referral->StudentId,
                    'TeacherId' => 0,
                   // 'ReferralTypeId' => 0,
                    'Date' => $tomorrow //  defaults to tomorrow
                ]);

                // additionally, an action will be logged in Useractions, the action type will differ. either ORM+1->ISS(45), ORM->ISS(45) or  ORM->ORM+1, (comment will differ too)
                $useraction   = Useractions::create([
                    'ActionDate' => $today,
                    'ActionByUserId' => $this->userId,
                    'ActionToUserId' => $referral->StudentId,
                ]);
                if($referral->ReferralTypeId === 3 ){
                    $comment  = '[Student Ditched ORoom on ' . $today . '  and referral was ORM+1. Assigning ISS (System)]';
                    $extra = '';
                    $consequenceTypeId = 17; // ORM+1 -> ISS
                }else if($counters->debt === 1) {
                    $comment = '[Student Ditched ORoom on ' . $today. '  and debt was 1. Assigning ISS (System)]';
                    $extra = "regular o-room and debt was 1";
                    $consequenceTypeId = 6; // ORM -> ISS
                }

                if ($referral->ReferralTypeId === 3 || $counters->debt === 1) {// if referral type is oroom + 1 or debt === 1  then create an iss
                    $msg = "Ditched O-Room. $extra Assigned ISS*";
                    $counters->increment('ISSDays');
                    $useraction->update([
                            'ActionType' => 45, // ORM +1 -> ISS
                            'Comment' => $comment
                        ]);

                    $consequence->update(['ReferralTypeId'=>$consequenceTypeId]);

                    $counters->debt = 0;
                } else { // if referral is not orm + 1  and debt is not 1 then create an orm+1
                        $msg = 'Assigned Oroom + 1';
                        $counters->increment('ORoomsToBeServed');
                        $counters->debt = 1;
                        $useraction->update([
                            'ActionType' => 7, // ORM -> ORM + 1
                            'Comment' => '[Student Ditched ORoom on ' . $today . '  and debt was 0. Assigning Oroom + 1 (System)]'
                        ]);

                        $consequence->update(['ReferralTypeId' => 3]); // ORM + 1
                }
                // mark current with the action type and set status to 1 so it wont be rotated
                $referral->update([ 'ConsequenceId'=>$consequence->Id]);
            }
            // clear Oroom referrals
            else if($request->ActionType == 88){

                //DB::beginTransaction();
                $toRemoveReferralIds = $request->ToRemoveReferralIds;

                // if deleting a ORM + 1 , set debt to 0
                $countORMPlusOne = Referrals::whereIn('Id',$toRemoveReferralIds)->where('ReferralTypeId',3)->get()->count();
                // ADJUST COUNTERS ACCORDINGLY
                if($countORMPlusOne > 0) {
                    Counters::find($request->StudentId)->update(['debt'=>0]);
                }


                if($request->RemoveAll){
                    $msg = 'Removing/Clearing All ORM referrals';
                    // grab 1 from the referrals to remove to use as trace
                    $traceReferral = Referrals::find(array_shift($toRemoveReferralIds));

                    //mark this referral so it wont be moved
                    $traceReferral->update(['RefferalStatus' => 1, 'ActivityTypeId' => $request->ActionType]);
                    Counters::find($request->StudentId)->decrement('ORoomsToBeServed');// decrease one here as 1 will not be removed
                }else{
                    $msg = 'Removing '. count($toRemoveReferralIds) .' Oroom refferals and ';
                    // grab 1 from the referrals to remove to use as trace


                    $moveDate = new Carbon($request->MoveClearToDate);
                    if ($moveDate->eq(Carbon::today())) { // leave trace and use as real,
                        $msg .= 'leaving pending to serve on ';

                    } else { //  mark trace as clear,
                        $msg .= 'moving pending to ';
                        $traceReferral = Referrals::find(array_shift($toRemoveReferralIds));
                        $traceReferral->update(['RefferalStatus' => 1, 'ActivityTypeId' => $request->ActionType]);

                        $pendingReferrals = Referrals
                            ::where('Date', $today)
                            ->where('RefferalStatus', 0)// pending
                            ->ofTypes( Referrals::$oroomReferralTypes)// orm
                            ->where('StudentId', $request->StudentId)
                            ->update(['Date' => $moveDate]);
                        Counters::find($request->StudentId)->decrement('ORoomsToBeServed');// decrease one here as 1 will not be removed
                    }
                    $msg .= $moveDate->toDateString();
                }

                $result = Referrals::decreaseCountersAndRemoveReferrals($toRemoveReferralIds,$request->StudentId);
                $referrals = $this->getORMReferrals($today,$request->StudentId);
                $useraction->update(['Comment' => $useraction->Comment . "[Clearing " . count($toRemoveReferralIds) . " Oroom referrals (System)]"]);

            }
            // left School, school absent, other
            else {

                $msg = 'Rescheduled For Tomorrow';

                // before start rotating referrals , make a copy,
                $referralCopy = $referral->replicate();
                $referralCopy->save();
                $referralCopy->update(['created_at'=>$referral->created_at]);

                // mark current with the action type and set status to 1 so it wont be rotated
                $referral->update(['RefferalStatus' => 1, 'ActivityTypeId'=> $request->ActionType]);
                // link the current to the copy
                /*
                 * $referral->Next = $referralCopy->Id
                 */

                $pendingReferrals = Referrals// move other today's referrals for tomorrow
                ::where('Date', $today)
                    ->where('RefferalStatus', 0)
                    ->whereNotIn('ReferralTypeId', [12, 18])//DONT MOVE AEC REFERRALS OR RETEACH
                    ->where('StudentId', $referral->StudentId)
                    ->update(['Date' => $tomorrow]);




                $useraction->update(['Comment' => $useraction->Comment . '[Rescheduling For Next Day(System)]']);
            }
            $counters->save();
            $referral->load('activity','referralType', 'teacher' );
            $counters = Counters::find($request->StudentId);
            return compact('msg', 'useraction', 'referral', 'counters', 'pendingReferrals', 'referrals');
        }
    }

    /**
     * Remove the specified resource from storage.
     * $@urlEncodedParams
     * reftable, ormlist
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id, Request $request)
    {
        //

        return $this->notImplemented();

        if ($request->has('reftamble')) {
            Oroomactivity::destroy($id);
        } else if ($request->has('ormlist')) {
            //work some logic with the counters
            $counts = json_decode($request->counters);
            $counters = Counters::find($request->StudentId)->update((array)$counts);
            //$counters->decrease('ORoomsToBeServed');
            Referrals::destroy($id);
            $useraction = Useractions::create([
                'ActionDate' => Carbon::today(),
                'ActionByUserId' => $this->userId,
                'ActionType' => 19,
                'ActionToUserId' => $request->StudentId,
                'Comment' => $request->Comment
            ]);
            return $this->deleted();
        }
    }

    private function getORMReferrals($date,$studentId){
        $referrals = Referrals::with('activity','referralType','user')
            ->where('Date',$date)
            ->ofTypes(Referrals::$oroomReferralTypes)
            ->where('StudentId',$studentId)
            ->join('referraltypes', 'referraltypes.id', '=', 'ReferralTypeId')
            ->orderBy('Priority', 'ASC')
            ->select('refferals.*')
            ->get();
        return $referrals;
    }

}
	