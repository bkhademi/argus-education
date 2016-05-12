<?php

namespace App\Http\Controllers;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Referrals;
use App\Useractions;
use App\User;
use App\Assignments;
use App\Students;
use App\Activities;
use Carbon\Carbon;
use \App\Counters;
use Illuminate\Http\Request;
use DB;


class AECController extends Controller
{

	protected $aec_referral_type = 12;
	protected $active_referral_status = 0;
	protected $referred_aec_action = 48;
	protected $otherReferrals = 34;

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function index(Request $request)
	{
		$schoolId = $this->user->SchoolId;
		$date = $this->getDate($request);

		$aec = Students
			::with('counters', 'user', 'classes.professor_class.room')
			->with(['referred' => function ($q) use ($date) {
				$q
					->where('Date', $date)
					->whereNotIn('ReferralTypeId', [9])// dont load LD
					//->where('RefferalStatus', '!=', 99)
					->with('assignment', 'teacher', 'activity', 'consequence.referralType');
			}])
			->whereHas('user', function ($q) use ($schoolId) { // from the school the user requested
				$q->where('SchoolId', $schoolId);
			})
			->whereHas('referred', function ($q) use ($date) {
				$q
					//->where('RefferalStatus', 0)
					//->where('RefferalStatus', '!=', 99)
					->where('ReferralTypeId', 12)
					->where('Date', $date);
			})
			->join('aspnetusers', 'aspnetusers.id', '=', 'students.Id')
			->orderBy('LastName', 'ASC')
			->select('students.*')
			->get();


		if ($request->count)
			$aec = ['aecCount' => $aec->count()];

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
				'RefferalStatus' => $this->active_referral_status,
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
	 * @param  int $id
	 * @return Response
	 */
	public function show($id)
	{
		//
		$schoolId = $this->user->SchoolId;
		$date = new Carbon($id);

		$aec = Students
			::with('counters', 'user', 'classes.professor_class.room')
			->with(['referred' => function ($q) use ($date) {
				$q
					->where('Date', $date)
					->whereNotIn('ReferralTypeId', [9])
					//->where('RefferalStatus', 0)
					->with('assignment', 'teacher', 'activity');
			}])
			->whereHas('user', function ($q) use ($schoolId) { // from the school the user requested
				$q->where('SchoolId', $schoolId);
			})
			->whereHas('referred', function ($q) use ($date) {
				$q
					//->where('RefferalStatus', 0)
					->where('ReferralTypeId', 12)
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
		$schoolId = $this->user->SchoolId;
		$date = $this->getDate($request);
		switch ($request->param) {
			case 'attendance':


				if ($request->has('param2')) {// attendance when overlap
					$msg = 'marked as HasFolder';
					$referrals = collect($request->Referrals);


					foreach ($referrals as $ref) {
						$referral = Referrals::find($ref['Id']);
						$activityId = !$ref['HasFolder'] || $schoolId == 1 ? 51 : 50;
						$referral->update([
							'ActivityTypeId' => $activityId, //reschedule if has folder, clear otherwise
							'HasFolder' => $ref['HasFolder'],
							'Comment' => $request->Comment,
							'RefferalStatus' => 1
						]);
						if ($activityId == 50) {

						}
					}
					$referrals->transform(function ($item) {
						return $item['Id'];
					});

					$referrals = Referrals::with('activity')->whereIn('Id', $referrals)->get();
					return compact('msg', 'referrals');
				}
				// present
				if ($request->ActionType == 49) {
					$msg = 'Present, ';
					$referrals = collect([]);
					foreach ($request->Referrals as $ref) {
						$referral = Referrals::with('assignment', 'activity')->findOrFail($ref['Id']);

						$msg .= '(' . $referral->assignment->Name;
						$msg .= ' :' . ($ref['AssignmentCompleted'] ? 'complete' : 'incomplete') . ')';

						$referral->update([
							'ActivityTypeId' => $request->ActionType,
							'AssignmentCompleted' => $ref['AssignmentCompleted'],
							'Comment' => $request->Comment,
							'RefferalStatus' => 1
						]);
						$referrals->push($referral->toArray());
					}

					return compact('msg', 'referrals');
				}//ditched , sent out, walked out
				else if ($request->ActionType == 55 || $request->ActionType == 56) {
					$activity = Activities::find($request->ActionType);
					$msg = 'student ditchedAEC ,' . $activity->Name . ' ';

					$referrals = Referrals::whereIn('Id', $request->Referrals)
						->update([
							'ActivityTypeId' => $request->ActionType,
							'Comment' => $request->Comment,
							'RefferalStatus' => 1
						]);

					$referrals = Referrals::with('activity', 'assignment')->whereIn('Id', $request->Referrals)->get();
					return compact('msg', 'referrals');
				} else {
					return response('Error: You Must At Least Select An Action In The Attendance Modal ', 500);
				}
				break;

			case 'reschedule':
				$msg = 'Student Rescheduled for ' . $request->newDate;
				$newDate = new Carbon($request->newDate);

				$referrals = Referrals::whereIn('Id', $request->ReferralIds);
				$referrals->update([
					'Comment' => $request->Comment,
					'ActivityTypeId' => 50,// AEC : Reschedule
					'NewDate' => $newDate,
					'Excused' => $request->excused,
					'RefferalStatus' => 1
				]);

				$referrals = Referrals::with('activity')->whereIn('Id', $request->ReferralIds)->get();
				return compact('msg', 'referrals');
				break;

			case 'clear':
				$wasClear = true;
				$toRemoveReferralIds = $request->ToRemoveReferralIds;
				$useraction = Useractions::create([
					'ActionDate' => $date,
					'ActionByUserId' => $this->userId,
					'ActionToUserId' => $request->StudentId,
				]);

				if ($request->RemoveAll) {
					$msg = 'Removing/Clearing All AEC referrals';
					// grab 1 from the referrals to remove to use as trace
					$traceReferral = Referrals::find(array_shift($toRemoveReferralIds));

					//mark this referral so it wont be moved
					$traceReferral->update(['RefferalStatus' => 2, 'ActivityTypeId' => $request->ActionType]);

				} else {
					$msg = 'Removing ' . count($toRemoveReferralIds) . ' AEC refferals and ';
					// grab 1 from the referrals to remove to use as trace

					$moveDate = new Carbon($request->MoveClearToDate);
					if ($moveDate->eq(Carbon::today())) { // leave trace and use as real,
						$msg .= 'leaving pending to serve on ';

					} else { //  mark trace as clear,
						$msg .= 'moving pending to ';
						$traceReferral = Referrals::find(array_shift($toRemoveReferralIds));
						$traceReferral->update(['RefferalStatus' => 2, 'ActivityTypeId' => $request->ActionType]);

						$pendingReferrals = Referrals
							::where('Date', $date)
							->where('RefferalStatus', 0)// pending
							->ofTypes(Referrals::$aecReferralType)// aec
							->where('StudentId', $request->StudentId)
							->update(['Date' => $moveDate]);
					}
					$msg .= $moveDate->toDateString();
				}

				$result = Referrals::decreaseCountersAndRemoveReferrals($toRemoveReferralIds, $request->StudentId);
				$referrals = $this->getAECReferrals($date, $request->StudentId);
				$useraction->update(['Comment' => $useraction->Comment . "[Clearing " . count($toRemoveReferralIds) . " AEC referrals (System)]"]);


				/*$msg = 'Student Was Cleared From AEC';
				$referrals = Referrals::whereIn('Id', $request->ReferralIds);
				$referrals->update([
					'ActivityTypeId' => 51, // AEC : Clear
					'Comment' => $request->Comment,
					'RefferalStatus' => 1
				]);
				$referrals = Referrals::with('activity')->whereIn('Id', $request->ReferralIds)->get();*/
				return compact('msg', 'referrals', 'wasClear');
				break;

			case 'absent': //used for students left when finish button is present
				$msg = "Student Absent, Moving to Followup List";
				$date = new Carbon($request->Date);
				$referral = Referrals::with('assignment')->findOrFail($id);
				$action = Useractions::FirstOrcreate([
					'ActionDate' => $date,
					'ActionByUserId' => $this->userId,
					'ActionToUserId' => $referral->StudentId,
					'ActionType' => 58, // AEC : Absent
					'Comment' => 'Student Was Absent For AEC on , moving to AEC followup List' . $date,
				]);
				$referral->update(['RefferalStatus' => $this->aecAbsenceStatus]);
				if (!$action->wasRecentlyCreated)
					$msg = "Action already registered on student's profile";

				$referral = Referrals::with('assignment')->findOrFail($id);
				return compact('msg', 'referral');
				break;

			case 'commitAEC':
				//DB::beginTransaction();
				$msg = 'All Changes were successfully Submitted. ';

				$schoolId = $this->user->SchoolId;
				$students = Students
					::with(['referred' => function ($q) use ($date) {
						$q
							->where('Date', $date)
							->where('ReferralTypeId', 12)
							->whereNotIn('RefferalStatus', [3])
							->with('activity', 'assignment');
					}])
					->with('user')
					->whereHas('user', function ($q) use ($schoolId) { // from the school the user requested
						$q->where('SchoolId', $schoolId);
					})
					->whereHas('referred', function ($q) use ($date) {
						$q
							->whereIn('RefferalStatus', [0, 1])// only N/A and action taken referrals
							->where('ReferralTypeId', 12)
							->where('Date', $date);
					})
					->get();
				if ($students->count() == 0)
					return ['msg' => 'No New Students To Submit'];
				//return $students->count();
				// we actually need to send overlap students to followup in case there is no action
				/*
				foreach ($request->OverlapIds as $id) {// remove students that have overlaps
					 $students = $students->reject(function ($item) use ($id) {
						 return $item->Id === $id;
					 });
				 }
				 $students = $students->values(); // restore indexes
				*/
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
		$comment = $student->referred[0]->Comment . '[';
		$activity = Activities::find($actionTypeId);

		//get assignment names to add them in the comment
		// do the update on their referrals (only mark with status of 2
		foreach ($student->referred as $ref) {
			$comment .= $ref->assignment->Name . ', ';
			switch ($ref->ActivityTypeId) {
				case 0:
					$ref->update(['RefferalStatus' => 4]);
					break;
				case 50: //reschedule
				case 51: //clear
				case 49:// present
				case 55:// Sent Out
				case 56:// Walked Out
					$ref->update(['RefferalStatus' => 2]);
					break;
				default:
					print_r('error');
					dd($ref->ActivityTypeId);
			}
		}
		// remove trailing comma
		$comment = rtrim($comment, ', ');
		$comment .= ' (System)]';

		$action->update(['ActionType' => $actionTypeId, 'Comment' => $comment]);
		/* CHANGE CONSEQUENCE DATE IF ATTENDANCE IS TAKEN THE NEXT DAY, DO CONSEQUENCE RELATIVE TO THE DATE */
		$tomorrow = $date->copy()->addWeekDay();
		$consequence_date = $tomorrow;//$actionTypeId == 55 ? $date : $tomorrow;
		$msg = 'Assigning Oroom For ' . ($actionTypeId == 55 ? 'Today' : 'Tomorrow');

		//  create the consequences and referral rotations(traces) accordingly
		switch ($actionTypeId) {
			case 0:
				$action->update(['ActionType' => 58]);// change action's actionType to AEC : Pending Followup
				break;

			case 49:// present
			case 51: // clear
				//  nothing to be done here
				break;

			case 55://sent out
			case 56:// walked out
				//$counters = Counters::find($student->Id)->increment('ORoomsToBeServed');
				$action_new = UserActions::create([
					'ActionDate' => $date,
					'ActionByUserId' => $this->userId,
					'ActionToUserId' => $student->Id,
					'ActionType' => 59,
					'Comment' => $comment . ' [student ditched AEC (' . $activity->Name . '), Assigned O-Room on ' . $date . '(System)]',
				]);
				if($date->lt((new Carbon())->subWeekDays(3)) )
					break ;
				$consequence = Referrals::create([
					'UserId' => $this->userId,
					'StudentId' => $student->Id,
					'TeacherId' => 0,
					'ReferralTypeId' => 16, // aec-> orm
					'Date' => $consequence_date
				]);
				foreach ($student->referred as $ref) {
					$ref->update(['ConsequenceId' => $consequence->Id]);
				}
				$counters = Counters::find($student->Id)->increment('ORoomsToBeServed');
				break;
			case 50:// reschedule
				
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

	private function rescheduleReferral($date, $referral)
	{
		$refCopy = $referral->replicate();
		$refCopy->date = $date;
		$refCopy->save();
		$refCopy->created_at = $referral->created_at;
		$referral->update(['RefferalStatus' => 3, 'ActivityTypeId' => 50]);

	}

	private function clearReferral($referral)
	{
		$referral->update(['ActivityTypeId' => 51]);
	}

	private function getAECReferrals($date, $studentId)
	{
		$referrals =
			Referrals::with('assignment', 'teacher', 'activity')
				->where('Date', $date)
				->ofTypes(Referrals::$aecReferralType)
				->where('StudentId', $studentId)
				->get();
		return $referrals;
	}
}
	