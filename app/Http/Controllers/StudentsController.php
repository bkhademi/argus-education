<?php

namespace App\Http\Controllers;

use App\Http\Requests;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use App\Students;
use App\ClassStudents;
use App\Professorclasses;
use App\User;
use App\Useractions;
use Carbon\Carbon ;

class StudentsController extends Controller
{
    /**
     * Display a listing of the resource.
	 * Finds the students of a given teacher
	 * teacherId is pased as urlEncoded 
	 * userId is passed in the jwt (json web token)
	 * if no teacherID is given then return the student
	 * of the userId
     * only students from user's school
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        //get the school of the user
        
		// $studentsJson = ProfessorClasses::where('UserId', '00d02dc6-4aa7-41a0-afdd-e0772ae4ba4b')->get();
		// $stuClasses = $students[0]->classStudents()->get();
        //$stuInfo = $stuClasses[0]->user()->get();

		// if using user authentication use that user id else use the url  encoded userid  "url/?userId=userid"
		
		$requestor = User::find($this->getUserId($request));
		// requesting the students of a given teacher
		if($request->has('teacherId')){
			$id = $request->input('teacherId');
		}else if($request->has('admin')){
			if($request->has('light')){
				return Students::with('user')->get()->all();
			}else{
				return Students::with('user.activitiesAffected')->get()->all();
			}
		}else{
			$id = $this->getUserId($request);
		}
		
		//$userId = isset($this->userId) ? $this->userId : $request->input('userId');
        $teacherWithClassStudents = User::with('classstudents.user.student')->find($id);
		$uniqueIDs = $teacherWithClassStudents->classStudents->unique('StudentId')->pluck('StudentId');
		$teacherWithClassStudents = User::with('student')->wherein('id', $uniqueIDs)->get();
		return $teacherWithClassStudents;
      
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
		
		$student = Students::with('user.activitiesAffected.user', 'professorClasses' )->findOrFail($id);
		return $student;
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
		$student = Students::find($id);
		$student->update($request->all());
		
		$action = Useractions::create(['ActionDate'=>Carbon::today(),
		'ActionByUserId'=>$this->userId,'ActionToUserId'=>$id,'ActionType'=>6,
		//'Comment'=>'Student was Rescheduled from '.$request->oldDate.' to '.$request->newDate,
		'Comment'=>$request->ParentNotifiedComment,
		'ParentNotified'=>$request->ParentNotified,
		'StudentNotified'=>$request->ParentNotified,
		//'Excused'=> $request->excused?1:0
		]);
		
		return $student;
        return $request->all();
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
