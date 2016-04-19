<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

use Illuminate\Http\Request;
use JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use Carbon\Carbon;

abstract class Controller extends BaseController
{
	public $oroomReferralTypes = [1,2,3,16,19];
	public $issReferralTypes = [5,6,7,10,15,17];
	public $ossReferralType = 11;
	public $aecReferralType = 12;
	public $aecAbsenceStatus = 4;
	public $reteachReferralType = 18;
	public $reteachAbsenseStatis = 8;
	public $schoolId = ['Estacado'=>1, 'Dunbar'=>2, 'Ervin'=>3, 'Adrian'=>4];
	
	
	
    public function __construct(){
		// apply the jwt.auth middleware to all methods in this controller

		//$this->middleware('jwt.refresh');
		//$this->middleware('jwt.auth');
		
		$this->user = JWTAuth::parseToken()->toUser();

		$this->userId = $this->user->id;
		$this->SchoolId = $this->user->SchoolId;

	}
    
	// get the userId from the token if using authentication( on deployment )
	// else gets the userId from URL enconded parameter eg. url/api/route?userId=userId
	public function getUserId(Request $request){
		return isset($this->userId)? $this->userId : $request->input('userId');
	}

	public function getDate(Request $request){
		return $request->has('Date')? new Carbon($request->Date): Carbon::today();
	}
	
	public function notImplemented(){
		return response(['msg'=>'Not Implemented Yet'], 500);
	}
	
	public function stored(){
		return response('successfully_saved',200);
	}
	
	
	public function updated(){
		return response("successfully_updated", 200);
	}
	
	public function deleted(){
		return response("successfully_deleted", 200);
	}
	public function unsuccessful(){
		return response("unsuccessful operation", 500);
	}

	
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;
}
