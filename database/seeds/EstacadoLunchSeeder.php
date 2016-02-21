<?php

use Illuminate\Database\Seeder;

use App\Students;

class EstacadoLunchSeeder extends Seeder {

	/**
	 * Run the database seeds.
	 *
	 * @return void
	 */
	public function run() {
		//
		DB::beginTransaction();
		$lunchsJson = File::get(storage_path() . '/2016_spring_json/EstacadoS2_SSL.json');
		$lunch = json_decode($lunchsJson);
		
		$studentId = null;
		
		for($i=4; $i< count($lunch); $i++){
			$obj = $lunch[$i];
			if($obj->FIELD3 !== ''){
				$studentId = $obj->FIELD3;
			}
			if($obj->FIELD9 !== ''){
				$student = Students::where('StudentId', $studentId)->first();
				$student->LunchType = $obj->FIELD9;
				$student->save();
			}
			
		}
		
		DB::commit();
	}

}
