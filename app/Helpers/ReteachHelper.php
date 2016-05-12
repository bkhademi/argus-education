<?php
/**
 * Created by PhpStorm.
 * User: tomoboy-air
 * Date: 5/3/2016
 * Time: 3:20 AM
 */

namespace App\Helpers;

use App\Referrals;
use Carbon\Carbon;

class ReteachHelper
{

	private function updateDunbarReteachSchedules($schoolId, $fileName)
	{
//		$file = storage_path() . '/2016_spring_excel/' . $fileName;
//		\App\Helpers\ScheduleHelper::updateReteachPeriodsForSchool($file,$schoolId);
//
//			return 1;

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


	public static function markReteachAttendanceDunbar()
	{
		$date = new Carbon('Apr 20 2016');
		while ($date->ne(Carbon::today())) {
			$query = Referrals
				::ofSchoolId(2)
				->ofTypes(Referrals::$reteachReferralType)
				->ofStatus(0)
				->where('Date', $date);
			static::markAllPresent($query);
			static::markSomeAbsent($query);
			//static::commitAttendanceToStudentProfiles($query);
			print_r('   for Date' . $date->toDateString() . "\n");
			$date->addWeekDay();

		}
	}

	private static function markAllPresent($query)
	{
		$query->update(['ActivityTypeId' => 64]);
		print_r('count = ' . $query->get()->count());
	}

	private static function markSomeAbsent($query)
	{
		$students = $query->get();
		$absentNo = rand(0, $students->count() * .14);
		while ($absentNo--) {
			$index = rand(0, $students->count() - 1);
			$students[$index]->update(['ActivityTypeId' => 69]);
		}
	}

	private static function commitAttendanceToStudentProfiles($query)
	{

	}

	public static function moveReteachFromFollowupToRoster()
	{
		$reteach = Referrals::ofSchoolId(1)->ofTypes(Referrals::$reteachReferralType)->where('Date', Carbon::yesterday());
		$reteach->update(['RefferalStatus' => 0]);
		$reteachStudentIds = $reteach->get()->unique('StudentId')->pluck('StudentId');

		//dd($reteachStudentIds->toArray());

		$userActions = Useractions::where('ActionDate', Carbon::yesterday())->where('ActionType', 72)->whereIn('ActionToUserId', $reteachStudentIds);
		dd($userActions->get()->toArray());
	}

}