<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Lunchactivity;
use App\Referrals;
use App\Useractions;
use App\Counters;
use App\Activities;
use App\Students;
use Carbon\Carbon;
use DB;

class LunchDetentionController extends Controller {

	/**
	 * Display a listing of the resource.
	 *
	 * @return \Illuminate\Http\Response
	 */
	public function index(Request $request) {
		//
		$schoolId = $this->user->SchoolId;
		$date = $request->has('Date') ? $request->Date : Carbon::today();


		$lunchLists = Referrals::with('user', 'studentUser.student.counters', 'teacher', 'referralType')
			->where('Date', $date)
			->wherehas('studentUser', function($q)use($schoolId) {
				$q->where('SchoolId', $schoolId);
			})
			->where('ReferralTypeId', 9)
			->where('RefferalStatus', 0)
			->get();

		$list = Students
			::with('counters', 'user')
			->with(['referred' => function($q)use($date) {
					$q->where('RefferalStatus', 0)
					->where('Date', $date)
					->whereIn('ReferralTypeId', [9, 5, 6, 7, 11, 17])
					->with('referralType', 'user', 'teacher')
					->orderBy('ReferralTypeId', 'DESC')
					;
				}])
				->whereHas('user', function($q)use($schoolId) {
					$q->where('SchoolId', $schoolId);
				})
				->whereHas('referred', function($q)use($date) { // only with not processed lunch  referrals for $date
					$q
					->where('refferals.RefferalStatus', 0)
					->where('ReferralTypeId', 9)
					->where('Date', $date)
					;
				})
				->whereHas('counters', function($q) {
					$q->where('LunchDetentionsToBeServed', '>', 0);
				})
				->join('aspnetusers', 'aspnetusers.id', '=', 'students.Id')
				->orderBy('LastName', 'ASC')
				->select('students.*')
				->get()
			;


			return $list;
		}

		/**
		 * Show the form for creating a new resource.
		 *
		 * @return \Illuminate\Http\Response
		 */
		public function create() {
			//
		}

		/**
		 * Store a newly created resource in storage.
		 *
		 * @param  \Illuminate\Http\Request  $request
		 * @return \Illuminate\Http\Response
		 */
		public function store(Request $request) {
			//
			$today = Carbon::today();
			$useraction = Useractions::create([
					'ActionDate' => $today,
					'ActionByUserId' => $this->userId,
					'ActionType' => 10,
					'ActionToUserId' => $request->StudentId,
					'Comment' => 'Student Was Referred to Lunch Detention at:'
					. Carbon::now() . ' Student Was Tardy At:'
					. $request->TardyTime . '(system)'
			]);
			$referral = Referrals::create([
					'Date' => $today,
					'UserId' => $this->userId,
					'StudentId' => $request->StudentId,
					'TeacherId' => 0,
					'PeriodId' => $request->PeriodId,
					'TardyTime' => $request->TardyTime,
					//'AssignmentId' => 0,
					'ReferralTypeId' => 9,
			]);
			$counters = Counters::find($request->StudentId);
			if (!$counters) {
				$counters = Counters::create(['id' => $request->StudentId]);
			}
			$counters->increment('LunchDetentionsToBeServed');
			$counters->increment('LDReferrals');
			return compact('useraction', 'referral', 'counters');
		}

		/**
		 * Display the specified resource.
		 *
		 * @param  int  $id
		 * @return \Illuminate\Http\Response
		 */
		public function show($id) {
			//
		}

		/**
		 * Show the form for editing the specified resource.
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
		 * @param  \Illuminate\Http\Request  $request
		 * @param  int  $id
		 * @return \Illuminate\Http\Response
		 */
		public function update(Request $request, $id) {
			//
			$today = Carbon::today();
			$activity = Activities::find($request->ActionType);

			// change referral status to attendance taken and set the activity type id accordingly
			$referral = Referrals::find($id);
			$referral->RefferalStatus = 1;
			$referral->ActivityTypeId = $request->ActionType;
			$referral->save();

			$useraction = Useractions::create([
					'ActionDate' => $today,
					'ActionByUserId' => $this->userId,
					'ActionType' => $request->ActionType,
					'ActionToUserId' => $referral->StudentId,
					'Comment' => $request->Comment]);



			$counters = Counters::find($referral->StudentId);
			// present for lunch
			if ($request->ActionType == 31) {
				$msg = 'Student Was Present';
				$counters->decrement('LunchDetentionsToBeServed');

				$pendingLunchs = Referrals  // 
					::where('Date', $today)
					->where('RefferalStatus', 0)// pending
					->where('ReferralTypeId', 9)
					->where('StudentId', $referral->StudentId)
					->update(['date' => Carbon::tomorrow()]);
			}
			// ditch for lunch
			else if ($request->ActionType == 32 || $request->ActionType == 35 || $request->ActionType == 36) {
				$msg = 'Student Ditched Lunch Detention, Assigning Oroom for Today';
				$counters->increment('ORoomsToBeServed');
				$counters->LunchDetentionsToBeServed = 0;
				$useraction = Useractions::create([
						'ActionDate' => $today,
						'ActionByUserId' => $this->userId,
						'ActionType' => 44,
						'ActionToUserId' => $referral->StudentId,
						'Comment' => 'Student Ditched Lunch Detention on ' . Carbon::now()
						. ' Assigning Oroom for Today (System)']);


				//$referral->Date = Carbon::tomorrow();
				$pendingLunchs = Referrals  // set lunch detention refs status to 13 = lunch -> oroom => lunchs =0
					::where('Date', $today)
					->where('RefferalStatus', 0)// pending
					->where('ReferralTypeId', 9)
					->where('StudentId', $referral->StudentId)
					->update(['RefferalStatus' => 13]);

				$referral = Referrals::create([
						'UserId' => $this->userId,
						'StudentId' => $referral->StudentId,
						'ReferralTypeId' => 2,
						'Date' => Carbon::today()]);
			} else {
				$msg = 'Rescheduling Lunch Detention For Tomorrow';
				$useraction = Useractions::create([
						'ActionDate' => $today,
						'ActionByUserId' => $this->userId,
						'ActionType' => $request->ActionType,
						'ActionToUserId' => $referral->StudentId,
						'Comment' => 'Rescheduling Lunch Detention For Tomorrow(System)']);

				$referral->RefferalStatus = 0;
				$referral->Date = Carbon::tomorrow();
				$referral->save();
			}
			$counters->save();
			return compact('msg', 'useraction', 'referral', 'counters');
		}

		/**
		 * Remove the specified resource from storage.
		 *
		 * @param  int  $id
		 * @return \Illuminate\Http\Response
		 */
		public function destroy($id) {
			//
		}

	}
	