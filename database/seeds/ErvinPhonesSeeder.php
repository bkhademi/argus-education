<?php

use Illuminate\Database\Seeder;
use App\Students;
class ErvinPhonesSeeder extends Seeder 
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
		DB::beginTransaction();
		
		
		$phonesJson =  File::get(storage_path().'/2016_spring_json/ervinPhones.json');
		$phones = json_decode($phonesJson);
		
		for($i = 4; $i< count($phones); $i++){
			$obj = $phones[$i];
			if($obj->FIELD3 === ''){
				continue;
			}
			$student = Students::where('StudentId', $obj->FIELD1)->first();
			if(!$student){
				print($obj->FIELD1.' '.$obj->FIELD2);
				continue;
			}
			
			$NamePhone = $obj->FIELD9;
			
			$NamePhone = explode('(',$NamePhone);
			
			$student->GuardianName = $NamePhone[0];
			if(count($NamePhone) !== 1 ){// has ( 
				$student->GuardianPhone = '('.$NamePhone[1];
			}
			
			$student->save();
		}
		
		
		DB::commit();
    }
}
