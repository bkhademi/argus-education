<?php

namespace App\Http\Controllers;

use Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;

use App\Students;
use App\ClassStudents;
use App\Professorclasses;
use App\User;

class StudentsController extends Controller
{
    /**
     * Display a listing of the resource.
     * only students from user's school
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //get the school of the user
        
		// $studentsJson = ProfessorClasses::where('UserId', '00d02dc6-4aa7-41a0-afdd-e0772ae4ba4b')->get();
		// $stuClasses = $students[0]->classStudents()->get();
        //$stuInfo = $stuClasses[0]->user()->get();

        $classstudents = User::find('00d02dc6-4aa7-41a0-afdd-e0772ae4ba4b')->classStudents()->get();
        $students = new \Illuminate\Database\Eloquent\Collection;
        $count  = 0;
        foreach ($classstudents as $item) {
            $students->push($item->user()->get());

        }
        // $students = $classstudents[0]->user()->get();
		return $students->collapse();
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
