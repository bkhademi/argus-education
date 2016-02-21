<?php

use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Model;
use App\User;
class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Model::unguard();
		
		//$this->call(EstacadoRoomsTableSeeder::class);
		//$this->call(StudentsUsersTablesSeeder::class);
		$this->call(AdminsSeeder::class);
		//$this->call(professorsAndClasses::class);
		//$this->call(estacadoSeeder::class);
		//$this->call(dunbarSeeder::class);
		//$this->call(ervinSeeder::class);
        Model::reguard();
    }
}
