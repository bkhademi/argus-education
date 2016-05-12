<?php

namespace App\Helpers;


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
use App\Referrals;
use App\Useractions;
use DB;
use Excel;

class ScheduleHelper
{


	public static function store($file, $schoolId)
	{
		//DB::beginTransaction();
		Excel::load($file, function ($reader) use ($schoolId) {
			//		Info for current student
			$currentStudent = new StudentInfo();
			$new = true;
			$adding = 0;
			$newStudents = [];
			$school = Schools::find($schoolId);
			$term = 'S2';
			$defaultDepartmentId = 1;
			$studentRoleId = Roles::where('Name', 'Student')->first()->Id;
			$teacherRoleId = Roles::where('Name', 'Teacher')->first()->Id;
			// check for new students and add them
			print_r("Now checking for new Students <br /> \n");
			$rows = $reader->toObject();
			foreach ($rows as $row) {
				if (!$row->term_day_period) {
					print_r("End Of First Loop  <br > \n");
					break;
				}
				$teacherName = explode(',', $row->teacher_name);
				$teacherFirst = trim(array_key_exists(1, $teacherName) ? $teacherName[1] : '');
				$teacherLast = trim($teacherName[0]);

				// check if it is a new student
				if ($row->student_id)
					$stu = $currentStudent->populate($row);

				if (!$stu) {

					$termPeriod = explode('/', $row->term_day_period);
					$periodNo = $termPeriod[2];
					$term = $termPeriod[0];

					$courseSection = $row->course_section;
					$course = $row->course_description;
					$classDb = Classes::firstOrCreate([
						'Name' => $course,
						'Term' => $term,
						'CourseSection' => $courseSection,
						'DepartmentId' => $defaultDepartmentId
					]);
					$period = Periods::where('Number', $periodNo)->firstOrfail();

					//student
					$student = User::where('UserName', $currentStudent->studentId)->first();
					if (!$student) {
						$adding++;

						$student = User::create(['id' => str_random(128), 'FirstName' => $currentStudent->studentFirst, 'LastName' => $currentStudent->studentLast,
							'SchoolId' => $school->Id, 'UserName' => $currentStudent->studentId]);
						$student->roles()->attach($studentRoleId);

						$stu = Students::create(['Id' => $student->id,
							'StudentId' => $currentStudent->studentId, 'Grade' => $currentStudent->studentGrade]);
						\App\Counters::create(['Id' => $student->id]);
						$newStudents[] = clone $currentStudent;
					} else {
						if (!$student->roles()->get()->toArray())
							$student->roles()->attach($studentRoleId);
					}

					// create teacher if not exists
					$teacher = User::where('FirstName', $teacherFirst)->where('LastName', $teacherLast)->first();
					if (!$teacher) {
						$teacher = User::create(['id' => str_random(128), 'FirstName' => $teacherFirst,
							'LastName' => $teacherLast, 'SchoolId' => $school->Id]);
						//Userroles::insert(['UserId'=>$teacher->id, 'RoleId'=>$teacherRole->Id]);
						$teacher->roles()->attach($teacherRoleId);
					} else {
						if (!$teacher->roles()->get()->toArray())
							$teacher->roles()->attach($teacherRoleId);
						//Userroles::insert(['UserId'=>$teacher->id, 'RoleId'=>$teacherRole->Id]);
					}

					// add the Room if not exists
					$roomNo = $row->room_number;
					$room = Rooms::firstOrCreate(['Name' => $roomNo, 'SchoolId' => $school->Id]);

					//first add the professorClass (UserId, ClassId, PeriodId, RoomId)
					if (!$teacher->id) {
						print_r($teacher->toArray());
						echo('no teacherid');
						return;
					}

					$professorClass = Professorclasses::firstOrCreate(['UserId' => $teacher->id, 'ClassId' => $classDb->Id,
						'PeriodId' => $period->Id, 'RoomId' => $room->Id]);

					if (!$student->id) {
						print_r($student->toArray());
						echo('no student');
						return;
					}

					//Second add the classtudent combo (StudentId, ProfessorClassId)
					$classstudent = Classstudents::firstOrcreate(
						['StudentId' => $student->id, 'ProfessorClassId' => $professorClass->Id]
					);
					// check if a new one was created..
					// if a new one was created and the size of the classes >  this  new class period
					// it means that the class changed,, so we need to remove the old one
					// find another class with the same period  and delete  it 
				}
			}

			print_r($adding . " New Students were Added  <br /> \n");
			// loop to print added students
			foreach ($newStudents as $stu)
				print($stu);
			dd("END");
			print_r("Now checking if changes in schedules <br /> \n");
			// check for changes in student's schedule
			$currentStudent->clear();
			$diffClasses = 0;
			foreach ($rows as $row) {
				$teacherName = explode(',', $row->teacher_name);
				$teacherFirst = trim(array_key_exists(1, $teacherName) ? $teacherName[1] : '');
				$teacherLast = trim($teacherName[0]);

				// dealing with a new student in excel
				if ($row->student_id) {
					$currentClassIdx = 0;
					$currentStudent->populate($row);
					$stu = Students
						::with(['classes.professor_class' => function ($q) {
							$q->orderBy('PeriodId', 'ASC');
						}])
						->where('StudentId', $currentStudent->studentId)->first();
					if (!$stu) {
						$new++;
						print($currentStudent);
						return;
					}
				}

				$teacher = User::where('FirstName', $teacherFirst)->where('LastName', $teacherLast)->first();
				if (!$teacher) {
					$teacher = User::create(['id' => str_random(128), 'FirstName' => $teacherFirst,
						'LastName' => $teacherLast, 'SchoolId' => $school->Id]);
					//Userroles::insert(['UserId'=>$teacher->id, 'RoleId'=>$teacherRole->Id]);
					$teacher->roles()->attach($teacherRoleId);
				} else {
					if (!$teacher->roles()->get()->toArray())
						$teacher->roles()->attach($teacherRoleId);
					//Userroles::insert(['UserId'=>$teacher->id, 'RoleId'=>$teacherRole->Id]);
				}

				// period and class stuff
				$termPeriod = explode('/', $row->term_day_period);
				$periodNo = $termPeriod[2];
				$term = $termPeriod[0];

				$courseSection = $row->course_section;
				$course = $row->course_description;
				$classDb = Classes::firstOrCreate([
					'Name' => $course,
					'Term' => $term,
					'CourseSection' => $courseSection,
					'DepartmentId' => $defaultDepartmentId
				]);

				//print_r([$periodNo, $term, $course, $classDb->toArray()]);
				// get the period (possible the error is here)
				$period = Periods::where('Number', $periodNo)->firstOrFail();
				$roomNo = $row->room_number;
				$room = Rooms::firstOrCreate(['Name' => $roomNo, 'SchoolId' => $school->Id]);

				$professorClass = Professorclasses::firstOrCreate(['UserId' => $teacher->id, 'ClassId' => $classDb->Id,
					'PeriodId' => $period->Id, 'RoomId' => $room->Id]);
				if (!$stu->classes) {
					print_r("student doesnt have classses \n");
					print_r($stu->toArray);
					return;
				}
				if ($currentClassIdx > count($stu->classes) - 1) {
					$classstudent = Classstudents::create([
						'StudentId' => $stu->Id,
						'ProfessorClassId' => $professorClass->Id
					]);
					$stu = Students::with(['classes.professor_class' => function ($q) {
						$q->orderBy('PeriodId', 'ASC');
					}])
						->where('StudentId', $currentStudent->studentId)->first();
					echo('added an extra class to student ' . $stu->StudentId . "\n");
					print_r($stu->toArray());
				}
				if ($stu->classes[$currentClassIdx]->ProfessorClassId != $professorClass->Id) {

					$diffClasses++;
					$class = DB::table('classstudents')->where('Id', $stu->classes[$currentClassIdx]->Id)->update(['ProfessorClassId' => $professorClass->Id]);


					//print_r(Classstudents::find($stu->classes[$currentClassIdx]->Id)->toArray());
					//$stu->classes[$currentClassIdx]->update(['ProfessorClassId'=> $professorClass->Id]);


					//print_r([$studentFirst, $studentLast, $studentId, $currentClassIdx]);
					//print_r($obj);
					//print_r([$professorClass->Id]);
					//print_r($stu->toArray());
					//dd($obj);
				}
			}


		});
	}

	public static function updateReteachPeriodsForSchool($file, $schoolId)
	{
		DB::beginTransaction();
		Excel::load($file, function ($reader) use ($schoolId) {
			$rows = $reader->toObject();
			forEach ($rows as $row) {
				ScheduleHelper::updateReteachPeriod($row->studentid, $row->room);
			}
		});
	}

	public static function updateReteachPeriod($studentId, $roomNumber)
	{
		$reteachClassId = 1712;


		$student = Students
			::with(['classes' => function ($q) use ($roomNumber, $reteachClassId) {
				$q->whereHas('professor_class.room', function ($q) use ($roomNumber) {
					$q->where('Name', $roomNumber);
				})
					->whereHas('professor_class.classs', function ($q) use ($reteachClassId) {
						$q->where('id', $reteachClassId);
					});
			}])
			->where('StudentId', $studentId)->first();

		$room = Rooms::where('Name', $roomNumber)->first();

		$professorClass = Professorclasses
			::whereHas('room', function ($q) use ($roomNumber) {
				$q->where('Name', $roomNumber);
			})->whereHas('user', function ($q) {
				$q->where('SchoolId', 2);
			})
			->first();
		$professor = $professorClass->user;

		// check if teacher has a reteach class
		$reteachClass = Professorclasses
			::whereHas('room', function ($q) use ($roomNumber) {
				$q->where('Name', $roomNumber);
			})
			->whereHas('user', function ($q) use ($professor) {
				$q->where('id', $professor->id);
			})
			->whereHas('classs', function ($q) use ($reteachClassId) {
				$q->where('id', $reteachClassId);
			})
			->first();

		if (!$reteachClass) {
			// add that reteach class to that teacher
			$professorClass = new Professorclasses(['ClassId' => $reteachClassId, 'PeriodId' => 10, 'RoomId' => $room->Id]);
			$professor->professorClasses()->save($professorClass);
			$reteachClass = $professorClass;
		}

		// at this point reteachClass exists
		//check if student already has a reteach class
		if ($student->classes->count() > 0) {// update that class' professorClass
			$student->classes[0]->ProfessorClassId  = $professorClass->Id;
			$student->classes[0]->save();
		} else {// add that reteach professorclasss to the student
			$reteachClassstudent  = new Classstudents(['ProfessorClassId'=>$professorClass->Id]);
			$student->classes()->save($reteachClassstudent);
		}



	}

}


class StudentInfo
{
	public $studentId = null;
	public $studentFirst = null;
	public $studentLast = null;
	public $studentGrade = null;

	public function clear()
	{
		$this->studentId = null;
		$this->studentFirst = null;
		$this->studentLast = null;
		$this->studentGrade = null;
	}

	public function populate($row)
	{
		$name = explode(',', $row->student_name);
		$this->studentFirst = trim($name[1]);
		$this->studentLast = trim($name[0]);
		$this->studentId = $row->student_id;
		$this->studentGrade = $row->grade;
		return Students::where('StudentId', $this->studentId . 'a')->first();
	}

	public function __toString()
	{
		return $this->studentId . ', ' .
		$this->studentFirst . ', ' .
		$this->studentLast . ', ' .
		$this->studentGrade . "<br />\n";
	}


}