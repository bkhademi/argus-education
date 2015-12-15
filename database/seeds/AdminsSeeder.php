<?php

use Illuminate\Database\Seeder;

use App\Schools;
use App\Rooms;
use App\Users;
use App\Roles;
use App\User;
use App\Students;

class AdminsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
		$role = Roles::where('Name','Admin1')->first();
        $users = [
			['Id'=>str_random(128), 'FirstName'=>'Monica', 'LastName'=>'Aguirre',  'email'=>'aguirrem@estacado.edu', 'password'=>Hash::make('secret'), 'SchoolId'=>1],
			['Id'=>str_random(128), 'FirstName'=>'Adrian', 'LastName'=>'Galicia',  'email'=>'agalicia@rohan.sdsu.edu', 'password'=>Hash::make('vision'), 'SchoolId'=>1],
		];
		foreach($users as $user){
			$user = User::create($user);
			//$user->roles()->attach($role->Id);
			
		}
    }
}
