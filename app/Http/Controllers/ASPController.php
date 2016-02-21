<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Groups;
use App\Rotationdays;
use App\Studentgroups;
use App\Days;
use App\Activities;
use Carbon\Carbon;
use App\Aspattendance;

class ASPController extends Controller {
	
	
	/**
	 * Display a listing of the resource.
	 *
	 * @return \Illuminate\Http\Response
	 */
	public function index(Request $request) {
		//
		$schoolId = $this->user->SchoolId;
		if ($schoolId === 2) {
			//get dunbar students  from rotationdays

			return Studentgroups::with('student.user.referred', 'group')
					->with(['student.user.referred'=>function($q)use ($request){
						$q->where('Date', new Carbon($request->Date));
					}])
					->with(['student.aspAttendance' => function($q)use($request) {
							$q->where('Date', new Carbon($request->Date));
						}])
					->whereHas('student.user', function($q)use($schoolId) {
						$q->where('SchoolId', $schoolId);
					})
					->get()
			;
		}else{

		switch ($request->select) {
			case 1:
				$date = new Carbon($request->Date);
				$dayOfWeek = $date->dayOfWeek;
				$activitiesIds = Rotationdays
						::where('DayId', $date->dayOfWeek)
						->where('RotationNumber', $request->rotation)
						->distinct()->select('ActivityId')->get()
				;
				$activities = Activities::whereIn('Id', $activitiesIds)->get();
				return $activities;
				break;
			case 2:
				$date = new Carbon($request->Date);
				$dayOfWeek = $date->dayOfWeek;
				$groups = Rotationdays::
						where('DayId', $date->dayOfWeek)
						->where('RotationNumber', $request->rotation)
						->where('ActivityId', $request->program)
						->distinct()->select('GroupId')->get()
				;
				$rotation = $request->rotation;

				$studentGroups = Studentgroups::with('student.user', 'group')
						->with(['student.aspAttendance' => function($q)use($rotation, $date) {
								$q->where('Date', $date)
								->where('RotationNumber', $rotation);
							}])
						->whereIn('GroupId', $groups)->get();
				return $studentGroups;
				break;
			default;
				return response(['msg' => 'Bad Parameters'], 500);
		}
		}
		
		return Rotationdays::all();
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
		return \App\Referrals::ofTypes([12])->get();
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

		$updated = \App\Aspattendance::find($id)
			->update(['Attendance' => $request->attendance]);


		return ['updated' => $updated];
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
