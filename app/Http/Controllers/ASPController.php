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
use App\Aspchanges;

class ASPController extends Controller {
	
	
	/**
	 * Display a listing of the resource.
	 *
	 * @return \Illuminate\Http\Response
	 */
	public function index(Request $request) {
		//
		$schoolId = $this->user->SchoolId;
		if ($schoolId === 2 || $schoolId === 5) {
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
				case 1:// get the activities for the current rotation


					$date = new Carbon($request->Date);
					if($date->gte(new Carbon("Jan 11 2016"))  // only PE
						&& $date->lte(new Carbon("Jan 15 2016")) )
					{
						return Activities::where('Name','PE')->get();
					}



					$dayOfWeek = $date->dayOfWeek;
					$activitiesIds = Rotationdays
						::where('DayId', $date->dayOfWeek)
						->where('RotationNumber', $request->rotation)
						->distinct()->select('ActivityId')->get()
					;
					$activities = Activities::whereIn('Id', $activitiesIds)->get();

					if($date->gte(new Carbon("Jan 15 2016"))
						&& $date->lte(new Carbon("Jan 27 2016")))
					{
						$activities = $activities->reject(function($item){
							return $item->Id === 79  ;
						});
						$activities = $activities->values();
					}

					return $activities;
					break;
				case 2: // get students for selected group
					$date = new Carbon($request->Date);

					$dayOfWeek = $date->dayOfWeek;
					$groups = Rotationdays::
					where('DayId', $date->dayOfWeek)
						->where('RotationNumber', $request->rotation)
						->where('ActivityId', $request->program)
						->distinct()->select('GroupId')
						->get()
					;
					$rotation = $request->rotation;

					if($date->gte(new Carbon("Jan 11 2016")) // only PE
						&& $date->lte(new Carbon("Jan 15 2016"))
					){
						$groups = Groups::select('Id')->get();
					}

					else if($request->program == 84 && ($date->gt(new Carbon("Jan 15 2016"))
							&& $date->lte(new Carbon("Jan 27 2016")) ) )
					{
						$groupsForCooking = Rotationdays::
						where('DayId', $date->dayOfWeek)
							->where('RotationNumber',$request->rotation)
							->whereIn('ActivityId',[79] )
							->distinct()->select('GroupId')
							->get();

						foreach($groupsForCooking as $grp){
							$groups->push($grp);
						}

					}else{

						$groups= $this->getGroupsChanges($date,$request->rotation,$request->program,$groups);

					}

					$studentGroups = Studentgroups::with( 'student.user','group')
						->with(['student.aspAttendance' => function($q)use($rotation, $date) {
							$q->where('Date', $date)
								->where('RotationNumber', $rotation);
						}])
						->whereHas('student.user',function($q){
							$q->where('SchoolId',3);
						})
						->whereIn('GroupId', $groups)
						->join('aspnetusers', 'studentgroups.StudentId', '=', 'aspnetusers.id')
						->orderBy('GroupId',"ASC")
						->orderBy('FirstName', 'ASC')
						->select('studentgroups.*')
						->get();


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

	private function getGroupsChanges($date, $rotation, $activity, $groups){
		$changes = Aspchanges::
		where('DayId', $date->dayOfWeek)
			->where('Date', '<=', $date)
			->where('RotationNumber',$rotation)
			->where('Range',true)
			->orderBy('Date','ASC')
			->get();


		foreach($changes as $change){


			$contains = $groups->contains(function($key,$value)use($change){

				return $value['GroupId'] == $change->GroupId;
			});

			//print(gettype($change->ToActivityId) . '=');
			//print_r($contains?'true':'false' . '/');
			//print(gettype($activity) . '=');
			//print_r(($change->ToActivityId === $activity)?'true':'false' . '--');

			if($contains && !($change->ToActivityId == $activity)){
				//dd('removed');
				$groups = $groups->reject(function($item)use($change){
					return $item['GroupId'] == $change->GroupId;
				});
			}else if( ($change->ToActivityId == $activity) &&  !$contains ){
				//dd('added');
				$groups->push(['GroupId'=>$change->GroupId]);
			}else{
				//dd('both are equal');
			}

		}
		return $groups;
	}
}
