<?php

use Illuminate\Database\Seeder;
use App\Schools;
use App\Rooms;
use App\Roles;
use App\User;
use App\Students;
use App\Classes;
use App\Departments;
use App\Professorclasses;
use App\Classstudents;
use App\Periods;
use App\Userroles;

class UpdateEstacadoSchedules extends Seeder {

	/**
	 * Run the database seeds.
	 *
	 * @return void
	 */
	public function run() {
		$school = Schools::where('Name', 'Estacado High School')->First();
		$term = 'S2'; // current term
		$defaultDepartment = Departments::find(1); // default department

		$scheduleJson = File::get(storage_path() . '/2016_spring_json/3-24EstacadoSchedule.json');
		$schedule = json_decode($scheduleJson);

		// get the 2 roles 
		$studentRole = Roles::where('Name', 'Student')->first();
		$teacherRole = Roles::where('Name', 'Teacher')->first();

		$studentId = null;
		$studentFirst = null;
		$studentLast = null;
		$studentGrade = null;
		$new = true;
		$adding = 0;
		// add new students
		for ($i = 4; $i < count($schedule); $i++) {
			$obj = $schedule[$i];

			$teacherName = explode(',', $obj->FIELD10);
			$teacherFirst = trim(array_key_exists(1, $teacherName) ? $teacherName[1] : '');
			$teacherLast = trim($teacherName[0]);

			if ($obj->FIELD3 !== '') {
				$name = explode(',', $obj->FIELD1);
				$studentFirst = trim($name[1]);
				$studentLast = trim($name[0]);
				$studentId = $obj->FIELD3;
				$studentGrade = $obj->FIELD4;
				$stu = Students::where('StudentId', $studentId)->first();
				if (!$stu) {
					$new = true;
				} else {
					$new = false;
				}
			}
			if ($new) {
				$adding++;
				$termPeriod = explode('/', $obj->FIELD5);
				$periodNo = $termPeriod[2];
				$term = $termPeriod[0];

				$courseSection = $obj->FIELD6;
				$course = $obj->FIELD7;

				$classDb = Classes::FirstOrCreate([
						'Name' => $course,
						'Term' => $term,
						'CourseSection' => $courseSection,
						'DepartmentId' => 1
				]);

				$period = Periods::where('Number', $periodNo)->firstOrFail();


				//student
				$student = User::where('UserName', $studentId)->first();
				if (!$student) {
					$student = User::create(['id' => str_random(128), 'FirstName' => $studentFirst, 'LastName' => $studentLast,
							'SchoolId' => $school->Id, 'UserName' => $studentId]);
					$student->roles()->attach($studentRole->Id);

					$stu = Students::create(['Id' => $student->id,
							'StudentId' => $studentId, 'Grade' => $studentGrade]);
					\App\Counters::create(['Id' => $student->id]);
				} else {
					if (!$student->roles()->get()->toArray())
						$student->roles()->attach($studentRole->Id);
				}

				$teacher = User::where('FirstName', $teacherFirst)->where('LastName', $teacherLast)->first();
				if (!$teacher) {
					$teacher = User::create(['id' => str_random(128), 'FirstName' => $teacherFirst,
							'LastName' => $teacherLast, 'SchoolId' => $school->Id]);
					//Userroles::insert(['UserId'=>$teacher->id, 'RoleId'=>$teacherRole->Id]);
					$teacher->roles()->attach($teacherRole->Id);
				} else {
					if (!$teacher->roles()->get()->toArray())
						$teacher->roles()->attach($teacherRole->Id);
					//Userroles::insert(['UserId'=>$teacher->id, 'RoleId'=>$teacherRole->Id]);
				}

				$roomNo = $obj->FIELD8;
				$room = Rooms::firstOrCreate(['Name' => $roomNo, 'SchoolId' => $school->Id]);

				//first add the professorClass (UserId, ClassId, PeriodId, RoomId)
				if (!$teacher->id) {
					print_r($teacher->toArray());
					echo('no teacherid');
					return;
				}
				// this is wrong.. it should be first or create **** 
				$professorClass = Professorclasses::firstOrCreate(['UserId' => $teacher->id, 'ClassId' => $classDb->Id,
						'PeriodId' => $period->Id, 'RoomId' => $room->Id]);

				if (!$student->id) {
					print_r($student->toArray());
					echo('no student');
					return;
				}
				//Second add the classtudent combo (StudentId, ProfessorClassId)
				$classstudent = Classstudents::create(
						['StudentId' => $student->id, 'ProfessorClassId' => $professorClass->Id]
				);
			}
		}
		print_r($adding);
		// check that the schedule matches the one in the database
		$currentClassIdx = 0;
		$studentId = null;
		$studentFirst = null;
		$studentLast = null;
		$studentGrade = null;
		$diffClasses = 0;
		for ($i = 4; $i < count($schedule); $i++, $currentClassIdx++) {
			$obj = $schedule[$i];

			$teacherName = explode(',', $obj->FIELD10);
			$teacherFirst = trim(array_key_exists(1, $teacherName) ? $teacherName[1] : '');
			$teacherLast = trim($teacherName[0]);

			if ($obj->FIELD3 !== '') {
				$currentClassIdx = 0;
				$name = explode(',', $obj->FIELD1);
				$studentFirst = trim($name[1]);
				$studentLast = trim($name[0]);
				$studentId = $obj->FIELD3;
				$studentGrade = $obj->FIELD4;
				$stu = Students
						::with(['classes.professor_class' => function($q) {
								$q->orderBy('PeriodId', 'ASC');
							}])
						->where('StudentId', $studentId)->first();
				if (!$stu) {
					$new++;
					print_r($obj);
				}
			}

			$teacher = User::where('FirstName', $teacherFirst)->where('LastName', $teacherLast)->first();
			if (!$teacher) {
				$teacher = User::create(['id' => str_random(128), 'FirstName' => $teacherFirst,
						'LastName' => $teacherLast, 'SchoolId' => $school->Id]);
				//Userroles::insert(['UserId'=>$teacher->id, 'RoleId'=>$teacherRole->Id]);
				$teacher->roles()->attach($teacherRole->Id);
			} else {
				if (!$teacher->roles()->get()->toArray())
					$teacher->roles()->attach($teacherRole->Id);
				//Userroles::insert(['UserId'=>$teacher->id, 'RoleId'=>$teacherRole->Id]);
			}

			// period and class stuff
			$termPeriod = explode('/', $obj->FIELD5);
			$periodNo = $termPeriod[2];
			$term = $termPeriod[0];

			$course = $obj->FIELD7;
			$courseSection = $obj->FIELD6;
			$classDb = Classes::firstOrCreate([
					'Name' => $course,
					'Term' => $term,
					'CourseSection' => $courseSection,
					'DepartmentId' => 1]);

			//print_r([$periodNo, $term, $course, $classDb->toArray()]);
			// get the period (possible the error is here)
			$period = Periods::where('Number', $periodNo)
				->firstOrFail();
			$roomNo = $obj->FIELD8;
			$room = Rooms::firstOrCreate(['Name' => $roomNo, 'SchoolId' => $school->Id]);

			$professorClass = Professorclasses::firstOrCreate(['UserId' => $teacher->id, 'ClassId' => $classDb->Id,
					'PeriodId' => $period->Id, 'RoomId' => $room->Id]);
			if (!$stu->classes) {
				print_r($stu->toArray);
				return;
			}
			if ($currentClassIdx > count($stu->classes) - 1) {
				$classstudent = Classstudents::create([
						'StudentId' => $stu->Id,
						'ProfessorClassId' => $professorClass->Id
				]);
				$stu = Students::with(['classes.professor_class' => function($q) {
								$q->orderBy('PeriodId', 'ASC');
							}])
						->where('StudentId', $studentId)->first();
				echo('added an extra class to student '. $stu->StudentId);
				print_r($stu->toArray());
			}
			if ($stu->classes[$currentClassIdx]->ProfessorClassId != $professorClass->Id) {

				$diffClasses++;
				$class = DB::table('classstudents')->where('Id',$stu->classes[$currentClassIdx]->Id)->update(['ProfessorClassId'=>$professorClass->Id]);
				
				
				//print_r(Classstudents::find($stu->classes[$currentClassIdx]->Id)->toArray());
				//$stu->classes[$currentClassIdx]->update(['ProfessorClassId'=> $professorClass->Id]);
				
				
				//print_r([$studentFirst, $studentLast, $studentId, $currentClassIdx]);
				//print_r($obj);
				//print_r([$professorClass->Id]);
				//print_r($stu->toArray());
				//dd($obj);
			}
	}
		dd($diffClasses);
		//DB::commit();
	}

}
