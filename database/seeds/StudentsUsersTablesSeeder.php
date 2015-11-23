<?php

use Illuminate\Database\Seeder;

use App\Schools;
use App\Rooms;
use App\Users;
use App\Roles;
use App\User;
use App\Students;

class StudentsUsersTablesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
		DB::beginTransaction();
        $schoolId = Schools::where('Name', 'Estacado High School')->first()->Id;
		$role= Roles::where('Name','Student')->first();
		$usersJson = File::get(storage_path().'/jsondata/students.json');
		$users = json_decode($usersJson);
		echo count($users);
		for($i=0;$i<count($users); $i+= 2){
			$user=  $users[$i];
			$address= $users[$i+1];
			$names = explode(',', $user->StudentName);
			$parentInfo = explode(' ',trim(preg_replace('/\s+/',' ', $user->ParentInfo)), 3);
			$parentName = $parentInfo[0].', '.$parentInfo[1];
			//var_dump($parentName);
			$parentPhone = array_key_exists(2,$parentInfo)?$parentInfo[2]:'';
			
			//$user = User::where('UserName', $user->ID)->first()->roles()->attach($role->Id);
			
//			$newUser = User::create([
//				"Id"=>str_random(128),
//				'FirstName'=>trim(isset($names[1])?$names[1]:'' ),
//				'LastName'=>trim(isset($names[0])?$names[0]:'' ),
//				'BirthDate'=>$user->BirthDate,
//				'Gender'=>$user->Gender,
//				'Ethnicity'=>$user->Ethnicity,
//				'UserName'=>$user->ID,
//				'SchoolId'=>$schoolId
//				])->roles()->attach($role->Id);
			$student = Students::where('StudentId', $user->ID);
			if(!$student){
				echo 'student not found';
				return;
			}else{
				$student->update(['GuardianPhone'=>$parentPhone, 'GuardianName'=>$parentName]);
			}
//			$student = Students::create([
//				'Id'=>$newUser->Id,
//				'StudentId'=>$user->ID,
//				'Grade'=>$user->Grade,
//				'GuardianPhone'=>$parentPhone,
//				'GuardianName'=>$parentName,
//				
//			]);
			
		}
		
		DB::commit();

    }
}
