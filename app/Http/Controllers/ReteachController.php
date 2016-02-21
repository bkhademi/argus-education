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

class ReteachController extends Controller {

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function index(Request $request) {
		$date = new Carbon("Feb 02 2016");
		$schoolId = $this->user->SchoolId;
		return $schoolId;
		$aec = Referrals
			::where('Date', $date)
			->where('ReferralTypeId', 18)
			->where('RefferalStatus', 0)
			->whereHas('user', function($q)use($schoolId) { // from the school the user requested
				$q->where('SchoolId', $schoolId);
			})
			->get();
		
		foreach ($aec as $ref) {
			$action = $ref->ActivityTypeId;
			$studentId = $ref->StudentId;
			$user = $ref->UserId;
			$date = $ref->Date;
			$comment = $ref->Comment;
			$userAction = Useractions::create([
					'ActionDate' => $date,
					'ActionByUserId' => $user,
					'ActionType' => $action,
					'ActionToUserId' => $studentId,
					'Comment' => $comment
			]);
			if(!$action){
				$userAction->update(['Comment'=>'Student Had Either Oroom, ISS, or OSS']);
			}
		}
		return response(['msg'=>'Success']);
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
		$userId = $this->getUserId($request); // getUserId is in base controller
		$date = new \Carbon\Carbon($request->date);
		$dataIn = collect($request->data);
		for ($i = 0; $i < $dataIn->count(); $i++) {
			// check if the referral is already there 
			// a referral is uniquely identified by 4 fields
			// (UserID, StudentId, AssignmentId, Date)
			$teacher = User::find($dataIn[$i]['TeacherId']);

			$action = Useractions::create([
					'ActionDate' => $date,
					'ActionByUserId' => $dataIn[$i]['TeacherId'],
					'ActionToUserId' => $dataIn[$i]['StudentId'],
					'ActionType' => 63,
					'Comment' => 'Student Referred for Reteach teacher ' . $teacher->LastName . ', ' . $teacher->FirstName
			]);

			$referral = Referrals::create([
					'UserId' => $this->userId,
					'TeacherId' => $dataIn[$i]['TeacherId'],
					'StudentId' => $dataIn[$i]['StudentId'],
					//'AssignmentId' => $dataIn[$i]['AssignmentId'],
					'RefferalStatus' => 0,
					'ReferralTypeId' => 18,
					'Date' => $date
			]);
			if ($dataIn[$i]['ProfessorClassId'] !== 0) {
				$stu = Students
					::with(['classes.professor_class' => function($q) {
							$q->orderBy('PeriodId', 'ASC');
						}])
					->findOrFail($dataIn[$i]['StudentId']);
				$student_nineth = DB::table('classstudents')
					->where('Id', $stu->classes[8]->Id)
					->update(['ProfessorClassId' => $dataIn[$i]['ProfessorClassId']]);
			}
		}

		return compact('action', 'referral', 'student_nineth');
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
			::with('counters', 'user')
			->with(['referred' => function($q)use($date) {
					$q
					->where('Date', $date)
					->where('ReferralTypeId', 18)
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
				->where('ReferralTypeId', 18)
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
				// present
				if ($request->ActionType == 64) {
					$msg = 'Present, ';
					for ($i = 0; $i < count($request->Referrals); $i++) {
						$ref = $request->Referrals[$i];
						$referral = Referrals::findOrFail($ref['Id']);
						$referral->update([
							'AssignmentCompleted' => 1, //$ref['AssignmentCompleted'] ? 1 : 0,
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
				else if ($request->ActionType == 67 || $request->ActionType == 75 || $request->ActionType == 70) {
					$activity = \App\Activities::find($request->ActionType);
					$msg = 'student ditched Reteach ,' . $activity->Name . ' ';
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

					$consequence_date = $request->ActionType == 75 ? Carbon::today() : Carbon::tomorrow();
					$msg .= 'Assigning Oroom For ' . ($request->ActionType == 75 ? 'Today' : 'Tomorrow');
					$consequence = Referrals::create([
							'UserId' => $this->userId,
							'StudentId' => $id,
							'TeacherId' => 0,
							'ReferralTypeId' => 19,
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
				$msg = 'Student Rescheduled for ' . $request->newDate;
				$newDate = new Carbon($request->newDate);
				$referrals = Referrals::whereIn('Id', $request->ReferralIds);
				$referrals->update([
					'Comment' => $request->Comment,
					'ActivityTypeId' => 65,
					'NewDate' => $newDate,
					'Excused' => $request->excused ? 1 : 0
				]);
				$referrals = Referrals::whereIn('Id', $request->ReferralIds)->get();
				return compact('msg', 'referrals');
				break;

			case 'clear':
				$msg = 'Student Was Cleared From Reteach';
				$referrals = Referrals::whereIn('Id', $request->ReferralIds);
				$referrals->update([
					'Comment' => $request->Comment,
					'ActivityTypeId' => 66,
				]);
				$referrals = Referrals::whereIn('Id', $request->Referrals)->get();
				compact('msg', 'referrals');
				break;

			case 'absent':
				$date = new Carbon($request->Date);
				$referral = Referrals::findOrFail($id);
				$reteachAbsentStatus = 8;
				$referral->update(['RefferalStatus' => $reteachAbsentStatus]);
				$action = Useractions::create([
						'ActionDate' => $date,
						'ActionByUserId' => $this->userId,
						'ActionToUserId' => $referral->StudentId,
						'ActionType' => 72,
						'Comment' => 'Student Was Absent For Reteach on ' . $date->toFormattedDateString(),
				]);
				$msg = 'Student was Absent, moving to Absent List  ';
				return compact('msg');
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
