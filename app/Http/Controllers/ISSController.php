<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Issactivity;
use App\Referrals;
use App\Useractions;
use App\Counters;
use App\Students;
use App\Activities;
use Carbon\Carbon;
use App\User;
use Excel;

class ISSController extends Controller {

	/**
	 * Display a listing of the resource.
	 *
	 * @return \Illuminate\Http\Response
	 */
	public function index(Request $request) {
		//

		$schoolId = $this->user->SchoolId;


		$date = $request->has('Date') ? $request->Date : Carbon::today();

		if ($request->has('followup')) {



			$iss = Referrals::with('user', 'studentUser.student.counters', 'studentUser.student.classes.professor_class.room', 'teacher', 'referralType', 'activity')
//			->where('Date', $date)
				->wherehas('studentUser', function($q)use($schoolId) {
					$q->where('SchoolId', $schoolId);
				})
				->wherehas('referralType', function($q) {
					$q->where('ReferralTypeId', 15);
				})
				->where('RefferalStatus', 0)
				->get();
		} else {
//			$iss = Referrals::with('user', 'studentUser.student.counters', 'studentUser.student.classes.professor_class.room', 'teacher', 'referralType', 'activity')
////			->where('Date', $date)
//				->wherehas('studentUser', function($q)use($schoolId) {
//					$q->where('SchoolId', $schoolId);
//				})
//				->wherehas('referralType', function($q) {
//					$q->whereIn('ReferralTypeId', [5, 6, 7, 10, 17]);
//				})
//				->where('Date', $date)
//				->where('RefferalStatus', 0)
//				->get();


			$iss = Students
				::with('counters', 'user', 'classes.professor_class.classs', 'classes.professor_class.room')
				->with(['referred' => function($q)use($date) {
						$q->where('RefferalStatus', 0)
						->where('Date', $date)
						->whereNotIn('ReferralTypeId', [9])// dont load lunch
						->with('teacher', 'activity', 'referralType')
						->join('referraltypes', 'referraltypes.id', '=', 'ReferralTypeId')
						->orderBy('Priority', 'ASC')
						->select('refferals.*')

						;
					}])
					->wherehas('user', function($q)use($schoolId) { // from the school the user requested
						$q->where('SchoolId', $schoolId);
					})
					->whereHas('counters', function($q) {
						$q->where('ISSDays', '>', 0);
					})
					->whereHas('referred', function($q)use($date) {
						$q
						->where('refferals.RefferalStatus', 0)
						->whereIn('ReferralTypeId', [7, 5, 6, 17, 10])
						->where('Date', $date)
						;
					})
					->join('aspnetusers', 'aspnetusers.id', '=', 'students.Id')
					->orderBy('LastName', 'ASC')
					->select('students.*')
					->get();
			}
			if ($request->has('count'))
				return ['count' => count($iss)];
			return $iss;
		}

		/**
		 * Show the form for creating a new resource.
		 *
		 * @return \Illuminate\Http\Response
		 */
		public function create() {
			//
		}

		/**
		 * Store a newly created resource in storage.
		 *
		 * @param  \Illuminate\Http\Request  $request
		 * @return \Illuminate\Http\Response
		 */
		public function store(Request $request) {
			$date = $this->getDate($request);
			// action type = 20,21
			// referralType = 5,10
			// find iss referrals that might already be scheduled for the requested day
			$student = User::find($request->StudentId);

			$msg = $student->FirstName . ', ' . $student->LastName . ' Was referred ISS ';

			$useraction = Useractions::create([
					'ActionDate' => $date,
					'ActionByUserId' => $this->userId,
					'ActionType' => $request->ActionType,
					'ActionToUserId' => $request->StudentId,
					'Comment' => $request->Comment]);

			$referral = Referrals::create([
					'UserId' => $this->userId,
					'StudentId' => $request->StudentId,
					'TeacherId' => 0,
					'ReferralTypeId' => $request->ReferralTypeId,
					'Date' => $date]);

			$counters = Counters::find($request->StudentId);
			$counters->increment('ISSDays');
			$counters->increment('ISSReferrals');

			return compact('msg');
		}

		/**
		 * Display the specified resource.
		 *
		 * @param  int  $id
		 * @return \Illuminate\Http\Response
		 */
		public function show($id) {

			$yesterday = Carbon::today()->subWeekDay();
			
			$iss = \App\Students::with(['referred' => function($q)use($yesterday) {
						$q->whereNotIn('ReferralTypeId',[12, 18])
						->where('RefferalStatus',0)
						->whereBetween('Date',[ Carbon::today()->subWeekDays(2),$yesterday ])
						;
					}])
					->whereHas('referred',function($q)use($yesterday){
						$q->whereBetween('Date',[Carbon::today()->subWeekDays(2),$yesterday])
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
			return ['ok'];
			/* AEC */
			$date = new Carbon('Feb 1 2016');
			$schoolId = 2; // estacado
			$aecCounters = [
				'Assign' => 0,
				'present' => 0,
				'reschedule' => 0,
				'clear' => 0,
				'noshow' => 0,
				'leftschool' => 0,
				'schoolabsent' => 0,
				'sentout' => 0,
				'walkedout' => 0,
				'other' => 0,
				'absent' => 0,
			];
			$DateCounters = [];
			for ($i = 0; $i < 14; $i++) {
				$currentAssigned = Useractions::
					where('ActionDate', $date)
					->whereHas('student', function($q)use ($schoolId) {
						$q->where('SchoolId', $schoolId);
					})
					->whereIn('ActionType', [48, 60])
					->get()
				;
				$dateUserActions = Useractions::
					where('ActionDate', $date)
					->whereHas('student', function($q)use ($schoolId) {
						$q->where('SchoolId', $schoolId);
					})
					->whereIn('ActionType', [ 49, 51, 52, 53, 54, 55, 56, 57, 58])
					->get()
				;
				$actions = [];

				$aecCounters['Assign'] = count($currentAssigned->toArray());
				foreach ($currentAssigned as $ass) {

					$uact = Useractions::
						where('ActionDate', $date)
						->whereHas('student', function($q)use ($ass) {
							$q->where('Id', $ass->ActionToUserId);
						})
						->whereIn('ActionType', [49, 50, 55, 56, 57])
						->first()
					;
					$uactoffset = Useractions::
						where('ActionDate', (new Carbon($date))->addWeekDay())
						->whereHas('student', function($q)use ($ass) {
							$q->where('Id', $ass->ActionToUserId);
						})
						->whereIn('ActionType', [ 51, 52, 53, 54, 57, 58])
						->first()
					;
					if (!$uact)
						goto next;

					switch ($uact->ActionType) {

						case 49:
							$aecCounters['present'] ++;
							break;
						case 50:
							$aecCounters['reschedule'] ++;
							break;
						case 55:
							$aecCounters['sentout'] ++;
							break;
						case 56:
							$aecCounters['walkedout'] ++;
							break;
						case 57:
							$aecCounters['other'] ++;
							break;
						
					}
next:				
					if(!$uactoffset)
						continue;
					switch ($uactoffset->ActionType) {
						case 51:
							$aecCounters['clear'] ++;
							break;
						case 52:
							$aecCounters['noshow'] ++;
							break;
						case 53:
							$aecCounters['leftschool'] ++;
							break;
						case 54:
							$aecCounters['schoolabsent'] ++;
							break;
						case 57:
							$aecCounters['sentout'] ++;
							break;
						case 58:
							$aecCounters['walkedout'] ++;
							break;
					}
				}

				$DateCounters[$date->toDateString()] = $aecCounters;

				$aecCounters = [
					'Assign' => 0,
					'present' => 0,
					'reschedule' => 0,
					'clear' => 0,
					'noshow' => 0,
					'leftschool' => 0,
					'schoolabsent' => 0,
					'sentout' => 0,
					'walkedout' => 0,
					'other' => 0,
					'absent' => 0,
				];

				$date = $date->addDay();
			}

			return $DateCounters;
//			Excel::create('AECEstacado', function($excel)use($DateCounters) {
//
//				$excel->sheet('Sheet1', function($sheet)use($DateCounters) {
//
//					$sheet->fromArray($DateCounters);
//				});
//			})->download('csv');
		}

		/**
		 * Show the form for editing the specified resource.
		 *
		 * @param  int  $id
		 * @return \Illuminate\Http\Response
		 */
		public function edit($id) {
			//
		}

		/**
		 * Update the specified resource in storage.
		 *
		 * @param  \Illuminate\Http\Request  $request
		 * @param  int  $id
		 * @return \Illuminate\Http\Response
		 */
		public function update(Request $request, $id) {
			$schoolId = $this->user->SchoolId;

			$date = $request->has('Date') ? new Carbon($request->date) : Carbon::today();

			//
			if ($request->has('attendance')) {
				$referral = Referrals::find($id)->Update(['ActivityTypeId' => $request->ActivityTypeId]);
				return response('successfully Modified iss attendance', 200);
			} else if ($request->has('followup')) {
				$msg = 'Student Was scheduled for Parent meeting on ' . $request->Date .
					', at ' . $request->Time;
				// schedule OSS for given  day.
				$referral = Referrals::find($id);
				$counters = Counters::find($request->StudentId);
				$useraction = Useractions::create([
						'ActionDate' => $date,
						'ActionByUserId' => $this->userId,
						'ActionType' => $request->ActionType,
						'ActionToUserId' => $referral->StudentId,
						'Comment' => $request->Comment
				]);
				$counters->increment('OSSPMP');
				$counters->increment('Cycles');
				$referralOSS = Referrals::create([
						'UserId' => $this->userId,
						'StudentId' => $referral->StudentId,
						'TeacherId' => $referral->TeacherId,
						'ReferralTypeId' => 11,
						'Date' => $date,
						'Time' => $request->Time
				]);

				$referral->update(['Date' => $date->addWeekDay(2), 'ReferralTypeId' => 10]);
			} else {

				$today = Carbon::today();
				$tomorrow = Carbon::today()->addWeekDay();


				$activity = Activities::find($request->ActionType);
				$referral = Referrals::find($id);
				$counters = Counters::find($referral->StudentId);
				$useraction = Useractions::create([
						'ActionDate' => $date,
						'ActionByUserId' => $this->userId,
						'ActionType' => $request->ActionType,
						'ActionToUserId' => $referral->StudentId,
						'Comment' => $request->Comment
				]);


				// present for iss
				if ($request->ActionType == 38) {
					$msg = 'Student Was Present, Decreasing ISSDays ';
					$pendingReferrals = Referrals  // move other today's referrals for tomorrow
						::where('Date', $today)
						->where('RefferalStatus', 0)// pending
						->whereNotIn('ReferralTypeId', [12, 18]) // dont move reteach and aec
						->where('StudentId', $referral->StudentId)
						->update(['Date' => $today]);
					$referral->update(['RefferalStatus' => 1, 'ActivityTypeId' => $request->ActionType]);
					$counters->decrement('ISSDays');
				}
				// ditched iss,  only move to ISS followup
				else if ($request->ActionType == 39 || $request->ActionType == 42 || $request->ActionType == 43) {
					$msg = 'Student Ditched ISS, Moving to ISS Followup';
					$pendingReferrals = Referrals  // move other today's referrals for tomorrow
						::where('Date', $today)
						->where('RefferalStatus', 0)// pending
						->whereNotIn('ReferralTypeId', [12, 18]) // dont move reteach and aec
						->where('StudentId', $referral->StudentId)
						->update(['Date' => $today]);
					$counters->increment('OSSReferral');

					$useraction->update(['Comment' => $useraction->Comment . '[Student Ditched ISS, Moving to ISS Followup List(System)]']);
					$referral->update(['ReferralTypeId' => 15]);
				} else {// left School, school absent, other
					$msg = 'Rescheduled For Tomorrow';
					$pendingReferrals = Referrals  // move all today's referrals for tomorrow
						::where('Date', $today)
						->where('RefferalStatus', 0)// pending
						->whereNotIn('ReferralTypeId', [12, 18])
						->where('StudentId', $referral->StudentId)
						->update(['Date' => $today]);
					$useraction->update(['Comment' => $useraction->Comment . '[Rescheduling For Next Day(System)]']);
				}
			}
			return compact('msg');
		}

		/**
		 * Remove the specified resource from storage.
		 *
		 * @param  int  $id
		 * @return \Illuminate\Http\Response
		 */
		public function destroy($id) {
			//
			$deleted = Referrals::find($id)->destroy();


			return compact('deleted');
		}

	}
	