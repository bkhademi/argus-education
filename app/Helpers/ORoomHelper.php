<?php
/**
 * Created by PhpStorm.
 * User: tomoboy-air
 * Date: 5/3/2016
 * Time: 3:23 AM
 */

namespace App\Helpers;

use App\Students;
use App\Referrals;
use App\Oroomactivity;
use Carbon\Carbon;


class ORoomHelper
{
	public static function checkMissingStudentsFromOroomRosters($schoolId, $date)
	{
		$students = Students
			::with('user')
			->with(['referred'=>function($q){
				$q
					->ofTypes(array_merge(Referrals::$oroomReferralTypes,Referrals::$issReferralTypes))
					->where('Date',Carbon::yesterday())
					;
			}])
			->whereHas('counters', function ($q) {
				$q->where('ORoomsToBeServed', '>', 0);
			})
			->whereDoesntHave('referred', function ($q) use ($date) {
				$q->whereIn('ReferralTypeId', [1, 2, 3, 16, 19])
					->where('Date', $date);
			})
			->ofSchoolId($schoolId)
			->get();
		foreach($students as $student){
			$ormTypes = collect(Referrals::$oroomReferralTypes);
			$orms = $student->referred->filter(function($item)use ($ormTypes){
				return $ormTypes->contains($item->ReferralTypeId);
			});
			$yesterdayORM = $orms->where('RefferalStatus',1)->first();
			$student['yesterdayORM'] = $yesterdayORM;

			$issTypes = collect(Referrals::$issReferralTypes);
			$isss = $student->referred->filter(function($item)use ($issTypes){
				return $issTypes->contains($item->ReferralTypeId);
			})->first();

			$student['yesterdayISS'] = $isss;

		}
//		$students->transform(function ($item) {
//			return ['Name' => $item->user->Name, 'StudentId' => $item->StudentId];
//		});
		return $students;
	}


	/*
	 * Get the orm list from a given school from a given date
	 *
	 * @param  integer 			$schoolId
	 * @param  Carbon\Carbon  	$date
	 * #@param array 			$periods list of periods as integer eg. period 1 = [1]
	 * @return Collection       list of students with their referrals
	 */
	public static function getORMList($schoolId,$date, $periods){
		$list = Students::with('counters','user')
			->with(['referred'=>function($q)use($date){
				$q->notOfTypes(Referrals::$lunchReferralType)
					->where('Date',$date)
					->with('user','teacher','referralType','assignment','activity','consequence.referralType')
					->sortByPriority();
			}])
			->withPeriodRoomsWherePeriodsIn($periods)
			->ofSchoolId($schoolId)
			->ofTypesAndDate(Referrals::$oroomReferralTypes, $date)
			->sortByLastName()
			->get()
			;
		return $list;
	}


	/*
	 * Get list of Oroom during the day (students sent out during class time)
	 *
	 * @param Integer 		$schoolId
	 * @param Carbon\Carbon $date
	 * return Collection 	Oroom Activity List(ORM during day)
	 */
	public static function getOroomDuringDayList($schoolId,$date){
		$list = Oroomactivity::with('student.student.counters','teacher','period','activity')
			->where('Date',$date)
			->ofSchoolId($schoolId)
			->orderBy('Id','DESC')// newest to oldest
			->get();
		return $list;
	}
}