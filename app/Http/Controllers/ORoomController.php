<?php

namespace App\Http\Controllers;

use App\Helpers\ORoomHelper;
use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Oroomactivity;
use App\Referrals;
use App\Useractions;
use App\Counters;
use Carbon\Carbon;
use DB;
use App\Students;
use App\Referralactions;

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
            $OroomList = ORoomHelper::getORMList($schoolId,$date,$request->Periods);

            // get referrals that do not have overlap with iss
            $refsWithNoISSOverlaps = $OroomList->reject(function($student){
                $issReferralTypes = collect(Referrals::$issReferralTypes);
                // filter referrals to get only iss referrals
                $issOnly = $student->referred->filter(function($item)use ($issReferralTypes){
                    // true if  is iss referral && is not cleared (has valid Overlap)
                    return   $issReferralTypes->contains($item->ReferralTypeId) && $item->ActivityTypeId != 87 ;
                });

                return  $issOnly->count() > 0;
            });
            $OroomListCount = $refsWithNoISSOverlaps->count();
            //  subtract students that had already been taken attendance on
            foreach($OroomList as $student){
                if($student->referred[0]['RefferalStatus'] ==1)
                    $OroomListCount--;
            }
        }
        // needed for oroom activity log (oroom during day)
        else {
            $reftable = ORoomHelper::getOroomDuringDayList($schoolId,$date);
            $reftableListCount = $reftable->count();
        }


        if ($request->has('count')) {
            $OroomList = $OroomListCount;
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

            $referralAction = Referralactions::create([
                'ReferralId'=>$referral->Id,
                'ActivityId'=>$useraction->Id,
                'Type'=>0
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

        $schoolId = $this->user->SchoolId;

        $today = $this->getDate($request);
        $tomorrow =$today->copy()->addWeekDay();
        $now = Carbon::now();

        if ($request->has('reftable')) {/// OROOM ACTIVITY
            $referredInTime = $request->has('ReferredInAt')?Carbon::now():null;
            $content = array_merge($request->except('reftable','ReferredInAt'),['ReferredInAt'=>$referredInTime]);
            $updated = Oroomactivity::findOrFail($id)->update($content);
            return Oroomactivity::findOrFail($id);
        }
		else if ($request->has('ormlist')) {
            //work some logic with the counters
        }
		else if ($request->has('attendance')) {
            $referral = Referrals::find($id);

            // attendance was already taken
            if($referral->RefferalStatus == 1){
                $referral->load('activity','consequence');
                return response(['msg'=>'Attendance was already taken, may be by another user','referral'=>$referral],409);
            }

            $counters = Counters::find($referral->StudentId);

            $pendingReferrals = Referrals::where('Date',$today)
                ->where('RefferalStatus',0)
                ->ofTypes(Referrals::$oroomReferralTypes)
                ->where('StudentId',$referral->StudentId)
                ;

            $useraction = new Useractions([
                'ActionDate' => $today,
                'ActionByUserId' => $this->userId,
                'ActionType' => $request->ActionType,
                'ActionToUserId' => $referral->StudentId,
                'Comment' => $request->Comment
            ]);

            //present
            if ($request->ActionType == 24) {
                $msg = 'Present, Oroom Completed';
                $counters->decrement('ORoomsToBeServed');
                $referral->update(['RefferalStatus' => 1, 'ActivityTypeId' => $request->ActionType]);

                /*
                    SHOULD ONLY MOVE OROOMS BECAUSE, IF IT HAS ISS THIS CAN'T HAPPEN
                */
                $pendingReferrals->update(['Date' => $tomorrow]);

                // no ORM+1, set debt to 0
                if ($referral->ReferralTypeId !== 3) {
                    $counters->debt = 0;
                }
                else {
                    $msg = 'Present, Oroom + 1 Completed, Oroom(s) Left ';
                }

            }
            //ditch (No Show, Sent Out, Walked Out
            else if ($request->ActionType == 25 || $request->ActionType == 28 || $request->ActionType == 29) {
                // before start rotating referrals , make a copy,
                $referralCopy = $referral->replicate();
                $referralCopy->save();
                $referralCopy->update(['created_at'=>$referral->created_at]);

                // record attendance on referral and mark status as attendance taken
                $referral->update(['RefferalStatus' => 1, 'ActivityTypeId'=> $request->ActionType]);

                // move other today's referrals for tomorrow
                $pendingReferrals->update(['Date' => $tomorrow]);

                // beyond this point, a consequence will be created,, either ORM -> ISS (),  ORM+1 -> ISS (),  ORM->ORM+1 ()

                $consequence = new Referrals([
                    'UserId' => $this->userId,
                    'StudentId' => $referral->StudentId,
                    'TeacherId' => 0,
                    'Date' => $tomorrow //  defaults to tomorrow
                ]);

                // additionally, an action will be logged in Useractions, the action type will differ. either ORM+1->ISS(45), ORM->ISS(45) or  ORM->ORM+1, (comment will differ too)
                $consequenceUseraction   = new Useractions([
                    'ActionDate' => $today,
                    'ActionByUserId' => $this->userId,
                    'ActionToUserId' => $referral->StudentId,
                ]);

                // referral type is ORM+1
                if($referral->ReferralTypeId === 3 ){
                    $comment  = '[Student Ditched ORoom on ' . $today . '  and referral was ORM+1. Assigning ISS (System)]';
                    $extra = '';
                    $consequenceTypeId = 17; // ORM+1 -> ISS
                }
                // student's debt is 1
                else if($counters->debt === 1) {
                    $comment = '[Student Ditched ORoom on ' . $today. '  and debt was 1. Assigning ISS (System)]';
                    $extra = "regular o-room and debt was 1";
                    $consequenceTypeId = 6; // ORM -> ISS
                }

                // if referral type is oroom + 1 OR debt === 1  then consequuence is ISS
                if ($referral->ReferralTypeId === 3 || $counters->debt === 1) {
                    $msg = "Ditched O-Room. $extra Assigned ISS*";
                    $counters->increment('ISSDays');
                    $consequenceUseraction->fill([
                            'ActionType' => 45, // ORM +1 -> ISS
                            'Comment' => $comment
                        ]);

                    $consequence->fill(['ReferralTypeId'=>$consequenceTypeId]);

                    $counters->debt = 0;
                }
                // if referral is not orm + 1  and debt is not 1 then create an orm+1
                else {
                        $msg = 'Assigned Oroom + 1';
                        $counters->increment('ORoomsToBeServed');
                        $counters->debt = 1;
                        $consequenceUseraction->fill([
                                'ActionType' => 7, // ORM -> ORM + 1
                                'Comment' => '[Student Ditched ORoom on ' . $today . '  and debt was 0. Assigning Oroom + 1 (System)]'
                            ]);

                        $consequence->fill(['ReferralTypeId' => 3]); // ORM + 1
                }

                $consequenceUseraction->save();
                $consequence->save();
                $referral->update(['ConsequenceId'=>$consequence->Id]);
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
                $referral = $traceReferral;
                $result = Referrals::decreaseCountersAndRemoveReferrals($toRemoveReferralIds,$request->StudentId);
                $referrals = $this->getORMReferrals($today,$request->StudentId);
                $useraction->fill(['Comment' => $useraction->Comment . "[Clearing " . count($toRemoveReferralIds) . " Oroom referrals (System)]"]);

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

                $pendingReferrals->update(['Date' => $tomorrow]);


                $useraction->fill(['Comment' => $useraction->Comment . '[Rescheduling For Next Day(System)]']);
            }

            $useraction->save();
            // link event(action)  with referral
            Referralactions::create([
                'ReferralId'=>$referral->Id,
                'ActivityId'=>$useraction->Id,
                'Type'=>1// attendance type
            ]);
            $counters->save();
            $referral->load('activity','referralType', 'teacher', 'consequence.referralType' );
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



        if ($request->has('reftable')) {
            return Oroomactivity::destroy($id);
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
	