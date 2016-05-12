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

class estacadoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::beginTransaction();	
		$school = Schools::where('Name', 'Estacado High School')->First();
		$term = 'S2'; // current term
		$defaultDepartment = Departments::find(1); // default department
		
		$scheduleJson = File::get(storage_path().'/2016_spring_json/EHS_4_19.json');
		$schedule = json_decode($scheduleJson);
		
		// get the 2 roles 
		$studentRole= Roles::where('Name','Student')->first();
		$teacherRole = Roles::where('Name', 'Teacher')->first();
		
		$studentId = null;
		$studentFirst = null;
		$studentLast = null;
		$studentGrade = null;
		
		for($i=4; $i< count($schedule); $i++){
			$obj = $schedule[$i];
			//print_r($obj);
			$teacherName = explode(',',$obj->FIELD10);
			$teacherFirst = trim(array_key_exists(1, $teacherName)?$teacherName[1]:'');
			$teacherLast = trim($teacherName[0]);
			
			// if current row doesnt have a studentID then we are dealing with the same student as the last iteration
			// so check if the field is not null,then there is  a student, get its information.
			if($obj->FIELD3 !== ''){
				$name = explode(',',$obj->FIELD1);
				$studentFirst = trim($name[1]);
				$studentLast = trim($name[0]);
				$studentId = $obj->FIELD3;
				$studentGrade = $obj->FIELD4;
			}
			
			// period and class stuff
			$termPeriod = explode('/', $obj->FIELD5);
			$periodNo = $termPeriod[2];
			$term  = $termPeriod[0];
			
			$course = $obj->FIELD7;
			$courseSection = $obj->FIELD6;
			$classDb = Classes::firstOrCreate([
				'Name'=>$course, 
				'Term'=>$term,
				'CourseSection'=> $courseSection,
				'DepartmentId'=>1] );
			//print_r([$periodNo, $term, $course, $classDb->toArray()]);
			// get the period (possible the error is here)
			$period = Periods::where('Number',$periodNo)
				->firstOrFail();
			
			
			// student stuff
			$student = User::where('UserName', $studentId)->first();
			if(!$student){
				$student = User::create(['id'=>str_random(128), 'FirstName'=>$studentFirst, 'LastName'=>$studentLast, 
					'SchoolId'=>$school->Id, 'UserName'=>$studentId]);
				//Userroles::insert(['UserId'=>$student->id, 'RoleId'=>$studentRole->Id]);
				$student->roles()->attach($studentRole->Id);
				//print_r($student->toArray());
				$stu = Students::create(['Id'=>$student->id,
					'StudentId'=>$studentId, 'Grade'=>$studentGrade]);
				//print_r($stu->toArray());
			}else{
				//print_r($student->roles()->get()->toArray());
				if(!$student->roles()->get()->toArray())
					$student->roles()->attach($studentRole->Id);
					//Userroles::insert(['UserId'=>$student->Id, 'RoleId'=>$studentRole->Id]);
			}
			
			// teacher stuff
			$teacher = User::where('FirstName', $teacherFirst)->where('LastName',$teacherLast)->first();
			
			if(!$teacher){
				$teacher = User::create(['id'=> str_random(128), 'FirstName'=>$teacherFirst,
					'LastName'=>$teacherLast, 'SchoolId'=>$school->Id]);
				//Userroles::insert(['UserId'=>$teacher->id, 'RoleId'=>$teacherRole->Id]);
				$teacher->roles()->attach($teacherRole->Id);
					
			}else{
				if(!$teacher->roles()->get()->toArray())
					$teacher->roles()->attach($teacherRole->Id);
					//Userroles::insert(['UserId'=>$teacher->id, 'RoleId'=>$teacherRole->Id]);
			}
			 
			
			$roomNo= $obj->FIELD8;
			$room = Rooms::firstOrCreate(['Name'=> $roomNo,'SchoolId'=>$school->Id] );
			
			//first add the professorClass (UserId, ClassId, PeriodId, RoomId)
			if(!$teacher->id ){
				print_r($teacher->toArray());
				echo('no teacherid');
				return;
			}
			// this is wrong.. it should be first or create **** 
			$professorClass = Professorclasses::firstOrCreate(['UserId'=>$teacher->id,'ClassId'=>$classDb->Id,
				'PeriodId'=>$period->Id, 'RoomId'=>$room->Id]);
			
			if(!$student->id){
				print_r($student->toArray());
				echo('no student');
				return;
			}
			//Second add the classtudent combo (StudentId, ProfessorClassId)
			$classstudent = Classstudents::create(
				['StudentId'=>$student->id, 'ProfessorClassId'=>$professorClass->Id]
			);
			
		}
		
		
        //
		
		DB::commit();
    }
}
