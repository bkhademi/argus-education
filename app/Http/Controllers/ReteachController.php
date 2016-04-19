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
use App\Counters;
use Illuminate\Http\Request;
use DB;
use App\Activities;
use Illuminate\Support\Facades\Input;

class ReteachController extends Controller
{

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function index(Request $request)
	{
		//
		$schoolId = $this->user->SchoolId;
		$date = $this->getDate($request);

		$aec = Students
			::with('counters', 'user')
			->with(['referred' => function ($q) use ($date) {
				$q
					->where('Date', $date)
					->whereIn('ReferralTypeId', [18, 5, 6, 7, 10, 11, 15, 17, 1, 2, 3, 16, 19, 11, 12])
					//->where('RefferalStatus', 0)
					->with('assignment', 'teacher', 'activity','consequence.referralType');
			}])
			->whereHas('user', function ($q) use ($schoolId) { // from the school the user requested
				$q->where('SchoolId', $schoolId);
			})
			->whereHas('referred', function ($q) use ($date) {
				$q
					//->where('RefferalStatus', 0)
					->where('ReferralTypeId', 18)
					->where('Date', $date);
			})
			->get();

		if ($request->count)
			$aec = ['reteachCount' => $aec->count()];

		return $aec;

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
	public function store(Request $request)
	{
		//
		$file = Input::file('file');

		if($file){
			dd($file);
		}
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

			/* for table RelationShip Between  Refferals and UserActions */
			//ReferralsActions::create(['ReferralId'=>$referral->Id, 'UseractionId'=>$useraction->Id ]);
			// now this referral is linked to an action(s)

			if ($dataIn[$i]['ProfessorClassId'] !== 0) {
				$stu = Students
					::with(['classes.professor_class' => function ($q) {
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
	 * @param  int $id
	 * @return Response
	 */
	public function show($id)
	{
		//
		$schoolId = $this->user->SchoolId;
		$date = new \Carbon\Carbon($id);

		$aec = Students
			::with('counters', 'user')
			->with(['referred' => function ($q) use ($date) {
				$q
					->where('Date', $date)
					->where('ReferralTypeId', 18)
					->where('RefferalStatus', 0)
					->with('assignment', 'teacher');
			}])
			->whereHas('user', function ($q) use ($schoolId) { // from the school the user requested
				$q->where('SchoolId', $schoolId);
			})
			->whereHas('referred', function ($q) use ($date) {
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
		$date = $this->getDate($request);
		switch ($request->param) {
			case 'attendance':
				// present
				if ($request->ActionType == 64) {
					$msg = 'Present, ';
					$referrals = collect([]);
					foreach ($request->Referrals as $ref) {

						Referrals::findOrFail($ref['Id'])
							->update([
								'AssignmentCompleted' => true,
								'ActivityTypeId' => $request->ActionType,
								'Comment' => $request->Comment,
								'RefferalStatus' => 1
							]);
						$referral = Referrals::with('activity')->findOrFail($ref['Id']);
						$referrals->push($referral->toArray());
					}

					return compact('msg', 'referrals');
				}//ditched , no show, sent out, walked out
				else if (/*$request->ActionType == 67 ||*/
					$request->ActionType == 75 || $request->ActionType == 70
				) {
					$activity = \App\Activities::find($request->ActionType);
					$msg = 'student ditched Reteach ,' . $activity->Name . ' ';
					//$counters = Counters::find($id);
					//$counters->increment('ORoomsToBeServed');
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
							'ActivityTypeId' => $request->ActionType,
							'Comment' => $request->Comment,
							'RefferalStatus' => 1
						]);

					//$consequence_date = $request->ActionType == 75 ? Carbon::today() : Carbon::tomorrow();
					/*$msg .= 'Assigning Oroom For ' . ($request->ActionType == 75 ? 'Today' : 'Tomorrow');
					$consequence = Referrals::create([
						'UserId' => $this->userId,
						'StudentId' => $id,
						'TeacherId' => 0,
						'ReferralTypeId' => 19,
						'Date' => $consequence_date
					]);*/
					$referrals = Referrals::with('activity')->whereIn('Id', $request->Referrals)->get();
					return compact('msg', 'referrals', 'consequence');
				} else {// left school, school absent, other
					return response('Error: You Must Select An Action In The Attendance Modal ', 500);
				}
				break;

			case 'reschedule':
				$msg = 'Student Rescheduled for ' . $request->newDate;
				$newDate = new Carbon($request->newDate);
				$referrals = Referrals::whereIn('Id', $request->ReferralIds);
				$referrals->update([
					'Comment' => $request->Comment,
					'ActivityTypeId' => 65,// Reteach: reschedule
					'NewDate' => $newDate,
					'Excused' => $request->excused,
					'RefferalStatus' => 1
				]);
				$referrals = Referrals::with('activity')->whereIn('Id', $request->ReferralIds)->get();
				return compact('msg', 'referrals');
				break;

			case 'clear':
				$msg = 'Student Was Cleared From Reteach';
				$referrals = Referrals::whereIn('Id', $request->ReferralIds);
				$referrals->update([
					'ActivityTypeId' => 66,// Reteach Clear
					'Comment' => $request->Comment,
					'RefferalStatus' => 1
				]);
				$referrals = Referrals::with('activity')->whereIn('Id', $request->Referrals)->get();
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

			case 'commitReteach':
				//DB::beginTransaction();
				$msg = 'All Changes Were Successfully Submitted';

				$schoolId = $this->user->SchoolId;
				$students = Students
					::with(['referred' => function ($q) use ($date) {
						$q
							->where('Date', $date)
							->where('ReferralTypeId', 18)
							->whereNotIn('RefferalStatus', [6])
							->with('activity', 'assignment');
					}])
					->with('user')
					->whereHas('user', function ($q) use ($schoolId) { // from the school the user requested
						$q->where('SchoolId', $schoolId);
					})
					->whereHas('referred', function ($q) use ($date) {
						$q
							->whereIn('RefferalStatus', [0, 1])// only N/A and action taken referrals
							->where('ReferralTypeId', 18)
							->where('Date', $date);
					})
					->get();

				if ($students->count() == 0)
					return ['msg' => 'No New Students To Submit'];
				//return $students->count();
				$names = '';
				$actions = collect([]);
				foreach ($students as $stu) {
					$names .= $stu->user->FirstName . ', ';
					$actions->push($this->checkRefAndRegisterActionsToUserActions($stu, $date));
					//return $actions;
				}

				return compact('msg', 'students', 'actions');
				break;
			default:
				return response('Unknown Parameter "' . $request->param . '"', 500);
		}
		return compact('msg', 'referrals');
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

	private function checkRefAndRegisterActionsToUserActions($student, $date)
	{
		//DB::beginTransaction();

		$action = Useractions::create([
			'ActionDate' => $date,
			'ActionByUserId' => $this->userId,
			'ActionToUserId' => $student->Id,
		]);

		$actionTypeId = $student->referred[0]->ActivityTypeId;
		$comment = $student->referred[0]->Comment;//. '[';
		$activity = Activities::find($actionTypeId);

		//get assignment names to add them in the comment
		// do the update on their referrals (only mark with status of 2
		foreach ($student->referred as $ref) {
			//$comment .= $ref->assignment->Name . ', ';
			switch ($ref->ActivityTypeId) {
				case 0:
					$ref->update(['RefferalStatus' => 8]); //  sent to Followup
					break;
				case 65: //reschedule
				case 66: //clear
				case 64:// present
				case 75:// Sent Out
				case 70:// Walked Out
				case 71: // other
					$ref->update(['RefferalStatus' => 2]);
					break;
				default:
					print_r('error');
					dd($ref->ActivityTypeId);
			}
		}
		// remove trailing comma
		//$comment = rtrim($comment, ', ');
		// $comment .= ' (System)]';

		$action->update(['ActionType' => $actionTypeId, 'Comment' => $comment]);
		/* CHANGE CONSEQUENCE DATE IF ATTENDANCE IS TAKEN THE NEXT DAY, DO CONSEQUENCE RELATIVE TO THE DATE */
		$tomorrow = $date->copy()->addWeekDay();
		$consequence_date = $actionTypeId == 55 ? $date : $tomorrow;
		$msg = 'Assigning Oroom For ' . ($actionTypeId == 55 ? 'Today' : 'Tomorrow');

		//  create the consequences and referral rotations(traces) accordingly
		switch ($actionTypeId) {
			case 0:
				$action->update(['ActionType' => 72]);// change action's actionType to Reteach : Pending Followup
				break;

			case 64:// present
			case 66:// clear
			case 68:// Left School
			case 69:// School Absent
			case 71: // other

				//  nothing to be done here
				break;

			case 75://sent out
			case 70:// walked out
			case 67: // No Show
				$counters = Counters::find($student->Id)->increment('ORoomsToBeServed');
				$action_new = UserActions::create([
					'ActionDate' => $date,
					'ActionByUserId' => $this->userId,
					'ActionToUserId' => $student->Id,
					'ActionType' => 73,
					'Comment' => $comment . ' [student ditched Reteach (' . $activity->Name . '), Assigned O-Room on ' . $date . '(System)]',
				]);
				$consequence = Referrals::create([
					'UserId' => $this->userId,
					'StudentId' => $student->Id,
					'TeacherId' => 0,
					'ReferralTypeId' => 19,
					'Date' => $consequence_date
				]);
				foreach ($student->referred as $ref)
					$ref->update(['ConsequenceId' => $consequence->Id]);
				$counters = Counters::find($student->Id)->increment('ORoomsToBeServed');
				break;
			case 65:// reschedule
				foreach ($student->referred as $ref) {
					$new_ref = $ref->replicate();
					$new_ref->Date = new Carbon($ref->NewDate);
					$new_ref->ActivityTypeId = 0;
					$new_ref->RefferalStatus = 0;
					$new_ref->Comment = null;
					$new_ref->NewDate = null;
					$new_ref->save();
					$new_ref->update(['created_at' => $ref->created_at]);
				}
				break;

			default:
				print_r('error');
				dd($actionTypeId);
		}
		$action->load('activity', 'student');

		return $action;

	}

}
