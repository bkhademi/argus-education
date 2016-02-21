<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
// use Request;
// use App\Http\Requests;
use App\Http\Controllers\Controller;
use mikehaertl\pdftk\Pdf;
use mikehaertl\pdftk\FdfFile;
use Carbon\Carbon;
use App\Referrals;
use App\Students;
use App\Useractions;
use App\ClassStudents;
use App\Professorclasses;
use App\User;
use App\Assignments;

class PrintPassesController extends Controller {

	/**
	 * Display a listing of the resource.
	 *
	 * @return \Illuminate\Http\Response
	 */
	public function index() {
		//
		$userId = Request::header('UserID');
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

		// $dataIn = $request->input('data');
		$schoolId = $this->user->SchoolId;
		// error_log(print_R($request,TRUE) );
		//$referrals = Referrals::with('studentUser.student','user', 'assignment')
		//	->where('Date', Carbon::today())
		//	->where('RefferalStatus',0)
		//	->get();
		$schoolId = $this->user->SchoolId;
		$template = '';
		if ($schoolId === 1) {
			$template = 'PassV4.pdf';
		} else if ($schoolId === 2) {
			$template = 'PassV4Dunbar.pdf';
		} else {
			$template = 'PassV4.pdf';
		}

		if ($request->param === "AECList") {
			$referrals = User::
				with(['referred' => function($query) {
						$query
						->where('Date', Carbon::today())
						->where('ReferralTypeId', 1)
						->where('RefferalStatus', 0)
						;
					}], 'student')
				->whereHas('referred', function($query) {
					$query
					->where('Date', Carbon::today())
					->where('ReferralTypeId', 1)
					->where('RefferalStatus', 0)
					;
				})
				->where('SchoolId', $schoolId)
				->get();
		} else if ($request->param === 'ReteachLabels') {
			$referrals = User::
				with(['referred' => function($query) {
						$query
						->where('Date', Carbon::today())
						->where('ReferralTypeId', 18)
						->where('RefferalStatus', 0)
						;
					}])
				->with('student', 'student.classes.professor_class.room')
				->whereHas('referred', function($query) {
					$query
					->where('Date', Carbon::today())
					->where('ReferralTypeId', 18)
					->where('RefferalStatus', 0)
					;
				})
				->where('SchoolId', $schoolId)
				//->orderBy('student.Grade', 'ASC')
				->get();

			$command = 'pdftk ';
			$files = 'rm ';
			$i = 0; //  pages
			$k = 1; //fields
			$j = 1; // pages
			$fields = [];
			for (; $i < count($referrals); $i++, $k++) {
				$obj = $referrals[$i];
				$pdf = new Pdf('LabelTemplateEachSmall.pdf');
				$goto = $obj->student['classes'][count($obj->student['classes']) - 1]['professor_class']['room']['Name'];
				$deliverTo = isset($obj->student['classes'][8]) ? $obj->student['classes'][8]['professor_class']['room']['Name'] : 'N/A';
				$name = $obj->FirstName . ',  ' . $obj->LastName;
				$id = $obj->UserName;
				$pdf->fillForm(['Name' => $name, 'Grade' => $obj->student->Grade, 'GoTo' => $goto, 'DeliverTo' => $deliverTo])
					->flatten()
					->saveAs($i . ".pdf");
				$command .= $i . '.pdf ';
				$files .= $i . '.pdf ';
			}


//			for (; $i < count($referrals); $i++, $k++) {
//				$obj = $referrals[$i];
//				if (!($i % 14))
//					$pdf = new Pdf('LabelTemplatePageV3.pdf');
//				$name = $obj->FirstName . ',  ' . $obj->LastName;
//				$id = $obj->UserName;
//				
//				$goto = $obj->student['classes'][count($obj->student['classes'])-1]['professor_class']['room']['Name'];
//				
//				$deliverTo = isset($obj->student['classes'][8])? $obj->student['classes'][8]['professor_class']['room']['Name']: 'N/A';
//				$fields['name'.$k ] = $name;
//				//$fields['id'.($k + 1)] = $id;
//				$fields['goto'.$k] = $goto;
//				$fields['deliverto'.$k] = $deliverTo;
//				$fields['grade'.$k ] = $obj->student->Grade;
//				if ( !(($i+1) %14) ){
//					$pdf->fillForm($fields)->flatten()
//						->saveAs($j . ".pdf");
//					$command .= $j . '.pdf ';
//					$files .= $j . '.pdf ';
//					$j++;
//					$k=0 ;
//					$fields = [];
//				}
//			}
//			if ($j == 1) { //  didnt fill a whole page 
//				$pdf->fillForm($fields)->flatten()
//					->saveAs($j . ".pdf");
//				$command .= $j . '.pdf ';
//				$files .= $j . '.pdf ';
//				$j++;
//			}
			$command .= "cat output labels.pdf";
			exec($command);

			$labels = new Pdf('labels.pdf');
			$labels->send();

			$files.="labels.pdf ";
			exec($files);


			return $files;
		} else {
			$referrals = User::with(['referred' => function($query) {
						$query->where('Date', Carbon::today());
					}], 'student')->whereHas('referred', function($query) {
					$query->where('RefferalStatus', 4);
				})->get();
		}

		// $command =  "pdfjam "; 
		$command = "pdftk ";
		$files = "rm ";

		//Iterate though the whole array making the files
		for ($i = 0; $i < count($referrals); $i++) {
			$obj = $referrals[$i]->toArray();
			$pdf = new Pdf($template);
			$schedule = Classstudents::with('professor_class.period', 'professor_class.room')
					->where('StudentId', $obj['id'])
					->whereHas('professor_class.classs', function($q) {
						$q->where('Term', 'S2');
					})->get();
			$schedule1 = '';
			$schedule2 = '';
			$k = 0;
			forEach ($schedule as $class) {
				$schedule1 .= "Per " . ($k + 1) . ":   " . $class->professor_class['room']['Name'] . ' |';
				$k++;
			}
			$classes = explode('|', $schedule1);
			$schedule1 = '';
			for ($j = 0; $j < $k; $j++) {
				if ($j < ($k / 2)) {
					$schedule1 .= $classes[$j] . ' |';
				} else {
					$schedule2 .= $classes[$j] . ' |';
				}
			}

			$pdf->fillForm(array('Student Name' => $obj['FirstName'] . ', ' . $obj['LastName']
					, 'AECReferrals' => count($obj['referred']), 'Now' => Carbon::now()->toFormattedDateString(),
					'RefDate' => Carbon::now()->toFormattedDateString(),
					'Schedule1' => $schedule1, 'Schedule2' => $schedule2))
				->flatten()
				->saveAs($i . ".pdf");

			//Cponcatenating for the cat and rm command
			$command .= $i . ".pdf ";
			$files .= $i . ".pdf ";
		}

		// $command .= "--nup 2x1 --landscape --outfile passes.pdf";

		$command .= "cat output passes.pdf";
		exec($command);

		$passes = new Pdf('passes.pdf');
		$passes->send();

		$files.="passes.pdf ";
		exec($files);

		$filledFile = new Pdf('PassV3Filled.pdf');
		$data = $filledFile->getDataFields();

		return $files;
	}

	/**
	 * Display the specified resource.
	 *
	 * @param  int  $id
	 * @return \Illuminate\Http\Response
	 */
	public function show($id) {
		//
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
		//
	}

	/**
	 * Remove the specified resource from storage.
	 *
	 * @param  int  $id
	 * @return \Illuminate\Http\Response
	 */
	public function destroy($id) {
		//
	}

}
