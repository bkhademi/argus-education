<?php

namespace App\Http\Controllers;

use App\Http\Requests;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Students;
use App\ClassStudents;
use App\Professorclasses;
use App\User;
use App\Useractions;
use Carbon\Carbon;
use DB;

class StudentsController extends Controller {
	/*	 * syk 
	 * Display a listing of the resource.
	 * Finds the students of a given teacher
	 * teacherId is pased as urlEncoded 
	 * userId is passed in the jwt (json web token)
	 * if no teacherID is given then return the student
	 * of the userId
	 * only students from user's school
	 * @return \Illuminate\Http\Response
	 */

	public function index(Request $request) {
		//get the school of the user
		$schoolId = $this->user->SchoolId;

		$adminRoleId = 'ZSkug3NklRxA2SyJlo3IaQfs2bvkdyXXG3jPGzEfZ0b0pXHafuLwJM77FdZIO3iklYqBRit5qXJXmajNY4WWCX4sFYogV7ekzfrKiH4LKB8VJr1THRZ0si4fcCaiQF7q';

		if ($request->has('allStudents') && $this->user->roles[0]->Id === $adminRoleId) {
			$schoolId = $request->schoolId;
			return Students
					::with(['user' => function($q)use($schoolId) {
							$q->where('SchoolId', $schoolId);
						}])
					->whereHas('user', function($q)use($schoolId) {
						$q->where('SchoolId', $schoolId);
					})
					->get();
		}

		// requesting the students of a given teacher
		if ($request->has('teacherId')) {
			$id = $request->input('teacherId');
		} else if ($request->has('admin')) {
			if ($request->has('light')) {
				return Students::with('user')
						->whereHas('user', function($q)use($schoolId) {
							$q->where('SchoolId', $schoolId);
						})
						->get()->all();
			} else {
				return Students::with('user.activitiesAffected')->get()->all();
			}
		} else {
			$id = $this->getUserId($request);
		}

		//$userId = isset($this->userId) ? $this->userId : $request->input('userId');
		
		$teacherWithClassStudents = User::with('classstudents.user.student')->find($id);
		$uniqueIDs = $teacherWithClassStudents->classStudents->unique('StudentId')->pluck('StudentId');
		$teacherWithClassStudents = User::with('student')
				->with(['student.classes' => function($q) {
						$q->whereHas('professor_class', function($q) {
								$q->where('PeriodId', 9);
							})
						->with('professor_class.classs', 'professor_class.room')
						;
					}])
				->wherein('id', $uniqueIDs)->get();
		return $teacherWithClassStudents;
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
	 * @incoming
	 * UserInfo, StuInfo, ProfessorClasses
	 * 
	 * Store a newly created resource in storage.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @return \Illuminate\Http\Response
	 */
	public function store(Request $request) {
		DB::beginTransaction();
		//


		$user = $request->userInfo;
		$user['id'] = str_random(128);
		$user = User::create($user);
		$stuInfo = $request->StuInfo;
		$stuInfo['Id'] = $user->id;
		$student = Students::create($stuInfo);
		$classes = $request->ProfessorClasses;
		for ($i = 0; $i < count($request->ProfessorClasses); $i++) {
			$classes[$i]['StudentId'] = $user->id;
		}
		$classes = \App\Classstudents::insert($classes);
		DB::commit();
		return compact('user', 'student', 'classes');
	}

	/**
	 * Display the specified resource.
	 *
	 * @param  int  $id
	 * @return \Illuminate\Http\Response
	 */
	public function show($id) {
		//
		$student = Students
			::with(['user.activitiesAffected' => function($q) {
					$q->with('user', 'activity')
					->orderBy('ActionDate','DESC')

					;
					
				}])
			->with(['referred' => function($q){
				$q -> where('Date',Carbon::today())
				->with('referralType','teacher','user','period')
				;
			}])
			->with('counters')
			->with(['classes' => function($q) {
					$q->with(['professor_class' => function($q) {
							$q->with('classs', 'user', 'room');
						}]);
				}])
				->findOrFail($id)
			;

			return $student;
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
			if ($request->has('updateStudent')) {
				$updated = Students::find($id)
					->update($request->except('updateStudent'));
				return $this->updated();
			}

			$student = Students::find($id);
			$student->update($request->all());

			$action = Useractions::create(['ActionDate' => Carbon::today(),
					'ActionByUserId' => $this->userId, 'ActionToUserId' => $id, 'ActionType' => 22,
					//'Comment'=>'Student was Rescheduled from '.$request->oldDate.' to '.$request->newDate,
					'Comment' => $request->ParentNotifiedComment,
					'ParentNotified' => $request->ParentNotified,
					'StudentNotified' => $request->ParentNotified,
					//'Excused'=> $request->excused?1:0
			]);

			return $student;
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
	