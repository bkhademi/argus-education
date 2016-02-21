<?php

use Illuminate\Database\Seeder;
use App\Students;
use App\Counters;

class populateCountersSeeder extends Seeder {

	/**
	 * Run the database seeds.
	 *
	 * @return void
	 */
	public function run() {
		DB::beginTransaction();
		
		$students = Students::first();
		dd($students->counters());
		
		return;
		$students = Students::all();

		foreach($students as $obj){
			
			Counters::create(['Id'=>$obj->Id]);
		}
		DB::commit();
	}

}
