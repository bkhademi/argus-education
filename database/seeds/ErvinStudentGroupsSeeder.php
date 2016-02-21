<?php

use Illuminate\Database\Seeder;
use App\Rotationdays;
use App\Studentgroups;
use App\Students;
use App\Groups;

class ErvinStudentGroupsSeeder extends Seeder
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
		Excel::selectSheetsByIndex(0)->load('storage/2016ErvinASP/2015-16 Ervin ASP S2.xlsx',function($reader){
			
			$reader->each(function($stu){
				$studentId = Students::where('StudentId',$stu->student_id)->firstOrFail()->Id;
				$groupId = Groups::where('Name',$stu->group)->firstOrFail()->Id;
				$caseNumber = $stu->casenum;
				print_r($studentId);
				print_r("   ".$groupId);
				print_r("   ".$caseNumber . "\n");
				
				Studentgroups::create(['StudentId'=>$studentId, 'GroupId'=>$groupId, 'CaseNumber'=>$caseNumber]);
				
//				print_r( $stu->student_id);
//				print_r('   '.$stu->casenum);
//				print_r('   '.$stu->group);\
//				print_r("\n");
			});
		});
		
		DB::commit();
    }
}
