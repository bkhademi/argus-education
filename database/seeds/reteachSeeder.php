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
use App\Referrals;
use App\Useractions;

class reteachSeeder extends Seeder {

	/**
	 * Run the database seeds.
	 *
	 * @return void
	 */
	public function run() {
		
		$listJson = File::get(storage_path() . '/2016_spring_json/reteach-2-15-2016.json');
		$list = json_decode($listJson);
		for ($i = 1; $i < count($list); $i++) {
			$obj = $list[$i];
			$schoolId = 2;
			$nine_per_id = 9;
			
			$student = Students::where('StudentId', $obj->FIELD2)->First();
			
			if(!$student){
				print_r($obj);
				continue;
			}
			$roomId  = Rooms::where('Name',$obj->FIELD3)->firstOrFail()->Id;
			
			//print_r($roomId);
			
			
			$professorClassId = Professorclasses::where('RoomId',$roomId)->first()->Id;
			
			
			
			// Update 10th period
			
			//get the student's 10 period 
//			$class = Classstudents::
//				where('StudentId',$student->Id)
//				->whereHas('professor_class',function($q){
//					$q->where('PeriodId',41);
//				})
//				->first();
//				
//				
//			// if doesnt have a reteach period add it
//				if(!$class){
//					$class = DB::table('classstudents')->insertGetId([
//						'StudentId'=>$student->Id,
//						'ProfessorClassId'=>$professorClassId
//						]);
//					
//				}else{// if it has ,update it
//					
//					$class->ProfessorClassId = $professorClassId;
//					$class->save();
//				}
//				
			
			
			

			//print_r($professorClass->Id);
			$action = Useractions::create([
					'ActionDate' => Carbon\Carbon::today(),
					'ActionByUserId' => 'zzTUEkRuPOdHL8sI0CqJl1FbSQNd3QQn9edmboOVjskLxA8Rfo4oiD41go2USKv12mKmGlD1o0jtIFV6ZGPl56bAP5aAOoKixPVLTJtWUa1nTQLlfg8nkO8wUQHGYjNU',
					'ActionToUserId' => $student->Id,
					'ActionType' => 63,
					'Comment' => 'Student Referred for Reteach  '
			]);

			$referral = Referrals::Create([
					'UserId' => 'zzTUEkRuPOdHL8sI0CqJl1FbSQNd3QQn9edmboOVjskLxA8Rfo4oiD41go2USKv12mKmGlD1o0jtIFV6ZGPl56bAP5aAOoKixPVLTJtWUa1nTQLlfg8nkO8wUQHGYjNU',
					'StudentId' => $student->Id,
					'TeacherId' => 0,
					'RefferalStatus' => 0,
					'ReferralTypeId' => 18,
					'Date' => Carbon\Carbon::today(),
			]);
		}
	}

}
