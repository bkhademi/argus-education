<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;


use Carbon\Carbon;
use App\Studentgroups;
use App\Aspattendance;
use DB;


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
use App\Counters;
use Excel;
use App\Referralconsequences;
use App\Referralactions;

use File;

class MorningJobs extends Command
{
	/**
	 * The name and signature of the console command.
	 *
	 * @var string
	 */
	protected $signature = 'morningjobs';

	/**
	 * The console command description.
	 *
	 * @var string
	 */
	protected $description = 'run jobs in the morning';

	/**
	 * Create a new command instance.
	 *
	 * @return void
	 */
	public function __construct()
	{
		parent::__construct();
	}

	/**
	 * Execute the console command.
	 *
	 * @return mixed
	 */
	public function handle()
	{


		//$this->fixRosters();
		//$this->updateDunbarReteachSchedules('reteachdunbar4-19-2016.json');
		//$this->createDunbarReteachAttendance('reteachdunbar4-19-2016.json');


		//$this->createASPAttendancesForAWeek([2, 3, 5], new Carbon('Apr 25 2016')); // for the 3 schools, ervin(3) , dunbar(2), alderson(5)

		//$this->fixRosters();
		//$this->clearAdrianSchool();
		//$this->moveFromFollowupReteach();
		//$this->miscellaneous(2);
		//$this->miscellaneous2();
		//$this->moveLunchDetention('Apr 04 2016', 'Apr 05 2016');
		//dd(Referralactions::all()->toArray());
		//$this->moveAndMarkOSSOverlaps();
	}

	private function moveFromFollowupReteach()
	{
		$date = '2016-03-28';
		$refs = Referrals
			::wherehas('user', function ($q) {
				$q->where('SchoolId', 2);
			})
			->where('ReferralTypeId', 12)
			->where('Date', $date);

		$refs->update(['Date' => Carbon::tomorrow()]);

	}

	private function createASPAttendancesForAWeek($schoolIds, $date)
	{
		foreach ($schoolIds as $schoolId) {
			$days = 0;
			$aspStudents = Studentgroups
				::whereHas('student.user', function ($q) use ($schoolId) {
					$q->where('SchoolId', $schoolId);
				})
				->get();
			$schoolName = Schools::find($schoolId)->Name;

			if ($schoolId == 3) // ervin 2 rotations
				$rotations = [1, 2];
			else  // other schools 1 rotation
				$rotations = [0];

			do {
				$this->createAttendanceForADate($date, $aspStudents, $rotations, $schoolName);
				$date->addWeekDay();
				$days++;
			} while ($days < 5);
		}
	}

	private function createAttendanceForADate($date, $students, $rotations, $schoolName)
	{
		$created = 0;
		$fetched = 0;
		foreach ($rotations as $rotation) {
			foreach ($students as $student) {
				$att = Aspattendance::firstOrCreate([
					'Date' => $date,
					'StudentId' => $student->StudentId,
					'Attendance' => 1,
					'RotationNumber' => $rotation
				]);
				if ($att->wasRecentlyCreated)
					$created++;
				else
					$fetched++;

			}
		}
		echo "           $schoolName     $date         \n";
		echo "created =  $created \n";
		echo "fetched = $fetched \n";
		echo "\n";
	}

//because ISS
	private function fixRosters()
	{
		// fix rosters
		$yesterday = Carbon::today()->subWeekDay();
		$iss = \App\Students::with(['referred' => function ($q) use ($yesterday) {
			$q->whereNotIn('ReferralTypeId', [12, 18, 9])
				->where('RefferalStatus', 0)
				->where('Date', $yesterday);
		}])
			->whereHas('referred', function ($q) use ($yesterday) {
				$q->where('Date', $yesterday);
			})
			->whereHas('counters', function ($q) {
				$q->where('ISSDays', '>', 0);
			})->get();
		// move all previous day's referrals for students with iss today
		// this includes all ORM, and other ISS referrals
		foreach ($iss as $stu) {
			foreach ($stu->referred as $ref) {
				$newRef = $ref->replicate();
				$newRef->Date = Carbon::today();
				$newRef->ActivityTypeId = 0;
				$newRef->save();
				$newRef->created_at = $ref->created_at;
				$newRef->save();
				$ref->ActivityTypeId = 0;
				$ref->save();
			}
		}

		// move dunbar yesterday's lunch referrals to today
		/*$dunbarSchoolId = 2;
		\App\Referrals
		::where('Date',$yesterday)
		->where('ReferralTypeId',9)
		->where('RefferalStatus',0)
		->whereHas('StudentUser',function($q)use($dunbarSchoolId){
			$q->where('SchoolId', $dunbarSchoolId);
		})
		->update(['Date'=>Carbon::today()]);
		*/
		/* // get students that have orm days but no orm referrals for current day
		$orm =  \App\Students::with(['referred'=>function($q)use($yesterday){
			$q->whereNotIn('ReferralTypeId',[12,18,9])
			->where('RefferalStatus',0)
			->where('Date',$yesterday);
		}])
		->whereHas('counters',function($q){
			$q->where('ORoomsToBeServed','>',0);
		})
		->whereHas('referred',function($q){
			$q->WhereIn('ReferralTypeId',[1,2,3,16,19])
			->where('Date',Carbon::today())
			;
		})
		->get();

		dd($orm); */
	}

	private function updateDunbarReteachSchedules($fileName)
	{
		$listJson = File::get(storage_path() . '/2016_spring_json/' . $fileName);
		$list = json_decode($listJson);

		for ($i = 1; $i < count($list); $i++) {
			$obj = $list[$i];
			$schoolId = 2;
			$nine_per_id = 9;

			$student = Students::where('StudentId', $obj->FIELD2)->first();
			if (!$student) {
				print_r($obj);
				continue;
			}

			$roomId = Rooms::where('Name', $obj->FIELD3)->firstOrFail()->Id;

			$professorClassId = Professorclasses::where('RoomId', $roomId)->first()->Id;

			//get the student's 10 period
			$class = Classstudents::
			where('StudentId', $student->Id)
				->whereHas('professor_class', function ($q) {
					$q->where('PeriodId', 41);
				})
				->first();


			// if doesnt have a reteach period add it
			if (!$class) {
				$class = DB::table('classstudents')->insertGetId([
					'StudentId' => $student->Id,
					'ProfessorClassId' => $professorClassId
				]);

			} else {// if it has ,update it

				$class->ProfessorClassId = $professorClassId;
				$class->save();
			}

		}
	}

	private function createDunbarReteachAttendance($fileName)
	{
		$listJson = File::get(storage_path() . '/2016_spring_json/' . $fileName);
		$list = json_decode($listJson);
		$date = Carbon::today();
		for ($j = 0; $j < 4; $j++) {
			for ($i = 1; $i < count($list); $i++) {
				$obj = $list[$i];
				$schoolId = 2;
				$nine_per_id = 9;

				$student = Students::where('StudentId', $obj->FIELD2)->first();
				if (!$student) {
					print_r($obj);
					continue;
				}

//				$action = Useractions::firstOrCreate([
//					'ActionDate' => $date,
//					'ActionByUserId' => 'zzTUEkRuPOdHL8sI0CqJl1FbSQNd3QQn9edmboOVjskLxA8Rfo4oiD41go2USKv12mKmGlD1o0jtIFV6ZGPl56bAP5aAOoKixPVLTJtWUa1nTQLlfg8nkO8wUQHGYjNU',
//					'ActionToUserId' => $student->Id,
//					'ActionType' => 63,
//					'Comment' => 'Student Referred for Reteach  '
//				]);

				$referral = Referrals::firstOrCreate([
					'UserId' => 'zzTUEkRuPOdHL8sI0CqJl1FbSQNd3QQn9edmboOVjskLxA8Rfo4oiD41go2USKv12mKmGlD1o0jtIFV6ZGPl56bAP5aAOoKixPVLTJtWUa1nTQLlfg8nkO8wUQHGYjNU',
					'StudentId' => $student->Id,
					'TeacherId' => 0,
					'RefferalStatus' => 0,
					'ReferralTypeId' => 18,
					'Date' => $date,
				]);
			}
			$date->addWeekDay();
		}
	}

	private function createDunbarReteachAttendance2($fileName)
	{
		Excel::load(storage_path() . '/2016_spring_csv/' . $fileName, function ($sheet) {
			$sheet->each(function ($row) {

				$student = Students::whereStudentid($row->studentid)->first();
				dd($student->toArray());
				print_r(intval($row->studentid) . "\n");

			});
		});
	}

	private function clearAdrianSchool()
	{
		$students = Students::with('counters', 'referred', 'user.activitiesAffected')
			->ofSchoolId(4)
			->get();

		foreach ($students as $stu) {
			// reset counters
			$stu->counters->update(['ORoomsToBeServed' => 0, 'ORMReferrals' => 0, 'LunchDetentionsToBeServed' => 0, 'LDReferrals' => 0, 'ISSDays' => 0, 'ISSReferrals' => 0, 'OSSReferral' => 0, 'OSSPMP' => 0]);
			//remove referrals
			if ($stu->referred)
				foreach ($stu->referred as $ref)
					$ref->delete();
			//remove actions

			if ($stu->user->activitiesAffected) {
				foreach ($stu->user->activitiesAffected as $act)
					$act->delete();
			}

		}


	}

	private function commitAECAttendanceToProfiles($schoolId)
	{

	}

	private function miscellaneous($schoolId)
	{
		$students = Students
			::with('user')
			->whereHas('counters', function ($q) {
				$q->where('ORoomsToBeServed', '>', 0);
			})
			->whereDoesntHave('referred', function ($q) {
				$q->whereIn('ReferralTypeId', [1, 2, 3, 16, 19])
					->where('Date', Carbon::today());
			})
			->ofSchoolId($schoolId)
			->get();
		$students->transform(function ($item) {
			return ['Name' => $item->user->Name, 'StudentId' => $item->StudentId];
		});
		dd($students->toJson());
	}

	private function moveLunchDetention($fromDate, $toDate)
	{
		$fromDate = new Carbon($fromDate);
		$toDate = new Carbon($toDate);
		Referrals
			::ofSchoolId(2)
			->ofTypes(Referrals::$lunchReferralType)
			->ofStatus(Referrals::$attendanceNotTakenStatus)
			->where('Date', $fromDate)
			->update(['Date' => $toDate]);


	}

	private function moveAndMarkOSSOverlaps()
	{

	}

	private function miscellaneous2()
	{
		$aspStudents = Studentgroups
			::whereHas('student.user', function ($q) {
				$q->where('SchoolId', 3);
			})
			->get();
		$date = new Carbon('Apr 11 2016');
		$created = 0;
		$fetched = 0;
		foreach ($aspStudents as $student) {
			$att = Aspattendance::firstOrCreate([
				'Date' => $date,
				'StudentId' => $student->StudentId,
				'Attendance' => 1,
				'RotationNumber' => 2
			]);
			if ($att->wasRecentlyCreated) {
				$created++;
			} else {
				$fetched++;

			}
		}
	}

	private function deleteReferralsFromDateToDate($types, $schoolId, $fromDate, $toDate){
		$reteach = Referrals
			::ofSchoolId($schoolId)
			->ofTypes([$types])
			->whereBetween('Date',[$fromDate, $toDate]);
		$reteach->delete();
		$reteach->get();
		dd($reteach->count());
	}

	private function moveReteachFromFollowupToRoster(){
		$reteach = Referrals::ofSchoolId(1)->ofTypes(Referrals::$reteachReferralType)->where('Date',Carbon::yesterday());
		$reteach->update(['RefferalStatus'=>0]);
		$reteachStudentIds = $reteach->get()->unique('StudentId')->pluck('StudentId');

		//dd($reteachStudentIds->toArray());

		$userActions = Useractions::where('ActionDate', Carbon::yesterday())->where('ActionType', 72)->whereIn('ActionToUserId',$reteachStudentIds);
		dd($userActions->get()->toArray());
	}
}
