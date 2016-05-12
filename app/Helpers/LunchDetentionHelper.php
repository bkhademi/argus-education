<?php
/**
 * Created by PhpStorm.
 * User: tomoboy-air
 * Date: 5/3/2016
 * Time: 3:31 AM
 */

namespace App\Helpers;

use App\Referrals;
use App\Students;

class LunchDetentionHelper
{

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


	public static function roster($schoolId, $date){
		$lunchStudents = Students
			::ofSchoolId($schoolId)
			->ofTypesAndDate(Referrals::$lunchReferralType,$date)
			->sortByUserProperty('LastName','ASC');
	}

	public static function markAllPresentForDate($schoolId,$date){
		$list = Referrals::where('Date',$date)
			->ofSchoolId($schoolId)
			->ofTypes(Referrals::$lunchReferralType)
			->get();
		;

		$lunchController = new \App\Http\Controllers\LunchDetentionController();
		dd($lunchController);
	}

	public static function markAttendance($referralId,$actionType,$comment,$studentId,$date){

	}
}