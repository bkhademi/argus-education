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

class ORoomController extends Controller {

	/**
	 * Display a listing of the resource.
	 * @incoming
	 * 	{PeriodId, Date }
	 * @return \Illuminate\Http\Response
	 *  [reftable1, OroomList]
	 */
	public function index(Request $request) {
		$id = $this->userId;
		$schoolId = $this->user->SchoolId;
//		

		$today = Carbon::today();
		$date = $today; //$this->getDate($request);



		if ($request->has('roster')) {
//			$ormlist = Referrals
//				::with(
//					'studentUser.student.counters', 'studentUser.student.classes.professor_class.classs', 'studentUser.student.classes.professor_class.room', 'referralType'
//				)
//				//->where('Date', $today)
//				->wherehas('studentUser', function($q)use($schoolId) { // from the school the user requested
//					$q->where('SchoolId', $schoolId);
//					
//				})
//				//->whereIn('ReferralTypeId', [ 1, 2, 3])
//				->where('RefferalStatus', 0)
//				->get();
			$ormlist = Students
				::with('counters', 'user', 'classes.professor_class.room')
				->with(['referred' => function($q)use($date) {
						$q->where('RefferalStatus', 0)
						->whereNotIn('ReferralTypeId', [9])// dont load LD
						->where('Date', $date)
						->with('user', 'teacher', 'referralType', 'assignment')
						->join('referraltypes', 'referraltypes.id', '=', 'ReferralTypeId')
						->orderBy('Priority', 'ASC')
						->select('refferals.*')
						;
					}])
					->wherehas('user', function($q)use($schoolId) { // from the school the user requested
						$q->where('SchoolId', $schoolId);
					})
					->whereHas('counters', function($q) {
						$q->where('ORoomsToBeServed', '>', 0);
					})
					->whereHas('referred', function($q)use($date) { // not processed with oroom referrals for $date
						$q
						->where('RefferalStatus', 0)
						->whereIn('ReferralTypeId', [1, 2, 3, 16, 19])
						->where('Date', $date)
						;
					})
					->join('aspnetusers', 'aspnetusers.id', '=', 'students.Id')
					->orderBy('LastName', 'ASC')
					->select('students.*')
					->get();

//			$ormlist = Students::with('counters', 'user', 'classes.professor_class.classs', 'classes.professor_class.room')
//				->whereHas('counters', function($q) {
//					$q
//					->where('OroomsToBeServed', '>', 0)
//					//->where('ISSDays', '=', 0)
//					;
//				})
//				->wherehas('user', function($q)use($schoolId) { // from the school the user requested
//					$q->where('SchoolId', $schoolId);
//				})
//				->get();

				$reftable = [];
			} else if ($request->has('count')) {
				$ormlist = Students
						::with('counters', 'user', 'classes.professor_class.classs', 'classes.professor_class.room')
						->wherehas('user', function($q)use($schoolId) { // from the school the user requested
							$q->where('SchoolId', $schoolId);
						})
						->whereHas('counters', function($q) {
							$q->where('ORoomsToBeServed', '>', 0);
						})
						->whereHas('referred', function($q)use($date) { // not processed with oroom referrals for $date
							$q
							->where('RefferalStatus', 0)
							->whereIn('ReferralTypeId', [1, 2, 3, 16])
							->where('Date', $date)
							;
						})
						->get()->count();
				$reftable = Oroomactivity
						::where('Date', $today)
						->wherehas('student', function($q)use($schoolId) { // from the school the user requested
							$q->where('SchoolId', $schoolId);
						})
						->get()->count();
			} else {
				$ormlist = Students::with('counters', 'user', 'classes.professor_class.classs', 'classes.professor_class.room')
					->whereHas('counters', function($q) {
						$q
						->where('OroomsToBeServed', '>', 0)
						//->where('ISSDays', '=', 0)
						;
					})
					->wherehas('user', function($q)use($schoolId) { // from the school the user requested
						$q->where('SchoolId', $schoolId);
					})
					->join('aspnetusers', 'aspnetusers.id', '=', 'students.Id')
					->orderBy('LastName', 'ASC')
					->select('students.*')
					->get();
//				Referrals::with('user', 'studentUser.student.counters', 'teacher')
//					->where('Date', $today)
//					->wherehas('user', function($q)use($schoolId) { // from the school the user requested
//						$q->where('SchoolId', $schoolId);
//					})
//					->whereIn('ReferralTypeId', [ 1, 2, 3])
//					->where('RefferalStatus', 0)
//					->get();
				if ($request->has('PeriodId')) {
					$reftable = Oroomactivity::with('student.student.counters', 'teacher', 'period', 'activity')
						->where('PeriodId', $request->PeriodId)
						->where('Date', $today)
						->wherehas('student', function($q)use($schoolId) { // from the school the user requested
							$q->where('SchoolId', $schoolId);
						})
						->get();
				} else {
					$reftable = Oroomactivity::with('student.student.counters', 'teacher', 'period', 'activity')
						->where('Date', $today)
						->wherehas('student', function($q)use($schoolId) { // from the school the user requested
							$q->where('SchoolId', $schoolId);
						})
						->orderBy('Id', 'DESC')
						->get();
				}
			}
			return ['OroomList' => $ormlist, 'reftable' => $reftable];
		}

		/**
		 * Show the form for creating a new resource.

		 * @urlEncodedParams
		 * reftable, ormList, referral
		 * @return \Illuminate\Http\Response
		 * {record saved}
		 */
		public function create(Request $request) {
			
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
		 * @param  \Illuminate\Http\Request  $request
		 * 
		 * 
		 * @return \Illuminate\Http\Response
		 * {record saved}
		 */
		public function store(Request $request) {

			if ($request->has('reftable')) {
				//return $request->except('reftable');
				//$request->Date = new Carbon($request->Date);

				$record = Oroomactivity::create([
						"StudentId" => $request->StudentId,
						'PeriodId' => $request->PeriodId,
						'ActivityId' => $request->ActivityId,
						'Date' => new Carbon($request->Date)
				]);

				$record = Oroomactivity::with('student.student', 'teacher', 'period', 'activity')->find($record->Id);

				return $record;
			} else if ($request->has('ormlist')) {
				// check the student status to define the Activity Type
				$today = Carbon::today();

				$referralTypeId = Referraltypes::where('Name', $request->ReferralType)->firstOrFail()->Id;
				$useraction = Useractions::create([
						'ActionDate' => $today,
						'ActionByUserId' => $request->TeacherId === 0 ? $this->userId : $request->TeacherId,
						'ActionType' => $referralTypeId,
						'ActionToUserId' => $request->StudentId,
						'Comment' => $request->Comment
				]);

				$referral = Referrals::create([
						'UserId' => $this->userId,
						'StudentId' => $request->StudentId,
						'TeacherId' => $request->TeacherId,
						//'AssignmentId' => 0,
						'ReferralTypeId' => $referralTypeId,
						'Date' => $today
				]);



				//$student = Students::with('counters')->find($request->StudentId);
				$counters = Counters::firstOrCreate(['Id' => $request->StudentId]);
				if ($referralTypeId === 1) {
					$counters->increment('ORoomsToBeServed');
					$counters->increment('ORMReferrals');
				} else {
					$counters->increment('ISSDays');
					$counters->increment('ISSReferrals');
				}

				$counters->save();

				$referral = Referrals::with('user', 'studentUser.student.counters', 'teacher')->find($referral->Id);
				$referral = Students::with('counters', 'user')->find($request->StudentId);
				return $referral;

				return ['UserAction' => $useraction, 'Referral' => $referral, 'Counters' => $counters];
			} else if ($request->has('referral')) {


				return ['msg' => 'success'];
			}

			return 'wrong parameters';
		}

		/**
		 * Display the specified resource.
		 *
		 * @param  int  $id
		 * @return \Illuminate\Http\Response
		 */
		public function show($id) {
			if ($request->has('reftable')) {
				Oroomactivity::with('student.counters', 'teacher', 'period', 'activity')->findOrFail($id);
			} else if ($request->has('ormlist')) {
				//work some logic with the counters

				Referrals::with('user', 'studentUser')->find($id);
			}
		}

		/**
		 * Show the form for editing the specified resource.
		 * 
		 * @incomming 
		 * 

		 *
		 * @param  int  $id
		 * @return \Illuminate\Http\Response
		 */
		public function edit($id) {
			//
		}

		/**
		 * Update the specified resource in storage.
		 * 
		 * $@urlEncodedParams
		 * reftable (sentoutby, activity, referralin), ormlist()
		 *
		 *  @param  \Illuminate\Http\Request  $request
		 * @param  int  $id
		 * @return \Illuminate\Http\Response
		 */
		public function update(Request $request, $id) {
			//$this->getDate($request);
			$schoolId = $this->user->SchoolId;


			$today = Carbon::today();
			$tomorrow = Carbon::today()->addWeekDays(1);
			$afterTomorrow = Carbon::today()->addWeekDays(2);
			$now = Carbon::now();


			if ($request->has('reftable')) {
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

				if ($referral) {
					$referral->update(['ActivityTypeId' => $request->ActionType]);
				}



				//present
				if ($request->ActionType == 24) {
					$msg = 'Present, Oroom Completed';
					$counters->decrement('ORoomsToBeServed');
					$referral->update(['RefferalStatus' => 1]);

					$pendingReferrals = Referrals  // move other today's referrals for tomorrow
						::where('Date', $today)
						->where('RefferalStatus', 0)// pending
						->whereNotIn('ReferralTypeId', [12, 18]) // Dont move AEC or Reteach
						->where('StudentId', $referral->StudentId)
						->update(['Date' => $tomorrow]);

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
					//	WHAT TO DO WITH THE REATEACH IF THEY WERE IN o-ROOM, LEAVE THEM INTACT. 
					// NEXT DAY RETEACH WITH TAKE ATTENDANCE

					if ($referral->ReferralTypeId !== 3) {
						$counters->debt = 0;
					} else {
						$msg = 'Present, Oroom + 1 Completed, Oroom Left ';
					}
				}//ditch
				else if ($request->ActionType == 25 || $request->ActionType == 28 || $request->ActionType == 29) {
					$pendingReferrals = Referrals  // move other today's referrals for tomorrow  #//DONT MOVE AEC REFERRALS
						::where('Date', $today)
						->where('RefferalStatus', 0)
						->whereNotIn('ReferralTypeId', [12, 18])// not move AEC or Reteach Referrals 
						->where('StudentId', $referral->StudentId)
						->update(['Date' => $tomorrow]);

					// MOVE AEC REFERRALS TO THE FOLLOWUP LIST 
//					$AECAbsentstatus = 4;
//					$pendingAECReferrals = Referrals
//						::where('Date', $today)
//						->where('RefferalStatus', 0)
//						->where('ReferralTypeId', 12)
//						->where('StudentId', $referral->StudentId)
//					;
					// WHAT TO DO WITH RETEACH REFERRALS IF STUDENT IS DITCHED
//					$reteachAbsentstatus = 8;
//					$pendingAECReferrals->update(['RefferalStatus' => $AECAbsentstatus, 'Overlap' => 1, 'OverlapId' => 6, 'OverlapActionId' => $request->ActionType]);

					if ($referral->ReferralTypeId === 3) {// if referral type is oroom + 1
						$msg = 'Assigned ISS*';
						$counters->increment('ISSDays');
						$useraction = Useractions
							::create([
								'ActionDate' => $today,
								'ActionByUserId' => $this->userId,
								'ActionType' => 45,
								'ActionToUserId' => $referral->StudentId,
								'Comment' => '[Student Ditched ORoom on ' . $now . '  and referral was ORM+1. Assigning ISS (System)]'
						]);


						//$referral->update(['Date' => $afterTomorrow]); // move this referral for after tomorrow
						$consequence = Referrals::create([ // create new consequence for tomorrow 
								'UserId' => $this->userId,
								'StudentId' => $referral->StudentId,
								'TeacherId' => 0,
								//'AssignmentId' => 0,
								'ReferralTypeId' => 17,
								'Date' => $tomorrow
						]);

						$counters->debt = 0;
					} else {
						if ($counters->debt === 1) {
							$msg = 'ditched oroom, regular o-room and debt was 1, Assigned ISS';
							$counters->increment('ISSDays');
							$useraction = Useractions::create([
									'ActionDate' => $today,
									'ActionByUserId' => $this->userId,
									'ActionType' => 45,
									'ActionToUserId' => $referral->StudentId,
									'Comment' => '[Student Ditched ORoom on ' . Carbon::now() . '  and debt was 1. Assigning ISS (System)]'
							]);
							//$referral->update(['Date' => $afterTomorrow]); // move this referral for after tomorrow
							$consequence = Referrals::create([ // create new consequence for tomorrow 
									'UserId' => $this->userId,
									'StudentId' => $referral->StudentId,
									'TeacherId' => 0,
									'ReferralTypeId' => 6,
									'Date' => $tomorrow
							]);
							$counters->debt = 0;
						} else {
							$msg = 'Assigned Oroom + 1';
							$counters->increment('ORoomsToBeServed');
							$counters->debt = 1;
							$useraction = Useractions::create([
									'ActionDate' => $today,
									'ActionByUserId' => $this->userId,
									'ActionType' => 7,
									'ActionToUserId' => $referral->StudentId,
									'Comment' => '[Student Ditched ORoom on ' . Carbon::now() . '  and debt was 0. Assigning Oroom + 1 (System)]'
							]);
							//$referral->update(['Date' => $afterTomorrow]); // move this referral for after tomorrow
							$referral = Referrals::create([ // create new consequence for tomorrow 
									'UserId' => $this->userId,
									'StudentId' => $referral->StudentId,
									'ReferralTypeId' => 3,
									'Date' => $tomorrow]);
						}
					}
				} else {// left School, school absent, other
					$msg = 'Rescheduled For Tomorrow';

					$pendingReferrals = Referrals  // move other today's referrals for tomorrow  
						::where('Date', $today)
						->where('RefferalStatus', 0)
						->whereNotIn('ReferralTypeId', [12, 18]) #//DONT MOVE AEC REFERRALS OR rETEACH
						->where('StudentId', $referral->StudentId)
						->update(['Date' => $tomorrow]);

					// MOVE AEC REFERRALS TO THE FOLLOWUP LIST and mark the overlap as oroom
//					$AECAbsentstatus = 4;
//					$pendingAECReferrals = Referrals
//						::where('Date', $today)
//						->where('RefferalStatus', 0)
//						->where('ReferralTypeId', 12)
//						->where('StudentId', $referral->StudentId);
//
//					$pendingAECReferrals
//						->update(['RefferalStatus' => $AECAbsentstatus,
//							'Overlap' => 1, 'OverlapId' => 6,
//							'OverlapActionId' => $request->ActionType]);
					// WHAT TO DO WITH RETEACH REFERRALS IF STUDENT IS LEFT SCHOOOL, SCHOOL ABSENT OR OTHER 
//					$reteachAbsentstatus = 8;


					$referral->update(['Date' => $tomorrow]);
					$useraction->update(['Comment' => $useraction->Comment . '[Rescheduling For Next Day(System)]']);
				}
				$counters->save();
				return compact('msg', 'useraction', 'referral', 'counters', 'pendingAECReferrals');
			}
		}

		/**
		 * Remove the specified resource from storage.
		 * $@urlEncodedParams
		 * reftable, ormlist
		 * @param  int  $id
		 * @return \Illuminate\Http\Response
		 */
		public function destroy($id, Request $request) {
			//

			if ($request->has('reftable')) {
				Oroomactivity::destroy($id);
			} else if ($request->has('ormlist')) {
				//work some logic with the counters
				$counts = json_decode($request->counters);
				$counters = Counters::find($request->StudentId)->update((array) $counts);
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

	}
	