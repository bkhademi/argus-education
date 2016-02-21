<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Studentgroups;
use App\Students;
use DB;
use Carbon\Carbon;
use App\Aspattendance;

class TestTasksController extends Controller {

	// only for dunbar
	public function aspDunbar(Request $request) {

		$schoolId = 2;
		$unmatch = [];
		$created = 0;
		$fetched = 0;
		$i = 0;
		foreach ($request->data as $stu) {
			$student = Students::where('StudentId', $stu['ID'])->first();
			if (!$student) {
				$unmatch[$i++] = $stu;
				continue;
			}
			// check is already part of the attendance 			
			$studentgroup = Studentgroups::firstOrcreate(['StudentId' => $student->Id, 'GroupId' => 0]);

			if ($studentgroup->wasRecentlyCreated) {
				$created++;
			} else {
				$fetched++;
			}

			$date = Carbon::Today();
			$aspattendance = Aspattendance::firstOrCreate([
					'Date' => $date,
					'StudentId' => $student->Id,
					'Attendance' => 1,
					'RotationNUmber' => 0]);
		}
		$msg = "All students EXCEPT the showing below were added to asp List";
		return compact('unmatch', 'msg', 'fetched', 'created');
	}

	public function aspEstacado(Request $request) {
//		$yesterday = Carbon::yesterday();
//		$iss = \App\Students::with(['referred' => function($q)use($yesterday) {
//						$q->whereNotIn('ReferralTypeId', [12, 18])
//						->where('RefferalStatus', 0)
//						->where('Date', $yesterday)
//						;
//					}])
//					->whereHas('referred', function($q)use($yesterday) {
//						$q->where('Date', $yesterday)
//						//->orWhere('Date',Carbon::today()->subWeekDays(2))
//						;
//					})
//					->whereHas('counters', function($q) {
//						$q->where('ISSDays', '>', 0);
//					})->get()
//
//			;
//			// move all yesterday referrals for students with iss for today
//			// this includes all orm, and other iss referrals 
//			foreach ($iss as $stu) {
//				foreach ($stu->referred as $ref) {
//					$ref->update(['Date' => Carbon::today()]);
//				}
//			}

		$dunbarSchoolId = 2;
		\App\Referrals
			::where('Date', Carbon::yesterday())
			->where('ReferralTypeId', 9)
			->where('RefferalStatus', 0)
			->whereHas('studentUser', function($q)use($dunbarSchoolId) {
				$q->where('SchoolId', $dunbarSchoolId);
			})->update(['Date', Carbon::today()])
		;
	}

	public function commitAECAttendance(Request $request) {
		return 1;
	}

	public function commitReteachAttendance(Request $request) {
		return 2;
	}

	public function submitAECAttendance(Request $request) {
		return 3;
	}

	public function submitReteachAttendance(Request $request) {
		return 4;
	}

	public function report(Request $request) {
		$actions = \App\Useractions::where('ActionType', '1')
			->whereHas('student', function($q) {
			$q->where('SchoolId', 1);
		})
		;
		return $actions->get();
	}

}
