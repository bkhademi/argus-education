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

class AECAbsenceController extends Controller {

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
	public function show($id) {
		//
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
		// present or clear
		if ($request->ActionType == 51 || $request->ActionType == 52) {

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

			if ($request->ActionType == 51) {
				$msg = 'Student Cleared From AEC';
				$referral->update(['RefferalStatus' => 1]);
				$action->update(['Comment' => $request->Comment
					. '[Student Cleared (System)]']);
			} else {
				$msg = 'No Show. AEC->ORM.';
				$referrals = $request->referred;
				$incomplete = false;
				$assignments = '';

				for ($i = 0; $i < count($referrals); $i++) {
					$obj = $referrals[$i];

					if (!isset($obj['selected'])) {// doesnt have folder
						$msg .= ' (Doesnt has folder for ' . $obj['assignment']['Name'] . ', no AEC)  ';
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
						'ReferralTypeId' => 16,
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
			$msg = '';
			$referralIds = $request->Referrals;
			
			foreach($referralIds as $ref) {
				$referral = Referrals::with('assignment')->findOrFail($ref['Id']);
				$msg .= "(".$referral->assignment->Name;
				if($ref['Folders']){
					$msg .= ". Has Folder, reassigning for today's AEC ";
					$referral->update(['Date'=>$today, 'RefferalStatus'=> 0]);
				}else{
					$msg .= ". Doesn't has Foder, clearing student ";
					$referral->update(['RefferalStatus'=> 1]);//clear student because no folders
				}
				$msg .= ")System \n";
			}
			
			$action = UserActions::create([
					'ActionDate' => $today,
					'ActionByUserId' => $this->userId,
					'ActionType' => $request->ActionType,
					'ActionToUserId' => $referral->StudentId,
					'Comment'=>$request->Comment .'['.$msg.']'
			]);
			
			
//			$referral = Referrals::with('assignment')->findOrFail($id);
//			$status = $request->Folders ? 0 : 1;
//			$referral->update(['RefferalStatus' => $status]);
//			$action = UserActions::create([
//					'ActionDate' => $today,
//					'ActionByUserId' => $this->userId,
//					'ActionType' => $request->ActionType,
//					'ActionToUserId' => $referral->StudentId,
//					'Completed' => $request->Completed
//			]);
//
//			if ($request->Folders) {
//				$msg = 'Folders Were Present, Rescheduled AEC For Next Day (today)';
//				$referral->update(['Date' => $today]);
//				$action->update(['Comment' => $request->Comment
//					. ' [Have Folders, Rescheduling for Next Available Day(System)]']);
//			} else {
//				$msg = 'Folders Were Not Present, Clearing Student';
//				$action->update(['Comment' => $request->Comment
//					. ' [Doesnt Have Folders, Clearing(System)]']);
//			}
			
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
