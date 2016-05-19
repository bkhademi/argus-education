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
use App\Assignments;
use App\Helpers\LunchDetentionHelper;
use App\Helpers\ReteachHelper;

use File;

use App\Helpers\ScheduleHelper;


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
		//$this->updateDunbarReteachSchedules(2,'reteach_dunbar_19_apr_2016.xlsx');
		//$this->updateDunbarReteachSchedules(2,'reteachdunbar5-2-2016.json');


		//$this->createDunbarReteachAttendance('reteachdunbar5-2-2016.json');


		//$this->clearAdrianSchool();

		//$this->moveFromFollowupReteach();

		//$this->checkMissingStudentsFromOroomRosters(1);

		//$this->moveLunchDetention('Apr 04 2016', 'Apr 05 2016');

		//$this->moveAndMarkOSSOverlaps();

		//$this->restoreReferralsFromActivityLog();

		//ReteachHelper::markReteachAttendanceDunbar();
		$filename1 ='StudentScheduleListingDunbar_4-19';
		$filename2 = 'StudentScheduleListing_estacado_4-27';
		$this->testUploadSSL(1, $filename1.'.xlsx');
	}

	private function testUploadSSL($schoolId,$file){
		ScheduleHelper::deleteScheduleInfoFromSchoolId($schoolId);
		$file = storage_path() . '/2016_spring_excel/' . $file;
		\App\Helpers\ScheduleHelper::store($file, $schoolId);
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


	private function clearAdrianSchool()
	{
		$students = Students::with('counters', 'referred', 'user.activitiesAffected')
			->ofSchoolId(4)
			->get();

		foreach ($students as $stu) {
			// reset counters
			$stu->counters->update(['ORoomsToBeServed' => 0, 'ORMReferrals' => 0,
				'LunchDetentionsToBeServed' => 0, 'LDReferrals' => 0, 'ISSDays' => 0,
				'ISSReferrals' => 0, 'OSSReferral' => 0, 'OSSPMP' => 0, 'debt' => 0
			]);
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

	private function deleteReferralsFromDateToDate($types, $schoolId, $fromDate, $toDate)
	{
		$reteach = Referrals
			::ofSchoolId($schoolId)
			->ofTypes([$types])
			->whereBetween('Date', [$fromDate, $toDate]);
		$reteach->delete();
		$reteach->get();
		dd($reteach->count());
	}



	private function copyOldDatabaseAECToNewDatabase()
	{
		//DB::beginTransaction();
		$oldRefs = Referrals
			::on('oldargus')
			->ofSchoolId(2)
			->where('ReferralTypeId', 12)
			->get();

		$refs2 = Referrals
			::where('ReferralTypeId', 12)
			->ofSchoolId(2);


		$i = 0;
		foreach ($oldRefs as $ref) {
			$refId = $ref->Id;
			$referral = Referrals::find($refId);
			if ($referral)
				print_r('referralFound');

			//print_r($ref->toArray());
			$elem = collect($ref->toArray());
			$elem = $elem->except(['Overlap', 'OverlapId', 'OverlapActionId'])->toArray();
			$newDBReferral = Referrals::create($elem);

			//print_r('New Instance '."\n");
			//print_r($ref->toArray());

			//dd('inserted');
			//print_r($ref->Date."     |    ".$ref->ReferralTypeId."\n");
			$i++;
		}

		print_r($oldRefs->count() . "\n");
		print_r($refs2->get()->count() . "\n");
	}

	private function addAssignmentToDatabase()
	{
		$assignments = Assignments
			::on('oldargus')
			->whereHas('teacher', function ($q) {
				$q->where('SchoolId', 2);
			})
			->get();

		foreach ($assignments as $assignment) {
			print_r($assignment->toArray());
			print_r("\n");
			$teacherId = $assignment->TeacherId;
			$professorClassId = Professorclasses::where('UserId', $teacherId)->first()->Id;

			$assign = Assignments::create(['Id' => $assignment->Id, 'Name' => $assignment->Name,
				'ProfessorClassId' => $professorClassId, 'TeacherId' => $teacherId]);
		}

	}

	private function restoreReferralsFromActivityLog()
	{
		//DB::beginTransaction();
		$date = new Carbon('Mar 31 2016');
		$endDate = new Carbon('Apr 26 2016');
		$userId = 'zzTUEkRuPOdHL8sI0CqJl1FbSQNd3QQn9edmboOVjskLxA8Rfo4oiD41go2USKv12mKmGlD1o0jtIFV6ZGPl56bAP5aAOoKixPVLTJtWUa1nTQLlfg8nkO8wUQHGYjTT';

		while ($date->ne($endDate)) {
			//$this->restoreReferralsFromDateFromActivityLog($date, $userId);
			$this->restoreAttendanceFromDateFromActivityLog($date);
			print "\tDate" . $date->toDateString() . "\n";
			$date->addWeekDay();

		}

	}

	private function restoreReferralsFromDateFromActivityLog($date, $userId)
	{
		$actions = Useractions
			::where('ActionDate', $date)
			->where('ActionType', 48)
			->ofSchoolId(2);
		$actions = $actions->get()->load('student');
		foreach ($actions as $item) {
			$assignment = $this->getAssignmentFromActionOrCreate($item);

			$referralContent = [
				'UserId' => $userId,
				'TeacherId' => $item->ActionByUserId,
				'StudentId' => $item->ActionToUserId,
				'AssignmentId' => $assignment->Id,
				'RefferalStatus' => 0,
				'ReferralTypeId' => 12,
				'Date' => $date,
			];
			Referrals::firstOrCreate($referralContent);
		}
	}

	private function restoreAttendanceFromDateFromActivityLog($date)
	{
		$list = Students
			::with(['referred' => function ($q) use ($date) {
				$q->where('Date', $date)
					->where('ReferralTypeId', 12);
			}])
			->ofSchoolId(2)
			->ofTypesAndDate([12],$date)
			->get();
		foreach($list as $student){
			$action = Useractions::where('ActionToUserId',$student->Id)
				->whereBetween('ActionDate',[$date,Carbon::today()])
				->whereIn('ActionType',[49,50,51,52,53,54,55,56,57,58])
				->orderBy('created_at','ASC')
				->first();
			$student->referred[0]->update(['ActivityTypeId'=>$action->ActionType,'RefferalStatus'=>2]);

		}

		;
	}

	private function getAssignmentFromActionOrCreate($action)
	{
		$comment = $action->Comment;
		$assignment = stripos($comment, 'assignment') + 11;
		$comma = strrpos($comment, ',');
		$assignmentLength = $comma - $assignment;
		$assignmentName = substr($comment, $assignment, $assignmentLength);

		$professorClassId = Professorclasses::where('UserId', $action->ActionByUserId)->first()->Id;

		$assignment = Assignments::firstOrCreate(['Name' => $assignmentName, 'ProfessorClassId' => $professorClassId, 'TeacherId' => $action->ActionByUserId]);
		if ($assignment->wasRecentlyCreated)
			print_r('Created ' . $assignmentName . "\n");

		return $assignment;


	}
}
