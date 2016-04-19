<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Referrals;
use App\Useractions;
use Carbon\Carbon;
use App\Students;
use PDF;

class ReportsController extends Controller
{
	private $loadForReport = ['activity', 'consequence.referralType', 'referralType'];

	public function EODoroom(Request $request)
	{
		$date = $this->getDate($request);
		$schoolId = $this->user->SchoolId;
		$includeRefTypes = array_merge(Referrals::$oroomReferralTypes, Referrals::$issReferralTypes, Referrals::$ossReferralType, Referrals::$aecReferralType, Referrals::$reteachReferralType);
		$excludeRefTypes = array_merge(Referrals::$lunchReferralType);
		$wantRefTypes = Referrals::$oroomReferralTypes;
		$wantRange = $request->has('DateRange');
		$endDate = $wantRange? new Carbon($request->DateEnd):null;

		return $this->getReportReferrals($date,$wantRefTypes ,null, $excludeRefTypes, $schoolId,true,$wantRange,$endDate );

	}

	public function EODlunchD(Request $request)
	{
		$date = $this->getDate($request);
		$schoolId = $this->user->SchoolId;
		$includeRefTypes = array_merge(Referrals::$lunchReferralType, Referrals::$issReferralTypes, Referrals::$ossReferralType);
		$excludeRefTypes = array_merge(Referrals::$oroomReferralTypes, Referrals::$aecReferralType, Referrals::$reteachReferralType);
		$wantRefTypes = Referrals::$lunchReferralType;
		$wantRange = $request->has('DateRange');
		$endDate = $wantRange? new Carbon($request->DateEnd):null;

		return $this->getReportReferrals($date,$wantRefTypes ,null, $excludeRefTypes, $schoolId,true,$wantRange,$endDate );
	}

	public function EODiss(Request $request)
	{
		$date = $this->getDate($request);
		$schoolId = $this->user->SchoolId;
		$includeRefTypes = array_merge(Referrals::$issReferralTypes, Referrals::$reteachReferralType, Referrals::$aecReferralType);
		$excludeRefTypes = Referrals::$lunchReferralType;
		$wantRefTypes = Referrals::$issReferralTypes;
		$wantRange = $request->has('DateRange');
		$endDate = $wantRange? new Carbon($request->DateEnd):null;

		return $this->getReportReferrals($date,$wantRefTypes ,null, $excludeRefTypes, $schoolId,true,$wantRange,$endDate );
	}

	public function EODAEC(Request $request)
	{
		$date = $this->getDate($request);
		$schoolId = $this->user->SchoolId;
		$excludeRefTypes = array_merge(Referrals::$lunchReferralType);
		$wantRefTypes = Referrals::$aecReferralType;
		$wantRange = $request->has('DateRange');
		$endDate = $wantRange? new Carbon($request->DateEnd):null;


		return $this->getReportReferrals($date,$wantRefTypes ,null, $excludeRefTypes, $schoolId,true,$wantRange,$endDate );
	}

	public function EODReteach(Request $request)
	{
		$date = $this->getDate($request);
		$schoolId = $this->user->SchoolId;
		$excludeRefTypes = Referrals::$lunchReferralType;
		$wantRefTypes = Referrals::$reteachReferralType;
		$wantRange = $request->has('DateRange');
		$endDate = $wantRange? new Carbon($request->DateEnd):null;

		return $this->getReportReferrals($date,$wantRefTypes ,null, $excludeRefTypes, $schoolId,true,$wantRange,$endDate );
	}

	public function EODasp(Request $request)
	{
		$date = $this->getDate($request);
		$schoolId = $this->user->SchoolId;
	}

	public function EODoss(Request $request)
	{
		$date = $this->getDate($request);
		$schoolId = $this->user->SchoolId;
		$oss = Referrals
			::with('studentUser', 'referralType', 'activity', 'consequence.referralType')
			->ofSchoolId($schoolId)
			->whereIn('ReferralTypeId', Referrals::$ossReferralType)
			->where('newDate', $date)
			->sortByUserProperty('LastName', 'ASC')
			->get();
		return $oss;
	}

	public function oroomActivity(Request $request)
	{
		$schoolId = 2;
		$ormacts = Oroomactivity
			::with('student','teacher','period','activity')
			->whereHas('student',function($q)use($schoolId){
				$q->where('SchoolId',$schoolId);
			})
			->orderBy('Date','ASC')
			->get()
		;
		if($request->has('excel')) {
			Excel::create('Filename', function ($excel) use ($ormacts) {
				$excel->sheet('OroomDuringDay', function ($sheet) use ($ormacts) {
					$sheet->row(1, ['Date', 'Sent Out By', 'Student Name', 'StudentID', 'ReferralIn']);
					foreach ($ormacts as $ref) {
						$row = [];
						$row[] = $ref->Date;
						$row[] = $ref->teacher->FirstName . ', ' . $ref->teacher->LastName;
						$row[] = $ref->student->FirstName . ', ' . $ref->student->LastName;
						$row[] = $ref->student->UserName;
						$row[] = $ref->ReferralIn;
						$sheet->appendRow($row);
					}
				});
			})->download('xlsx');
		}else
			return $ormacts;
	}


	public function getReferralsFromDateForReport($date,$ofTypes, $includeRefTypes, $excludeRefTypes, $schoolId,$sort)
	{
		return Students
			::with('user')
			->withReferralsFromDateWithAndWithout($date, $includeRefTypes, $excludeRefTypes, $this->loadForReport,$sort)
			->ofSchoolId($schoolId)
			->ofTypesAndDate($ofTypes, $date)
			->sortByUserProperty('LastName', 'ASC')
			->get();
	}

	public function getReportReferrals($date, $ofTypes, $includeTypes, $excludeRefTypes,$schoolId,$sort, $range, $endDate){

		if(!$range){
			return $this->getReferralsFromDateForReport($date,$ofTypes, $includeTypes, $excludeRefTypes, $schoolId,$sort);

		}else{

			$list = [];
			$endDate->addWeekDay();
			do {

				$list[] = ['Date'=>$date->toDateString(),
					'students'=>$this->getReferralsFromDateForReport($date,$ofTypes, null, $excludeRefTypes, $schoolId,true)];

				$date->addWeekDay();
			}while($date->ne($endDate));

		}

		return $list;
	}

	public function printHtml(Request $request){
		$css = 'css/print.css';
		$pdf = PDF::loadHTML(
			'<html><!DOCTYPE html><html><head><link href="'.$css.'" rel="stylesheet"> </head><body>'
			.'<div class="header">'
			.$request->head
			.'</div>'
			.'<div class="footer">'
			.$request->footer
			.'</div>'
			.'<div class="content">'
			.$request->totals
			.$request->list
			.'</div>'
			. '</body></html>')
			->setPaper('letter');

		return $pdf->stream('report.pdf');
	}
}
