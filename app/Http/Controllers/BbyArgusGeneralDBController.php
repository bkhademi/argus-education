<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;


use App\BbyArgusTeachers;
use App\BbyArgusGeneralDB;
use App\BbyArgusGeneralDB2;
use App\BbyArgusStudents;

use App\User;
use App\Assignments;
use Carbon\Carbon ;
 
use App\Http\Requests;
use App\Http\Controllers\Controller;

class BbyArgusGeneralDBController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        //
		$students = User::whereHas('referred',function($q){
			$q->where('RefferalStatus', 4);
		})->get(['UserName']);
		
		return $students->count();
		
		return BbyArgusStudents::with('school', 'generaldb', 'generaldb2')->get();
		return BbyArgusGeneralDB2::all();
		return BbyArgusTeachers::all();
		return BbyArgusGeneralDB::all();
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
