<?php

namespace App\Http\Controllers;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Referrals;
use App\Useractions;
use App\User;
use App\Assignments;
use App\Students;
use Carbon\Carbon;
use \App\Counters;
use Illuminate\Http\Request;
use DB;

class AECController extends Controller {

	protected $aec_referral_type = 12;
	protected $active_referra_status = 0;
	protected $referred_aec_action = 48;

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function index(Request $request) {
		 //		// feb 9. ask confirmation
//		$date = new Carbon("Feb 10 2016");
//		$schoolId = $this->user->SchoolId;
//		$aec = Referrals
//			::where('Date', $date)
//			->where('ReferralTypeId', 12)
//			->where('RefferalStatus', 0)
//			->whereHas('user', function($q)use($schoolId) { // from the school the user requested
//				$q->where('SchoolId', $schoolId);
//			})
//			->get();
//		
//		foreach ($aec as $ref) {
//			$action = $ref->ActivityTypeId;
//			$studentId = $ref->StudentId;
//			$user = $ref->UserId;
//			$date = $ref->Date;
//			$comment = $ref->Comment;
//			$userAction = Useractions::create([
//					'ActionDate' => $date,
//					'ActionByUserId' => $user,
//					'ActionType' => $action,
//					'ActionToUserId' => $studentId,
//					'Comment' => $comment
//			]);
//			
//			if(!$action){
//				$userAction->update(['Comment'=>'Student Had Either Oroom, ISS, or OSS']);
//			}
//		}
			return response(['msg' => 'Success']);
		}

		/**
		 * Show the form for creating a new resource.
		 *
		 * @return Response
		 */
		public function create() {
			//
		}

		/**
		 * Store a newly created resource in storage.
		 *
		 * @return Response
		 */
		public function store(Request $request) {
			//
			$userId = $this->getUserId($request);
			$date = new Carbon($request->date);

			$dataIn = collect($request->data);

			foreach ($dataIn as $ref) {
				$teacher = User::find($ref['TeacherId']);
				$assignment = Assignments::find($ref['AssignmentId']);
				$referral = Referrals::create([
						'UserId' => $this->userId,
						'TeacherId' => $teacher->id,
						'StudentId' => $ref['StudentId'],
						'AssignmentId' => $assignment->Id,
						'RefferalStatus' => $this->active_referra_status,
						'ReferralTypeId' => $this->aec_referral_type,
						'Date' => $date,
				]);

				$action = Useractions::create([
						'ActionDate' => $date,
						'ActionByUserId' => $teacher->id,
						'ActionToUserId' => $ref['StudentId'],
						'ActionType' => $this->referred_aec_action,
						'Comment' => 'Student Referred from teacher '
						. $teacher->LastName . ', for assignment '
						. $assignment->Name . ', for date ' . $date->toDateString()
				]);
			};
			$msg = 'List Successfully Submited';
			return compact('msg', 'referra');
		}

		/**
		 * Display the specified resource.
		 *
		 * @param  int  $id
		 * @return Response
		 */
		public function show($id) {
			//
			$schoolId = $this->user->SchoolId;
			$date = new \Carbon\Carbon($id);

			$aec = Students
				::with('counters', 'user', 'classes.professor_class.room')
				->with(['referred' => function($q)use($date) {
						$q
						->where('Date', $date)
						->where('ReferralTypeId', 12)
						->where('RefferalStatus', 0)
						->with('assignment', 'teacher')
						;
					}])
				->whereHas('user', function($q)use($schoolId) { // from the school the user requested
					$q->where('SchoolId', $schoolId);
				})
				->whereHas('referred', function($q)use($date) {
					$q
					->where('RefferalStatus', 0)
					->where('ReferralTypeId', 12)
					->where('Date', $date);
				})
				->get();

			return $aec;
		}

		/**
		 * Show the form for editing the specified resource.
		 *
		 * @param  int  $id
		 * @return Response
		 */
		public function edit($id) {
			//
		}

		/**
		 * Update the specified resource in storage.
		 *
		 * @param  int  $id
		 * @return Response
		 */
		public function update($id, Request $request) {

			switch ($request->param) {
				case 'attendance':


					if ($request->has('param2')) {
						$referrals = $request->Referrals;

						foreach ($referrals as $ref) {
							$referral = Referrals::find($ref['Id']);
							$referral->update(['HasFolder' => $ref['HasFolder'] ? 1 : 0]);
						}

						return ['msg' => 'marked as Has FOlder'];
					}
					if ($request->ActionType == 49) {
						$msg = 'Present, ';
						for ($i = 0; $i < count($request->Referrals); $i++) {
							$ref = $request->Referrals[$i];
							$referral = Referrals::with('assignment')->findOrFail($ref['Id']);
							$msg .= '(' . $referral->assignment->Name;
							$msg .= ' :' . ($ref['AssignmentCompleted'] ? 'complete' : 'incomplete') . ')';
							$referral->update([
								'AssignmentCompleted' => $ref['AssignmentCompleted'] ? 1 : 0,
								'Comment' => $request->Comment,
								'ActivityTypeId' => $request->ActionType
							]);
						}

						/*
						  $action = UserActions::create([
						  'ActionDate' => Carbon::today(),
						  'ActionByUserId' => $this->userId,
						  'ActionToUserId' => $referral->StudentId,
						  'ActionType' => $request->ActionType,
						  'ParentNotified' => $request->data['ParentNotified'],
						  'StudentNotified' => $request->data['StudentNotified'],
						  'Completed' => $request->Completed,
						  'Comment' => $request->Comment
						  ]);
						  if ($request->input('Completed')) {
						  $action->ActionType = 49;
						  $action->Comment = $request->Comment
						  . ' [student was present for assignment ' . $referral->assignment['Name'] . ' on ' . Carbon::now() . '(System)]';
						  } else {// not completed, reschedule to next day
						  $referral->update([ 'Date' => Carbon::tomorrow()]);
						  $action->ActionType = 60;
						  $action->Comment = $request->Comment
						  . "Student didn't complete assignment "
						  . $referral->assignment->Name . " , Rescheduling for Next Day";
						  }
						 */

						return compact('msg', 'referral');
					}//ditched , no show, sent out, walked out 
					else if ($request->ActionType == 52 || $request->ActionType == 55 || $request->ActionType == 56) {
						$activity = \App\Activities::find($request->ActionType);
						$msg = 'student ditchedAEC ,' . $activity->Name . ' ';
						$counters = Counters::find($id);
						$counters->increment('ORoomsToBeServed');
						//$counters->save();
						/* 					
						  $action = UserActions::create([
						  'ActionDate' => Carbon::today(),
						  'ActionByUserId' => $this->userId,
						  'ActionToUserId' => $id,
						  'ActionType' => 59,
						  'Comment' => $request->comment . ' [student ditchedAEC (' . $request->ActionType . '), Assigned O-Room on ' . Carbon::now() . '(System)]',
						  ]);
						  //do not reassign AEC, just set them as referral status of 1
						  $referrals = Referrals::whereIn('Id', $request->referrals)
						  ->update(['RefferalStatus' => 1, 'ActivityTypeId' => $request->ActionType]);
						 */

						$referrals = Referrals::whereIn('Id', $request->Referrals)
							->update([
							'AssignmentCompleted' => $request->AssignmentCompleted ? 1 : 0,
							'Comment' => $request->Comment,
							'ActivityTypeId' => $request->ActionType
						]);
						$date = new Carbon($request->Date);
						$consequence_date = $request->ActionType == 55 ? $date : $date->addWeekDay();
						$msg .= 'Assigning Oroom For ' . ($request->ActionType == 55 ? 'Today' : 'Tomorrow');
						$consequence = Referrals::create([
								'UserId' => $this->userId,
								'StudentId' => $id,
								'TeacherId' => 0,
								'ReferralTypeId' => 16,
								'Date' => $consequence_date
						]);
						$referrals = Referrals::whereIn('Id', $request->Referrals)->get();
						return compact('msg', 'referrals', 'consequence');
					} else {// left school, school absent, other
						$action = UserActions::create([
								'ActionDate' => Carbon::today(),
								'ActionByUserId' => $this->userId,
								'ActionToUserId' => $id,
								'ActionType' => $request->ActionType,
								'Comment' => $request->comment . '[Assigning Oroom For Next Day and AEC after that(System)]',
						]);
						$referrals = Referrals::wherein('Id', $request->referrals)
							->update(['Date' => Carbon::tomorrow()]);

						return response(
							['msg' => 'Student Reassigned for Tomorrow', 'action' => $action, 'referrals' => $referrals]
							, 200);
					}
					break;

				case 'reschedule':
					//DB::beginTransaction();
					$msg = 'Student Rescheduled for ' . $request->newDate;
					$newDate = new Carbon($request->newDate);
					$action = Useractions::create([
							'ActionDate' => new Carbon($request->Date),
							'ActionByUserId' => $this->userId,
							'ActionToUserId' => $id,
							'ActionType' => 50,
							'Comment' => $request->Comment . '[Student Rescheduled for ' . $request->newDate . '(System)]',
							'Excused' => $request->excused ? 1 : 0
					]);
					$referrals = Referrals::whereIn('Id', $request->ReferralIds)->get();
					foreach ($referrals as $ref) {
						$new_ref = $ref->replicate();
						$new_ref->Date = $newDate;
						$new_ref->ActivityTypeId = 0;
						$new_ref->save();
					}
					//$rescheduled_referrals = $referrals->replicate()->save();
					$referrals = Referrals::whereIn('Id', $request->ReferralIds);
					$referrals->update([
						'Comment' => $request->Comment,
						'ActivityTypeId' => 50,
						'NewDate' => $newDate,
						'Excused' => $request->excused ? 1 : 0
					]);
					$referrals = Referrals::whereIn('Id', $request->ReferralIds)->get();
					return compact('msg', 'referrals');
					break;

				case 'clear':
					$msg = 'Student Was Cleared From AEC';
					$referrals = Referrals::whereIn('Id', $request->ReferralIds);
					$referrals->update([
						'Comment' => $request->Comment,
						'ActivityTypeId' => 51,
					]);
					$referrals = Referrals::whereIn('Id', $request->Referrals)->get();
					compact('msg', 'referrals');
					break;

				default:
					return response('Unknown Parameter "' . $request->param . '"', 500);
			}
			return compact('msg', 'referrals');
		}

		/**
		 * Remove the specified resource from storage.
		 *
		 * @param  int  $id
		 * @return Response
		 */
		public function destroy($id) {
			//
		}

	}
	