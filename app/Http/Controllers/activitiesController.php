<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;

use DB;
use App\Activity;
use App\Student;
use App\StudentCounter;
use App\School;
use App\Teacher;	
use App\RequestLog;
use App\Generaldb;



class activitiesController extends Controller
{

	 public function __construct(){
		// apply the jwt.auth middleware to all methods in thiscontroller
		// except for the authenticate method. We don't want to prevent
		// the  user from retrieving their token if they don't already have it
		
		$this->middleware('jwt.auth', ['except' => ['index', 'store', 'destroy']]);
		
	}	

	protected $noSchoolID = 17;
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        //
		try{
		$activities = Activity::all();
		
		$content = $request->getContent();
		$school = School::where('name', $content )->first();
		if($school){
			$schoolid = $school->id;
		}else{
			$schoolid = 17;// default
		}
		
		$activities = Activity::with('student.school', 'student.gendb')->get();
		$activities_str = "";
		
		$newRequest = RequestLog::create(['request_type'=>'GET', 'schools_id'=>$schoolid, 'route'=>'activities',  'content'=>$request->getContent()]);		
		
			foreach($activities as $item){
				
				if($schoolid !== $item->student->school->id)
				continue;
				$activities_str .=  $item->student->studentId . '&';
				$activities_str .=  $item->student->studentName . '&';
				$activities_str .=  $item->student->gendb['O-RoomsToBeServed'] .'&';
				$activities_str .= 	$item->activity . '&';
				
				
				$activities_str .= '$';
			}
		
		/*
		for($i = 0; $i < count($activities); $i++){
			$item = $activities[$i];
			$student = Student::find($item->students_id);
			
			$activities_str .=  $student->studentId . '&';
			$activities_str .=  $student->studentName . '&';
			$activities_str .=  $item->pendingORDays .'&';
			$activities_str .= 	$item->activity . '&';
			
			
			$activities_str .= '$';
		}
		*/
		$newRequest->completed=true;
		$newRequest->save();
		
		return $activities_str;
		
		}catch(Exception $e){
			$newRequest = RequestLog::create(['request_type'=>'GET', 'schools_id'=>$schoolid, 'route'=>'activities_EXCEPTION',  'content'=>$request->getContent() ]);		
		}
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
		$content = $request->getContent();
		
		$separated = explode('^', $content);
		
		$newRequest = RequestLog::create(['request_type'=>'POST','schools_id'=>1, 'route'=>'activities','content'=>$request->getContent() ]);		
		
		
		if(count($separated) > 1) {// school was provided 
			$schoolName = $separated[0];
			$school  = School::where('name',$schoolName)->first();
			if(!$school){
				$newSchool = new School;
				$newSchool->name = $schoolName;
				$newSchool->save();
				$schoolId = $newSchool->id;
			}else{
				$schoolId = $school->id;
			}
			$rows =  explode('$', $separated[1]);
		}else{
			$rows = explode('$', $separated[0]);
			$schoolId = $noSchoolID;
		}
		$newRequest['schools_id'] = $schoolId;
		$inserted = [];
		for($i =0 ; $i < count($rows); $i++){
			$row = explode('&',$rows[$i]);
			
			if(count($row) < 2)
				continue;
			
			$student= Student::where('studentId', $row[0])->first();
			if(!$student){
				$newStudent = new Student;
				$newStudent->studentId = $row[0];
				$newStudent->studentName =$row[1];
				$newStudent->schools_id = $schoolId;
				$newStudent->save();
				$studentId = $newStudent->id;
			}else{
				$studentId = $student->id;
			}
			
			$genDb1Entry = Generaldb::where('students_id', $studentId)->first();
			$pendingORdays = $genDb1Entry['O-RoomsToBeServed'];
			//check if activity already exist (if students_id is already in the list)
			$entry = Activity::where('students_id',$studentId)->first();
			if(!$entry){
				$act = Activity::create(['activity'=>$row[3],'pendingORDays'=>$pendingORdays,'students_id'=>$studentId]);
			}else{
				$act = $entry->update(['activity'=>$row[3],'pendingORDays'=>$pendingORdays,  ]);
			}
			array_push($inserted,$act);
			
			
		}
		
		
		$newRequest->completed=true;
		$newRequest->save();
		
		return $inserted;
		
		
		
    }
	
	public function countActivities(){
		return Activity::count();
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
    public function destroy()
    {
        //
		DB::beginTransaction();
		$activities =Activity::all();
		DB::rollback();
		return $activities;
		
    }
}

