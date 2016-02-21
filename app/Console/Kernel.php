<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;
use DB;
use Carbon\Carbon;
use App\Studentgroups;
use App\Aspattendance;

class Kernel extends ConsoleKernel {

	/**
	 * The Artisan commands provided by your application.
	 *
	 * @var array
	 */
	protected $commands = [
		\App\Console\Commands\Inspire::class,
	];

	/**
	 * Define the application's command schedule.
	 *
	 * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
	 * @return void
	 */
	protected function schedule(Schedule $schedule) {
		$schedule->call(function() {
			// create estacado attendance
			$date = Carbon::today();
			// restrict to not dunbar
			$aspStudents = Studentgroups::whereHas('student.user', function($q) {
					$q->where('SchoolId', 1);
				})->get();
			$rotations = [1, 2];

			foreach ($rotations as $rotation) {
				foreach ($aspStudents as $student) {
					Aspattendance::create([
						'Date' => $date,
						'StudentId' => $student->StudentId,
						'Attendance' => 1,
						'RotationNumber' => $rotation
					]);
				}
			}
			// attenrance for dunbar  
			$aspstudents = studentgroups::whereHas('student.user', function($q) {
					$q->where('SchoolId', 2);
				})->get();

			foreach ($aspstudents as $student) {
				Aspattendance::create([
					'Date' => Carbon::today(),
					'StudentId' => $student->StudentId,
					'Attendance' => 1,
					'RotationNumber' => 0
				]);
			}

			$yesterday = Carbon::yesterday();
			$iss = \App\Students::with(['referred' => function($q)use($yesterday) {
						$q->whereNotIn('ReferralTypeId',[12, 18])
						->where('RefferalStatus',0)
						->where('Date', $yesterday)
						;
					}])
					->whereHas('referred',function($q)use($yesterday){
						$q->where('Date',$yesterday)
						//->orWhere('Date',Carbon::today()->subWeekDays(2))
						;
					})
					->whereHas('counters',function($q){
						$q->where('ISSDays','>',0);
					})->get()

			;
			// move all yesterday referrals for students with iss for today
			// this includes all orm, and other iss referrals 
			foreach($iss as $stu){
				foreach($stu->referred as $ref){
					$ref->update(['Date'=>Carbon::today()]);
				}
			}	
			
			// move dunbar's yesterday's lunchs referrals to today
		$dunbarSchoolId = 2;
		\App\Referrals
			::where('Date',Carbon::yesterday())
			->where('ReferralTypeId',9)
			->where('RefferalStatus',0)
			->whereHas('studentUser',function($q)use($dunbarSchoolId){
				$q->where('SchoolId',$dunbarSchoolId);
			})->update(['Date',Carbon::today()])
		;
					
		})->weekdays()->dailyAt('4:30');
		
		
	}

}
