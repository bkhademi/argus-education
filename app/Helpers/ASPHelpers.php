<?php
/**
 * Created by PhpStorm.
 * User: tomoboy-air
 * Date: 5/3/2016
 * Time: 2:20 AM
 */

namespace App\Helpers;

use App\Studentgroups;
use App\Schools;
use App\Aspattendance;
use Carbon\Carbon;

class ASPHelpers
{


	public static function createASPAttendancesForAWeek($schoolIds, $date)
	{
		$results = [];
		foreach ($schoolIds as $schoolId) {
			$loopDate = $date->copy();
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
				$results[]=static::createAttendanceForADate($loopDate, $aspStudents, $rotations, $schoolName);
				$loopDate->addWeekDay();
				$days++;
			} while ($days < 5);
		}
		return $results;
	}

	public static function createAttendanceForADate($date, $students, $rotations, $schoolName)
	{
		$info = new AttendanceInformation($schoolName,$date->toDateString());
		foreach ($rotations as $rotation) {
			foreach ($students as $student) {
				$att = Aspattendance::firstOrCreate([
					'Date' => $date,
					'StudentId' => $student->StudentId,
					'Attendance' => 1,
					'RotationNumber' => $rotation
				]);
				if ($att->wasRecentlyCreated)
					$info->created++;
				else
					$info->fetched++;

			}
		}
		return $info;

//		echo "           $schoolName     $date         \n";
//		echo "created =  $created \n";
//		echo "fetched = $fetched \n";
//		echo "\n";
	}

	public static function getStudentsFromSchoolId($schoolId){
		$aspStudents = Studentgroups
			::whereHas('student.user', function ($q) use ($schoolId) {
				$q->where('SchoolId', $schoolId);
			})
			->get();
		return $aspStudents;
	}

}

class AttendanceInformation{
	public $school;
	public $fetched;
	public $created;
	public $date;

	public function __construct($school,$date){
		$this->school = $school;
		$this->date = $date;
		$this->fetched = 0;
		$this->created = 0;

	}
}