<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;

use DB;
use App\ConditionCode;
use App\Generaldb;
use App\School;
use App\Student;
use App\StudentCounter;
use App\Teacher;
use App\RequestLog;


class generaldbController extends Controller
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
		$schoolName = $request->getContent(); // get the request content( school name )
		$school = School::whereName($schoolName);
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
		$entries =  Generaldb
			::with('student.school')
			->whereHas('student',function($query)use($schoolId){
					$query->where('schools_id', $schoolId);
				})
			->get();
		
		
		$newRequest = RequestLog::create(['request_type'=>'GET', 'schools_id'=>$schoolId, 'route'=>'generaldb', 'content'=>$request->getContent()]);		
		
	   
		$entriesStr = "";
		$field_delim = '&';
		$line_delim = '$';
		foreach($entries as $obj){
			$entriesStr .= $obj->student->studentId.$field_delim;
			$entriesStr .= $obj->DateStarted.$field_delim;
			$entriesStr .= $obj->student->studentName.$field_delim;
			$entriesStr .= $obj['O-RoomsToBeServed'].$field_delim;
			$entriesStr .= $obj->NoShows.$field_delim;
			$entriesStr .= $obj->WalkOut.$field_delim;
			$entriesStr .= $obj->SentOut.$field_delim;
			$entriesStr .= $obj->other.$field_delim;
			$entriesStr .= $obj->SchoolAbsent.$field_delim;
			$entriesStr .= $obj->WarningCount.$field_delim;
			$entriesStr .= $obj->LeftSchool.$field_delim;
			$entriesStr .= $obj->LunchDetentionToBeServed.$field_delim;
			$entriesStr .= $obj->ISSReferrals.$field_delim;
			$entriesStr .= $obj->LunchType.$field_delim;
			$entriesStr .= $obj->LDReferrals.$field_delim;
			$entriesStr .= $obj->ORMReferrals.$field_delim;
			$entriesStr .= $obj->Type1R.$field_delim;
			$entriesStr .= $obj->Type2R.$field_delim;
			$entriesStr .= $obj->Tardies.$field_delim;
			$entriesStr .= $obj->DalyAvgAttend.$field_delim;
			$entriesStr .= $field_delim; // 201
			$entriesStr .= $field_delim; // 203
			$entriesStr .= $field_delim; // 215
			$entriesStr .= $field_delim; // 202
			$entriesStr .= $obj->student->parentInfo.$field_delim;
			$entriesStr .= $field_delim; // 207
			$entriesStr .= $field_delim; // 214
			$entriesStr .= $field_delim; // 225
			$entriesStr .= $obj->ISSDays.$field_delim; // ISS Days
			$entriesStr .= $obj->OSSReferal.$field_delim; // OSS Referal
			$entriesStr .= $obj->OSSPMP.$field_delim; // OSS PMP
			$entriesStr .= $obj->Cycles.$field_delim; // Cycles
			$entriesStr .= $obj->OSSPMDate.$field_delim; // OSS PM Date
			$entriesStr .= $obj->StaffMember.$field_delim; // StaffMember
			$entriesStr .= $obj->student->eighthPer.$line_delim; 
			
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
		//
		$content = $request->getContent();
		$separated = explode("^", $content);
		
		$schoolName = $separated[0];
		$school = School::firstOrCreate(['name'=>$schoolName]);
		
		$schoolId = $school->id;
			
		$newRequest = RequestLog::create(['request_type'=>'POST', 'schools_id'=>$schoolId, 'route'=>'generaldb','content'=>$request->getContent()]);		
		
		
		$rows = explode("$",$separated[1]);
		
		$insert= "";
		$updated = 0;
		$created = 0;
		for($i = 0; $i < count($rows); $i++){
			$row = explode("&", $rows[$i]);
			if(count($row)> 15){
				$student = Student::where('studentId',$row[0])->first();
				
				if($student){//if student exists, update
					$studentId = $student->id;
					$entry = generaldb::where('students_id', $studentId)->first();
					generaldb::where('students_id', $studentId)
					->update([
					"O-RoomsToBeServed"=>$row[3],
					"NoShows"=>$row[4],
					"WalkOut"=>$row[5],
					"SentOut"=>$row[6],
					"other"=> $row[7],
					"SchoolAbsent"=>$row[8],
					"WarningCount"=>$row[9],
					"LeftSchool"=>$row[10],
					"LunchDetentionToBeServed"=>$row[11],
					"ISSReferrals"=>$row[12],
					"LunchType"=>$row[13],
					"LDReferrals"=>$row[14],
					"ORMReferrals"=>$row[15], 
					"Type1R"=>$row[16],
					"Type2R"=>$row[17], 
					"Tardies"=>$row[18],
					"DalyAvgAttend"=>$row[19],
					"ISSDays"=>isset($row[28])?$row[28]:$entry->ISSDays,
					"OSSReferal"=>isset($row[29])?$row[29]:$entry->OSSReferal,
					"OSSPMP"=>isset($row[30])?$row[30]:$entry->OSSPMP,
					"Cycles"=>isset($row[31])?$row[31]:$entry->Cycles,
					"OSSPMDate"=>isset($row[32])?$row[32]:$entry->OSSPMDate,
					"StaffMember"=>isset($row[33])?$row[33]:$entry->StaffMember
					
					]);
					$student->parentInfo = isset($row[24])?$row[24]:$student->parentInfo;
					$student->save();
					
					$updated++;
				}else{
					
					// create a new student
					$student = new Student;
					$student->studentId = $row[0];
					$student->studentName = $row[2];
					$student->schools_id = $schoolId;
					$student->parentInfo = isset($row[24])?$row[24]:-1;
					$student->save();

					//instert into generaldb
						//
					$insert = ["students_id"=>$student->id,
					"DateStarted"=>$row[1], 
					"O-RoomsToBeServed"=>$row[3], 
					"NoShows"=>$row[4], 
					"WalkOut"=>$row[5],
					"SentOut"=>$row[6], 
					"other"=> $row[7], 
					"SchoolAbsent"=>$row[8],
					"WarningCount"=>$row[9],
					"LeftSchool"=>$row[10],
					"LunchDetentionToBeServed"=>$row[11],
					"ISSReferrals"=>$row[12],
					"LunchType"=>$row[13],
					"LDReferrals"=>$row[14],
					"ORMReferrals"=>$row[15], 
					"Type1R"=>$row[16], 
					"Type2R"=>$row[17], 
					"Tardies"=>$row[18], 
					"DalyAvgAttend"=>$row[19],
					"ISSDays"=>isset($row[28])?$row[28]:-1,
					"OSSReferal"=>isset($row[29])?$row[29]:-1,
					"OSSPMP"=>isset($row[30])?$row[30]:-1,
					"Cycles"=>isset($row[31])?$row[31]:-1,
					"OSSPMDate"=>isset($row[32])?$row[32]:-1,
					"StaffMember"=>isset($row[33])?$row[33]:$entry->StaffMember
					];
					
					
					generaldb::insert($insert);
					$created++;
				}
			
				
			}
			
		}
		
		$newRequest->completed=true;
		$newRequest->updated = $updated;
		$newRequest->created = $created;
		$newRequest->save();
		
		return  ["Updated"=>$updated, "Created"=>$created];
    }

   
}

