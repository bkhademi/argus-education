<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;

// use Request;
// use App\Http\Requests;
use App\Http\Controllers\Controller;
use mikehaertl\pdftk\Pdf;
use mikehaertl\pdftk\FdfFile;
use Carbon\Carbon;




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



        $count = 3;

        // $command =  "pdfjam "; 
        $command =  "pdftk "; 
        $files = "rm ";

        //Iterate though the whole array making the files
        for($i = 0; $i<$count ; $i++){
            $pdf = new Pdf('PassV3.pdf');
            $pdf->fillForm(array('Name'=>'Atl', 'Grade'=>'6th', 'Period'=>$i, 
                'AtOnce'=>'Yes','Date' => Carbon::now(), 'EndOfPeriod'=>'Yes',
                'AtTeachersConvenience'=>'Yes', 'RoomInNow'=>'C130', 'GoTo'=>'ElAdrian',
                'PersonSending'=>'ElAtl'))
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
