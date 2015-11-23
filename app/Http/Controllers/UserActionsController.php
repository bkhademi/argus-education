<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use Illuminate\Support\Collection;
use App\Useractions;
use App\User;
use \Carbon\Carbon;

class UserActionsController extends Controller
{
    /**
     * Display a listing of the resource.
     * Url encoded params: 
	 * ActionByUserId = get all entries where ActionByUserId 
	 * ActionToUserId = get all entries where ActionToUserId
	 * if not retur all the actions caused by the current user
     * @return \Illuminate\Http\Response
     */
    public function index( Request $request )
    {
        //
		$userId = $this->getUserId($request);
		
		if($request->has('param') && $request->param === 'ORoom'){
			$date = Carbon::today();
			
			$users =  User::with('activitiesAffected')->whereHas('activitiesAffected', function($q)use($date){
				$q->where('ActionDate', $date);
			})->get();
			
			$arr  = [];
			$k =0;
			for($i = 0; $i < count($users); $i++){
				 $exists = false;
				 $activities = $users[$i]->toArray()['activities_affected'];
				for($j = 0; $j < count($activities); $j++){
					if($activities[$j]['ActionType'] === '3'){
						$exists = true;
					}
				}
				if(!$exists){
					$arr[$k++] = $users[$i];
				}
			}
			
			return $arr;
			
			$actions = UserActions::with('student')
				->where('ActionDate',$date)
				->Where('ActionType','<>', 3)
				->wherein('AbsenceStatus',[0,1,2])
				
				->get();
			return $actions;
		}
		
		if($request->has('ActionByUserId')){
			return  Useractions::with('student', 'user')->where('ActionByUserId', $request->ActionByUserId)->get();
		}else if($request->has('ActionToUserId')){
			return Useractions::with('student', 'user')->where('ActionToUserId', $request->ActionToUserId)->get();
		}else{
			return Useractions::with('student', 'user')->where('ActionByUserId',$userId)->get();
			
		}
		
		return response(['msg'=>'Params Expected:  UserId or TeacherId,Or loggedIn if both,UserId has priority,'],500);
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
		$dataIn = collect($request->all());
			
		try{
			$insert =  UserActions::create($dataIn);
		}catch(Exception $e){
			throw $e;
			return response(['msg'=>'Unable to create Item '],500);
		}
		
		return $this->stored();
    }

    /**
     * Display all the activity entries for a student
     * Expected URL encoded Parameters
	 * 
	 * ActionByUserId url encoded
     * @param  int  $id (actionToId)
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request, $id)
    {
        return Useractions::findOrFail($id);
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
