<?php

namespace App\Http\Controllers;
use Log;
use Illuminate\Http\Request;
// use Illuminate\Support\Facades\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

use App\Referrals;

use App\Students;
use App\ClassStudents;
use App\Professorclasses;
use App\User;
use App\Assignments;

class ReferralsController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
        

        $referrals = Referrals::where('UserId', $this->userId)->get();//find('00d02dc6-4aa7-41a0-afdd-e0772ae4ba4b')->classStudents()->get();
        
		// $referrals = Referrals::all();
		
		return $referrals;
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
        //

        $dataIn = collect($request->data);

        error_log(print_R($dataIn[0],TRUE) );
        error_log($dataIn->count());

        for($i=0;$i<$dataIn->count();$i++){
            Referrals::create(
            ['UserId' => $dataIn[$i]['StudentId'],//$this->userId, 
                'StudentId' => $dataIn[$i]['StudentId'],
                'AssignmentId' => $dataIn[$i]['AssignmentId'], 
                'RefferalStatus' => $dataIn[$i]['RefferalStatus'],
                'Date' => $dataIn[$i]['Date'],
                'ParentNotified' => $dataIn[$i]['ParentNotified'],
                'StudentNotified' => $dataIn[$i]['StudentNotified']]
             );
        }
        

        // $referrals->save();
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

        $date = $id;

        // $referrals = Referrals::where('UserId', $this->userId)->where('Date', $id)->get();//find('00d02dc6-4aa7-41a0-afdd-e0772ae4ba4b')->classStudents()->get();
        //Getting the user referals for an specific date
        $referrals = Referrals::where('UserId', '00d02dc6-4aa7-41a0-afdd-e0772ae4ba4b')->where('Date', '2012-00-00 00:00:00')->get();

        $LeStatus = 0;
        $count = $referrals->count();

        $collection = collect();

        for( $i = 0; $i <  $count; $i++){
            $test =  $collection->collapse();
            if($test->contains('Id', $referrals[$i]['StudentId']) && !($collection->isEmpty())){


                $existentInfo = $test->where('Id', $referrals[$i]['StudentId']);
                error_log(print_R($existentInfo[0]['Assignments'],TRUE) );
                error_log('Inside If');

                if(!($existentInfo[0]['Assignments']->contains('Id',$referrals[$i]['AssignmentId'] ))){
                    $assignmentInfo = Assignments::where('Id',$referrals[$i]['AssignmentId'])->get();
                    $existentInfo[0]['Assignments']->push($assignmentInfo);
                    // $collection = collect($test);
                }
            }else{
                error_log('Inside Else');
                $userInfo = Students::with('user')->where('Id', $referrals[$i]['StudentId'])->get();
                $assignmentInfo = Assignments::where('Id',$referrals[$i]['AssignmentId'])->get();

                $userInfo[0]['Assignments'] = $assignmentInfo;
                $collection->push($userInfo);

                
            }

            error_log($LeStatus );
            $LeStatus++;
        }

        
        return $collection->collapse();

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
