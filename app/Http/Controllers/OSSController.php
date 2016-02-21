<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Ossactivity;
use App\Referrals;
use App\Useractions;
use Carbon\Carbon;
use DB;

class OSSController extends Controller {

	/**
	 * Display a listing of the resource.
	 *
	 * @return \Illuminate\Http\Response
	 */
	public function index(Request $request) {
		//
		$schoolId = $this->user->SchoolId;
		$date = $request->has('Date') ? $request->Date : Carbon::tomorrow();

		$oss = Referrals::with('user', 'studentUser.student.counters', 'teacher', 'referralType', 'activity')
			->wherehas('studentUser', function($q)use($schoolId) {
				$q->where('SchoolId', $schoolId);
			})
			->wherehas('referralType', function($q) {
				$q->where('ReferralTypeId', 11);
//				->orWhere('ReferralTypeId', 6)
//				->orWhere('ReferralTypeId', 7)
//				->orWhere('ReferralTypeId', 10)
//				
			})
			->where('RefferalStatus', 0)
			->join('aspnetusers', 'aspnetusers.id', '=', 'refferals.StudentId')
			->orderBy('LastName', 'ASC')
			->select('refferals.*')
			->get();

		if($request->has('count'))
				return ['count'=>count($oss)];
		return $oss;
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
		$referral = Referrals::find($id);
		$counters = \App\Counters::find($referral->StudentId);
		if ($request->has('OssPresent')) {
			$msg = 'Parent Meeting Cleared';
			$referral->update([ 'RefferalStatus' => 1]);
			$counters->decrement('OSSPMP');
			$useraction = Useractions::create([
						'ActionDate' => Carbon::today(),
						'ActionByUserId' => $this->userId,
						'ActionType' => 62,
						'ActionToUserId' => $referral->StudentId,
						'Comment' => $request->Comment
				]);
		} else if ($request->has('reschedule')) {
			$this->notImplemented();
		} else {
			$referral->update(['ReferralTypeId' => 15, 'RefferalStatus' => 0]);
			$msg = 'Referral has been sent to the Parent Meeting Followup List';
			$action = Useractions::create([
					'ActionDate' => Carbon::today(),
					'ActionByUserId' => $this->userId,
					'ActionType' => 61,
					'ActionToUserId' => $referral->StudentId,
					'Comment' => $request->Comment
			]);
		}
		return compact('msg', 'referral', 'action');
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
