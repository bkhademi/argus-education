<?php

use Illuminate\Database\Seeder;

use App\Schools;
use App\Rooms;
use App\Users;
use App\Roles;
use App\User;
use App\Students;
use App\Classes;
use App\Departments;
use App\Professorclasses;
use App\Classstudents;
use App\Periods;

class professorsAndClasses extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run0()
    {
		DB::beginTransaction();
        $school = Schools::where('Name', 'Estacado High School')->First();
		//grab S1 (fall)
		$term = 'S1'; // current term
		$defaultDepartment = Departments::find(17);
		$teacherClassesJson = File::get(storage_path().'/jsondata/teacherClasses.json');
		$teacherClasses = json_decode($teacherClassesJson);
		
		
		
		foreach($teacherClasses  as $class){
			
			$name = explode(',', $obj->Teacher);
			$first = trim(array_key_exists(1, $name)?$name[1]:'');
			$last = trim($name[0]);
			
//			$teacher = User::create(['Id'=>str_random(128),'FirstName'=>$first, 'LastName'=>$last,
//				'SchoolId'=>$school->Id]);
//			$class = Classes::create(['DepartmentId'=>$defaultDepartment->Id, 
//				'Name'=>$obj->Course, 'Term'=>$obj->Term]);
			
		}
		
			
			
		DB::commit();
    }
	
	
	public function run()
    {
		DB::beginTransaction();	
        $school = Schools::where('Name', 'Estacado High School')->First();
		//grab S1 (fall)
		$term = 'S1'; // current term
		$defaultDepartment = Departments::find(17); // default department
		// load json file and parse
		$teacherClassesJson = File::get(storage_path().'/jsondata/ProfessorsAndClasses.json');
		$teacherClasses = json_decode($teacherClassesJson);
		
		// get the 2 roles 
		$studentRole= Roles::where('Name','Student')->first();
		$teacherRole = Roles::where('Name', 'Teacher')->first();
		
		
		$studentId = null;
		$studentFirst = null;
		$studentLast = null;
		$studentGrade = null;
		foreach($teacherClasses  as $obj){
		
			//print($obj->Course);
			
			// separate teacher name by FirstName and Last Name
			$teacherName = explode(',',$obj->Teacher);
			$first = trim(array_key_exists(1, $teacherName)?$teacherName[1]:'');
			$last = trim($teacherName[0]);
			
			//print_r([$first, $last]);
			
			// if current row doesnt have a studentID then we are dealing with the same student as the last iteration
			// so check if the field is not null,then there is  a student, get its information. 
			if($obj->StudentID !== null){

				$studentId = $obj->StudentID;
				$name = explode(',',$obj->StudentName);
				$studentFirst = trim($name[1]);
				$studentLast = trim($name[0]);
				$studentGrade = $obj->Grade;
				//print_r([$studentFirst, $studentLast, $studentGrade]);
			}
			//  this is  "S1 or S2  /   T / PeriodNumber' ; extract both
			$termPeriod = explode('/', $obj->TermPeriod);
			$periodNo = $termPeriod[2];
			$term  = $termPeriod[0];
			
			$course = $obj->Course;
			$classDb = Classes::firstOrCreate(['Name'=>$course, 'Term'=>$term, 'DepartmentId'=>17] );
			//print_r([$periodNo, $term, $course, $classDb->toArray()]);
			// get the period (possible the error is here)
			$period = Periods::where('Number',$periodNo)
				->where('DayType', 'regular')
				->OrWhere('DayType', 'regularA')
				->OrWhere('DayType', 'regularB')
				->firstOrFail();
			
			$student = User::where('UserName', $studentId)->first();
			if(!$student){
				return;
				//print_r($school->toArray());
				$student = User::create(['Id'=>str_random(128), 'FirstName'=>$studentFirst, 'LastName'=>$studentLast, 
					'SchoolId'=>$school->Id, 'UserName'=>$studentId]);
				$student->roles()->attach($studentRole->Id);
				//print_r($student->toArray());
				$stu = Students::create(['Id'=>$student->Id,
					'StudentId'=>$studentId, 'Grade'=>$studentGrade]);
				//print_r($stu->toArray());
			}else{
				//print_r($student->roles()->get()->toArray());
				if(!$student->roles()->get()->toArray())
					$student->roles()->attach($studentRole->Id);
			}
			
			
			$teacher = User::where('FirstName', $first)->where('LastName',$last)->first();
			if(!$teacher){
				return;
				$teacher = User::create(['Id'=> str_random(128), 'FirstName'=>$first,
					'LastName'=>$last, 'SchoolId'=>$school->Id]);
				$teacher->roles()->attach($teacherRole->Id);
					
			}else{
				if(!$teacher->roles()->get()->toArray())
					$teacher->roles()->attach($teacherRole->Id);
			}
			
			
			$room = Rooms::firstOrCreate(['Name'=> $obj->RoomNo,'SchoolId'=>$school->Id] );
			//first add the professorClass (UserId, ClassId, PeriodId, RoomId)
			if(!$teacher->id){
				print_r($teacher->toArray());
				return;
			}
			// this is wrong.. it should be first or create **** 
			$professorClass = Professorclasses::create(['UserId'=>$teacher->id,'ClassId'=>$classDb->Id,
				'PeriodId'=>$period->Id, 'RoomId'=>$room->Id]);
			
			if(!$student->id){
				print_r($student->toArray());
				return;
			}
			//Second add the classtudent combo (StudentId, ProfessorClassId)
			$classstudent = Classstudents::create(
				['StudentId'=>$student->id, 'ProfessorClassId'=>$professorClass->Id]
			);
			
			

//			$teacher = User::create(['Id'=>str_random(128),'FirstName'=>$first, 'LastName'=>$last,
//				'SchoolId'=>$school->Id]);
//			$class = Classes::create(['DepartmentId'=>$defaultDepartment->Id, 
//				'Name'=>$obj->Course, 'Term'=>$obj->Term]);
			
		}
		
			
			
		DB::commit();
    }
	
}
