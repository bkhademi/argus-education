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

		Excel::load($file, function ($reader) use ($schoolId) {
//			$reader->each(function($row){
//				dd($row);
//			});

			//		Info for current student
			$currentStudent = new StudentInfo();
			$new = true;
			$adding = 0;
			$newStudents = [];
			$school = Schools::find($schoolId);
			$term = 'S2';
			$defaultDepartmentId = 1;
			$studentRoleId = 'ZSkug3NklRxA2SyJlo3IaQfs2bvkdyXXG3jPGzEfZ0b0pXHafuLwJM77FdZIO3iklYqBRit5qXJXmajNY4WWCX4sFYogV7ekzfrKiH4LKB8VJr1THRZ0si4fcCaiQF7j';
			$teacherRoleId = 'QigWQBHjyc3ozmqqhOY79keLweUDzs5xTFYnhWcrb6EhomjeYEaIefz5qINnLyDmeGFkvx4489l2CXR6PguzJ9VyQ8uM9OW8JzHN3Gx35spNj4ipPdW8qn58Ly5mMQSy';
			// check for new students and add them
			print_r("Now checking for new Students <br /> \n");

			$rows = $reader->toObject();
			foreach ($rows as $row) {
				if (!$row->term_day_period) {
					print_r("End Of File  <br > \n");
					break;
				}
				$teacherName = explode(',', $row->teacher_name);
				$teacherFirst = trim(array_key_exists(1, $teacherName) ? $teacherName[1] : '');
				$teacherLast = trim($teacherName[0]);

				// check if it is a new student
				if ($row->student_id) {
					$currentStudent->clear();// its a new student, so clear all of its properties
					$stu = $currentStudent->populate($row);
				}
				//if (!$stu) {
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
					$currentStudent->get();
					if (!$currentStudent->student) {
						$adding++;
						$currentStudent->create($schoolId);
						$newStudents[] = clone $currentStudent;
					}

					// create teacher if not exists
					$teacher = User::where('FirstName', $teacherFirst)->where('LastName', $teacherLast)->first();
					if (!$teacher) {
						$teacher = User::create(['id' => str_random(128), 'FirstName' => $teacherFirst,
							'LastName' => $teacherLast, 'SchoolId' => $school->Id]);
						//Userroles::insert(['UserId'=>$teacher->id, 'RoleId'=>$teacherRole->Id]);
						$teacher->roles()->attach($teacherRoleId);
					}

					// add the Room if not exists
					$roomNo = $row->room_number;
					$room = Rooms::firstOrCreate(['Name' => $roomNo, 'SchoolId' => $school->Id]);

					//first add the professorClass (UserId, ClassId, PeriodId, RoomId)
					$professorClass = Professorclasses::firstOrCreate(['UserId' => $teacher->id, 'ClassId' => $classDb->Id,
						'PeriodId' => $period->Id, 'RoomId' => $room->Id]);

					//Second add the classtudent combo (StudentId, ProfessorClassId)
					$classstudent = Classstudents::firstOrcreate(
						['StudentId' => $currentStudent->student->Id, 'ProfessorClassId' => $professorClass->Id]
					);
					// check if a new one was created..
					// if a new one was created and the size of the classes >  this  new class period
					// it means that the class changed,, so we need to remove the old one
					// find another class with the same period  and delete  it
				//}
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

	public static function deleteScheduleInfoFromSchoolId($schoolId)
	{
		static::deleteAllClassStudentsFromSchoolId($schoolId);
		//static::deleteAllProfessorClassesFromSchool($schoolId); // removes Assignments too
	}

	public static function deleteAllClassStudentsFromSchoolId($schoolId)
	{
		$classstudents = Classstudents::whereHas('user', function ($q) use ($schoolId) {
			$q->where('SchoolId', $schoolId);
		});

		$classstudents->delete();
		print_r("classstudents = " . $classstudents->get()->count() . "\n");
	}

	public static function deleteAllProfessorClassesFromSchoolId($schoolId)
	{
		$professorclasses = Professorclasses::whereHas('user', function ($q) use ($schoolId) {
			$q->where('SchoolId', $schoolId);
		});
		$professorclasses->delete();
		print_r("professorclassses = " . $professorclasses->get()->count() . "\n");
	}

	public static function updateReteachPeriodsForSchool($file, $schoolId)
	{
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
			$student->classes[0]->ProfessorClassId = $professorClass->Id;
			$student->classes[0]->save();
		} else {// add that reteach professorclasss to the student
			$reteachClassstudent = new Classstudents(['ProfessorClassId' => $professorClass->Id]);
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
	public $student = null;
	private $students = null;
	private  $roleId = 'ZSkug3NklRxA2SyJlo3IaQfs2bvkdyXXG3jPGzEfZ0b0pXHafuLwJM77FdZIO3iklYqBRit5qXJXmajNY4WWCX4sFYogV7ekzfrKiH4LKB8VJr1THRZ0si4fcCaiQF7j';
	public function __construct($schoolId = null)
	{
		if ($schoolId) {
			$this->students = Students::whereHas('user', function ($q) use ($schoolId) {
				$q->where('SchoolId', $schoolId);
			})->get();
		}
	}


	public function clear()
	{
		$this->studentId = null;
		$this->studentFirst = null;
		$this->studentLast = null;
		$this->studentGrade = null;
		$this->student = null;
	}

	public function populate($row)
	{
		$name = explode(',', $row->student_name);
		$this->studentFirst = trim($name[1]);
		$this->studentLast = trim($name[0]);
		$this->studentId = $row->student_id;
		$this->studentGrade = $row->grade;

		if ($this->students) {
			return $this->students->where('StudentId', $this->studentId);
		} else {
			return Students::where('StudentId', $this->studentId)->first();
		}
	}

	public function __toString()
	{
		return $this->studentId . ', ' .
		$this->studentFirst . ', ' .
		$this->studentLast . ', ' .
		$this->studentGrade . "<br />\n";
	}

	public function create($schoolId){
		$student = User::create(['id' => str_random(128), 'FirstName' => $this->studentFirst, 'LastName' => $this->studentLast,
			'SchoolId' => $schoolId, 'UserName' => $this->studentId]);
		$student->roles()->attach($this->roleId);

		$stu = Students::create(['Id' => $student->id,
			'StudentId' => $this->studentId, 'Grade' => $this->studentGrade]);
		\App\Counters::create(['Id' => $student->id]);

		$this->student =  $stu;
	}

	public function get(){
		if($this->student) {
			return;
		}
		$this->student = Students::where('StudentId',$this->studentId)->first();
	}


}