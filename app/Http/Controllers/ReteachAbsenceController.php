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

class ReteachAbsenceController extends Controller {

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function index() {
		//
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
	public function store() {
		//
	}

	/**
	 * Display the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function show($id, Request $request) {
		//
		$userId = $this->userId;
		$schoolId = $this->user->SchoolId;
		$date = new Carbon($id);
		return User::with(['referred' => function($query)use($userId, $date) {
						$query->with('assignment', 'user.assignments', 'teacher')
						->where('RefferalStatus', 8)
						->where('Date', $date)
						;
					}])
				->where('SchoolId', $schoolId)
				->with('student')
				->whereHas('referred', function($query)use($userId, $date) {
					$query
					->where('RefferalStatus', 8)
					->where('Date',$date)
					;
				})->get();
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
		$today = Carbon::today();
		$tomorrow = Carbon::tomorrow();
		if ($request->ActionType == 66 || $request->ActionType == 67) {

			$referral = Referrals::whereIn('Id', $request->referrals);
			$referralone = Referrals::find($request->referred[0]['Id']);
			$action = UserActions::create([
					'ActionDate' => $today,
					'ActionByUserId' => $this->userId,
					'ActionType' => $request->ActionType,
					'ActionToUSerId' => $referralone->StudentId,
					'ParentNotified' => $request->data['ParentNotified'],
					'StudentNotified' => $request->data['StudentNotified'],
			]);

			if ($request->ActionType == 66) {
				$msg = 'Student Cleared From Reteach';
				$referral->update(['RefferalStatus' => 1]);
				$action->update(['Comment' => $request->Comment
					. '[Student Cleared (System)]']);
			} else {
				$msg = 'No Show. Reteach->ORM.';
				$referrals = $request->referred;
				$incomplete = false;
				$assignments = '';

				for ($i = 0; $i < count($referrals); $i++) {
					$obj = $referrals[$i];

					if (!isset($obj['selected'])) {// doesnt have folder
						$msg .= ' (Doesnt has folder for ' . $obj['assignment']['Name'] . ', no Reteach)  ';
						$incomplete = true;

						//Referrals::find($obj['Id'])->update(['Date'=>$tomorrow]);
						// doesnt have folder.. not continue AEC and mark with status 6
						Referrals::find($obj['Id'])->update(['RefferalStatus' => 6]);
					} else {
						// has folder. Reschedule AEC 
						$msg .= ' (Has Folder for ' . $obj['assignment']['Name'] . ', AEC Rescheduled)  ';
						Referrals::find($obj['Id'])->update(['RefferalStatus' => 0, 'Date' => Carbon::today()]);
					}
					$assignments .= $obj['assignment']['Name'] . ', ';
				}
				// regardless if has folders or not,, it goes to oroom
				$orm = Referrals::create([
						'UserId' => $this->userId,
						'StudentId' => $referralone->StudentId,
						'ReferralTypeId' => 19,
						'Date' => $today
				]);
				$counters = Counters::find($referralone->StudentId)->increment('ORoomsToBeServed');

				//$msg ='Student Was A No Show, Rescheduling For Next Day';
				//$referral->update(['RefferalStatus' => 0, 'Date'=>Carbon::today()->addWeekDay()]);
				$action->update(['Comment' => $request->Comment
					. '[' . $msg . ' (System)]']);
			}

			$referral = Referrals::whereIn('Id', $request->referrals)->get();
			return compact('msg', 'referral', 'action', 'orm', 'counters');
		}//ditched
		else {
			$referral = Referrals::with('assignment')->findOrFail($id);
			$status = 1;
			$referral->update(['RefferalStatus' => $status]);
			$action = UserActions::create([
					'ActionDate' => $today,
					'ActionByUserId' => $this->userId,
					'ActionType' => $request->ActionType,
					'ActionToUSerId' => $referral->StudentId,
					'ParentNotified' => $request->data['ParentNotified'],
					'StudentNotified' => $request->data['StudentNotified'],
					'Completed' => $request->Completed
			]);


			return compact('msg', 'referral', 'action');
		}
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
