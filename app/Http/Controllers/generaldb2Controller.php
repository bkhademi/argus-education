<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;

use App\Generaldb2;
use App\Student;
use App\StudentCounter;
use App\School;
use App\Teacher;
use App\RequestLog;


class generaldb2Controller extends Controller
{
	 public function __construct(){
                // apply the jwt.auth middleware to all methods in thiscontroller
                // except for the authenticate method. We don't want to prevent
                // the  user from retrieving their token if they don't already have it

                $this->middleware('jwt.auth', ['except' => ['index', 'store', 'destroy']]);

        }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {	
		$content = $request->getContent();
		$school = School::whereName($content);
		$schoolId = $school?$school->first()->id:'';

		/*
		if($schoolId === 1 ){
			$newRequest->exception = 'Canceled';
			$newRequest->save();
			return 0;
	    }
		*/
	
		if($request->has('school')){
			$school = School::whereName($request->input('school'))->first();
			$schoolId = $school->id;
			
		}
		// we already have a value for $schoolId
		$entries =  Generaldb2::with('student', 'teacher')
			->whereHas('student',function($query)use($schoolId){
					$query->where('schools_id', $schoolId);
				})
			->get();
				
		
		// log the current request in the request_logs table 
		$newRequest = RequestLog::create(['request_type'=>'GET', 'schools_id'=>$schoolId, 'route'=>'generaldb2', 'content'=>$request->getContent()]);		
		
		$entriesStr = "";
		$field_delim = '&';
		$line_delim = '$';
		foreach($entries as $obj){
			$entriesStr .= $obj->student->studentId.$field_delim ;
			$entriesStr .= $obj->Date.$field_delim ;
			$entriesStr .= $obj->student->studentName.$field_delim ;
			$entriesStr .= $obj->Activity.$field_delim ;
			$entriesStr .= $obj->Comment.$field_delim ;
			$entriesStr .= $obj->ParentNotified.$field_delim ;
			$entriesStr .= $obj->teacher->name.$line_delim;
		}
		
		$newRequest->completed = true;
		$newRequest->save();
		
		return $entriesStr;
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
		$separated = explode("^", $content);
		
		$schoolName = $separated[0];
		$school = School::firstOrCreate(['name'=>$schoolName]);
		
		$schoolId = $school->id;
		
		$newRequest = RequestLog::create(['request_type'=>'POST', 'schools_id'=>$schoolId, 'route'=>'generaldb2','content'=>$request->getContent()]);		
		
		
		$rows = explode("$",$separated[1]);
		
		$inserted = 0;
		$updated = 0;
		
		for($i = 0; $i < count($rows); $i++){
			$row = explode("&", $rows[$i]);
			if(count($row)> 2){
				$student = Student::where('studentId',$row[0])->first();
				if(!$student){
					$newStudent = new Student;
					$newStudent->studentId = $row[0];
					$newStudent->studentName =$row[2];
					$newStudent->schools_id = $schoolId;
					$newStudent->save();
					$studentId = $newStudent->id;
				}else{
					$studentId = $student->id;
				}
				$teacher = Teacher::where('name', $row[6])->first();
				if(!$teacher){
					$newTeacher = new Teacher;
					$newTeacher->name = $row[6];
					$newTeacher->schools_id  =$schoolId;
					$newTeacher->save();
					$teacherId = $newTeacher->id;
				}else{
					$teacherId = $teacher->id;
				}
				
				
				// check if this entry already exitst/ if so then update it  add it else add it 
				$entry = Generaldb2::where('students_id', $studentId)
					->where('Date', $row[1])->where('activity', $row[3])->first();
				if(!$entry){
				
					$insert = ["students_id"=>$studentId, "Date"=>$row[1], "Activity"=>$row[3], "Comment"=>$row[4], "ParentNotified"=>$row[5],"teachers_id"=>$teacherId ];
					Generaldb2::insert($insert);
					$inserted++;
				}else{
					$update = [ "Comment"=>$row[4], "ParentNotified"=>$row[5],"teachers_id"=>$teacherId];
					$entry->update($update);
					$updated++;
				}
				
			}
			
		}
		
		$newRequest->completed=true;
		$newRequest->updated = $updated;
		$newRequest->created = $inserted;
		$newRequest->save();
		
		return  ["inserted"=> $inserted, "updated"=> $updated];
    }
}

