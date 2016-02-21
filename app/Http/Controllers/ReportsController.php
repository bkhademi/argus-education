<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Referrals;
use App\Useractions;
use Carbon\Carbon;

class ReportsController extends Controller {

	public function EODoroom(Request $request) {
		//
		$date = new Carbon($request->date);
		$schoolId = $this->user->SchoolId;
//		$oroom = Referrals::with('user', 'studentUser.student.counters', 'teacher')
//			->where('Date', $date)
//			->wherehas('user', function($q)use($schoolId) { // from the school the user requested
//				$q->where('SchoolId', $schoolId);
//			})
//			->whereIn('ReferralTypeId', [1, 2, 3,16,19])
//			->get();
		return Useractions
				::with('student', 'user', 'activity')
				->where('ActionDate', $date)
				->whereIn('ActionType',[1,7,44,59,73,24,25,26,27,28,29,30])
				->whereHas('student', function($q)use($schoolId) {
					$q->where('SchoolId', $schoolId);
				})
				->get();
//		return $oroom;
	}

	public function EODlunchD(Request $request) {
		$date = new Carbon($request->date);
		$schoolId = $this->user->SchoolId;
		$oroom = Referrals::with('user', 'studentUser.student.counters', 'teacher')
			->where('Date', $date)
			->wherehas('user', function($q)use($schoolId) { // from the school the user requested
				$q->where('SchoolId', $schoolId);
			})
			->whereIn('ReferralTypeId', [9])
			->get();
		return Useractions
				::with('student', 'user', 'activity')
				->where('ActionDate', $date)
				->whereIn('ActionType',[10,31,32,33,34,35,36,37])
				->whereHas('student', function($q)use($schoolId) {
					$q->where('SchoolId', $schoolId);
				})
				->get();
		return $oroom;
	}

	public function EODiss(Request $request) {
		$date = new Carbon($request->date);
		$schoolId = $this->user->SchoolId;
		
		
//		$oroom = Referrals::with('user', 'studentUser.student.counters', 'teacher')
//			->where('Date', $date)
//			->wherehas('user', function($q)use($schoolId) { // from the school the user requested
//				$q->where('SchoolId', $schoolId);
//			})
//			->whereIn('ReferralTypeId', [4, 5, 6, 7, 8,10,17])
//			->get();
//		return $oroom;
		
		return Useractions
				::with('student', 'user', 'activity')
				->where('ActionDate', $date)
				->whereIn('ActionType',[2,20,45,38,39,40,41,42,43,47])
				->whereHas('student', function($q)use($schoolId) {
					$q->where('SchoolId', $schoolId);
				})
				->get();
	}

	public function EODoss(Request $request) {
		$date = new Carbon($request->date);
		$schoolId = $this->user->SchoolId;
		$oroom = Referrals::with('user', 'studentUser.student.counters', 'teacher')
			->where('Date', $date)
			->wherehas('user', function($q)use($schoolId) { // from the school the user requested
				$q->where('SchoolId', $schoolId);
			})
			->whereIn('ReferralTypeId', [11])
			->get();
		return $oroom;
	}

	public function EODAEC(Request $request) {
		$date = new Carbon($request->date);
		$schoolId = $this->user->SchoolId;
//		$oroom = Referrals::with('user', 'studentUser.student.counters', 'teacher')
//			->where('Date', $date)
//			->wherehas('user', function($q)use($schoolId) { // from the school the user requested
//				$q->where('SchoolId', $schoolId);
//			})
//			->whereIn('ReferralTypeId', [12])
//			->get();
//		return $oroom;
		return Useractions
				::with('student', 'user', 'activity')
				->where('ActionDate', $date)
				->whereIn('ActionType',[48,49,50,60,51,52,53,54,55,56,57,58])
				->whereHas('student', function($q)use($schoolId) {
					$q->where('SchoolId', $schoolId);
				})
				->get();
	}
	public function EODReteach(Request $request) {
		$date = new Carbon($request->date);
		$schoolId = $this->user->SchoolId;

		return Useractions
				::with('student', 'user', 'activity')
				->where('ActionDate', $date)
				->whereIn('ActionType',[63,64,65,66,67,68,69,70,71,72,74,75])
				->whereHas('student', function($q)use($schoolId) {
					$q->where('SchoolId', $schoolId);
				})
				->get();
	}
	

	public function oroomActivity(Request $request) {
		$date = new Carbon($request->date);
		$schoolId = $this->user->SchoolId;

		$activities = \App\Oroomactivity
			::with('student', 'teacher', 'period', 'activity')
			->where('Date', $date)
			->wherehas('student', function($q)use($schoolId) { // from the school the user requested
				$q->where('SchoolId', $schoolId);
			})
			->get();

		return $activities;
	}

	public function update(Request $request, $id) {
		//
	}

	public function destroy($id) {
		//
	}

}
