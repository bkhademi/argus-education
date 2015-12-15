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



class PrintPassesController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
        $userId = Request::header('UserID');

    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
		
        // $dataIn = $request->input('data');

        // error_log(print_R($request,TRUE) );

		//$referrals = Referrals::with('studentUser.student','user', 'assignment')
		//	->where('Date', Carbon::today())
		//	->where('RefferalStatus',0)
		//	->get();
		if($request->param === "AECList"){
        $referrals = User::with(['referred'=>function($query){
				$query->where('Date', Carbon::today());
		}], 'student')->whereHas('referred', function($query){
					$query->where('Date', Carbon::today());
				})->get();
		}else{
			$referrals = User::with(['referred'=>function($query){
				$query->where('Date', Carbon::today());
				}], 'student')->whereHas('referred', function($query){
				$query->where('RefferalStatus',4);
			})->get();
		}
		
        // $command =  "pdfjam "; 
        $command =  "pdftk "; 
        $files = "rm ";

        //Iterate though the whole array making the files
        for($i = 0; $i<count($referrals) ; $i++){
			$obj = $referrals[$i]->toArray();
            $pdf = new Pdf('PassV4.pdf');
			$schedule  = Classstudents::with('professor_class.period','professor_class.room' )
			->where('StudentId',$obj['id'])
			->whereHas('professor_class.classs', function($q){
				$q->where('Term','S1');
			})->get();
			$schedule1 = '';
			$schedule2 = '';
			$k= 0;
			forEach($schedule as $class){
				$schedule1 .= "Per ".($k+1).":Rm ".$class->professor_class['room']['Name'].' |';
				$k++;
			}
			$classes = explode('|',$schedule1);
			$schedule1 = '';
			for($j = 0; $j <  $k; $j++ ){
				if($j < ($k/2)){
					$schedule1 .= $classes[$j].' |';
				}else{
					$schedule2 .= $classes[$j].' |';
				}
			}
			
            $pdf->fillForm(array('Student Name'=>$obj['FirstName'].', '.$obj['LastName']
			,'AECReferrals'=>count($obj['referred']), 'Now' => Carbon::now()->toFormattedDateString(), 
				'RefDate'=>Carbon::now()->toFormattedDateString(),
               'Schedule1'=>$schedule1, 'Schedule2'=>$schedule2))
            ->flatten()
            ->saveAs($i .".pdf");

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

        $filledFile  =  new Pdf('PassV3Filled.pdf');
        $data = $filledFile->getDataFields();

        return $files;

    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
