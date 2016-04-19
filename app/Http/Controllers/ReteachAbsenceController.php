<?php

namespace App\Http\Controllers;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use DB;
use App\Referrals;
use App\Useractions;
use App\Counters;
use Carbon\Carbon;
use App\User;

class ReteachAbsenceController extends Controller
{

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function index(Request $request)
	{
		//
		//
		$userId = $this->userId;
		$schoolId = $this->user->SchoolId;
		$date = $this->getDate($request);
		$reteachAbsense = User::with(['referred' => function ($query) use ($userId, $date) {
			$query->with('assignment', 'user.assignments', 'teacher')
				->where('RefferalStatus', 8)//->where('Date', $date)
			;
		}])
			->where('SchoolId', $schoolId)
			->with('student')
			->whereHas('referred', function ($query) use ($userId, $date) {
				$query
					->where('RefferalStatus', 8)//->where('Date',$date)
				;
			})
			->orderBy('LastName', 'ASC')
			->get();

		if($request->count)
			$reteachAbsense = [ 'reteachAbsentCount'=>$reteachAbsense->count() ];

		return $reteachAbsense;
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
	public function store()
	{
		//
	}

	/**
	 * Display the specified resource.
	 *
	 * @param  int $id
	 * @return Response
	 */
	public function show($id, Request $request)
	{
		//
		$userId = $this->userId;
		$schoolId = $this->user->SchoolId;
		$date = new Carbon($id);
		return User::with(['referred' => function ($query) use ($userId, $date) {
			$query->with('assignment', 'user.assignments', 'teacher')
				->where('RefferalStatus', 8)
				->where('Date', $date);
		}])
			->where('SchoolId', $schoolId)
			->with('student')
			->whereHas('referred', function ($query) use ($userId, $date) {
				$query
					->where('RefferalStatus', 8)
					->where('Date', $date);
			})->get();
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
		$today = Carbon::today();
		$tomorrow = Carbon::tomorrow();
		$studentId = $id;
		$lastPendingFollowupAction = Useractions::where('ActionToUserId', $studentId)
			->where('ActionType', 72)
			->orderBy('created_at', 'DESC')
			->first();
		// CLEAR OR NO-SHOW
		if ($request->ActionType == 66 || $request->ActionType == 67) {
			$referrals = Referrals::whereIn('Id', $request->referrals);
			$referrals->update(['RefferalStatus' => 2, 'ActivityTypeId' => $request->ActionType]);


			if ($request->ActionType == 66) {// CLEAR
				$msg = 'Student Cleared From Reteach';

				$lastPendingFollowupAction->Comment .= "\n Followup Comment: \n " . $request->Comment
					. '[Student Cleared (System)]';
				$lastPendingFollowupAction->ActionType = $request->ActionType;
				$lastPendingFollowupAction->save();

			} else { //NO SHOW
				$msg = 'No Show. Reteach->ORM.';

				$consequence = Referrals::create([
					'UserId' => $this->userId,
					'StudentId' => $studentId,
					'ReferralTypeId' => 19, // reteach -> ORM
					'Date' => $today
				]);
				$counters = Counters::find($studentId);
				$counters->increment('ORoomsToBeServed');

				$lastPendingFollowupAction->update(['Comment' => $lastPendingFollowupAction->Comment . "\n Followup Comment: \n "
					. $request->Comment . ' [' . $msg . ' (System)]', 'ActionType' => $request->ActionType]);
				$referrals->update(['RefferalStatus' => 2, 'ActivityTypeId' => $request->ActionType, 'ConsequenceId'=>$consequence->Id]);
			}

			$referrals = Referrals::with('activity')->whereIn('Id', $request->referrals)->get();
			return compact('msg', 'referrals', 'lastPendingFollowupAction', 'consequence', 'counters');
		}//ditched
		else {

			$msg = '';
			$referrals = Referrals::whereIn('Id', $request->referrals);
			$referrals->update(['RefferalStatus' => 2, 'ActivityTypeId' => $request->ActionType]);


			$lastPendingFollowupAction->update(['Comment' => $lastPendingFollowupAction->Comment . "\n Followup Comment: \n "
				. $request->Comment . ' [' . $msg . ' (System)]', 'ActionType' => $request->ActionType]);

			$referrals = Referrals::with('activity')->whereIn('Id', $request->referrals)->get();
			return compact('msg', 'referrals', 'action');
		}
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

}
