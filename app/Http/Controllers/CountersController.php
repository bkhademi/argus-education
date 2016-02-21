<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace App\Http\Controllers;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Counters;
use App\Useractions;
use App\Referrals;
use Carbon\Carbon;
use Illuminate\Http\Request;

class CountersController extends Controller {

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function index() {
		//
		return Counters::all();
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
		return Counters::find($id);
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
		$counters = Counters::find($id);

		$msg = '';




		$oroomr = $counters->ORoomsToBeServed - $request->counters['ORoomsToBeServed'];
		$issr = $counters->ISSDays - $request->counters['ISSDays'];
		$lunchdr = $counters->LunchDetentionsToBeServed - $request->counters['LunchDetentionsToBeServed'];

		if ($oroomr > 0) { // decreased
			$msg .= 'Orooms decreased by ' . abs($oroomr) . ', ';
			$referrals = Referrals
				::where('StudentId', $id)
				->whereIn('ReferralTypeId', [1,2,3,16,19]) 
				->orderBy('id','DESC')
				->get();
			for ($i = 0; $i < abs($oroomr); $i++) {
				$referrals[$i]->delete();
			}
		} else if ($oroomr < 0) { // increased
			$msg .= ' Orooms increased by ' . abs($oroomr) . ', ';
			$date = Carbon::today();
			
			for ($i = 0; $i < abs($oroomr); $i++) {
				
				Referrals::create([
						'UserId' => $this->userId,
						'StudentId' => $id,
						'TeacherId' => 0,
						'ReferralTypeId' => 1,
						'Date' => $date,
				]);
				
			}
		}

		if ($issr > 0) {
			$msg .= 'ISS decreased by ' . abs($issr) . ', ';
			$referrals = Referrals
				::where('StudentId', $id)
				->whereIn('ReferralTypeId', [5,6,7,10,17])
				->orderBy('id','DESC')
				->get();
			for ($i = 0; $i < abs($issr); $i++) {
				$referrals[$i]->delete();
			}
		} else if ($issr < 0) {
			$msg .= 'ISS increased by ' . abs($issr) . ', ';
			$date = Carbon::today();
			for ($i = 0; $i < abs($issr); $i++) {
				Referrals::create([
						'UserId' => $this->userId,
						'StudentId' => $id,
						'TeacherId' => 0,
						//'AssignmentId' => 0,
						'ReferralTypeId' => 10,
						'Date' => $date,
				]);
				
			}
		}

		if ($lunchdr > 0) {
			$msg .= 'Lunch D decreased by ' . abs($lunchdr) . ', ';
			$referrals = Referrals
				::where('StudentId', $id)
				->where('ReferralTypeId', 9)
				->orderBy('id','DESC')
				->get();
			
			for ($i = 0; $i < abs($lunchdr); $i++) {
				$referrals[$i]->delete();
			}
			
		} else if ($lunchdr < 0) {
			$msg .= 'Lunch D increased by ' . abs($lunchdr) . ', ';
			$date = Carbon::today();
			for ($i = 0; $i < abs($lunchdr); $i++) {
				Referrals::create([
						'UserId' => $this->userId,
						'StudentId' => $id,
						'TeacherId' => 0,
						//'AssignmentId' => 0,
						'ReferralTypeId' => 9,
						'Date' => $date,
				]);
				
			}
		}




		$counters->update($request->counters);
		$useraction = Useractions::create([
				'ActionDate' => Carbon::today(),
				'ActionByUserId' => $this->userId,
				'ActionType' => 19,
				'ActionToUserId' => $id,
				'Comment' => $request->Comment . ' [  ' . $msg . '(system)]'
		]);

		return compact('oroomr', 'issr', 'lunchdr', $useraction);
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
