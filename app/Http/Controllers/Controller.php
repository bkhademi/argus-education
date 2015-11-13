<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

use Illuminate\Http\Request;
use JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

abstract class Controller extends BaseController
{
    public function __construct(){
		// apply the jwt.auth middleware to all methods in thiscontroller
		// except for the authenticate method. We don't want to prevent
		// the  user from retrieving their token if they don't already have it
		
		$this->middleware('jwt.auth');
		
               $this->user = JWTAuth::parseToken()->authenticate();
               $this->userId = $this->user->id;
	}
    
	// get the userId from the token if using authentication( on deployment )
	// else gets the userId from URL enconded parameter eg. url/api/route?userId=userId
	public function getUserId(Request $request){
		return isset($this->userId)? $this->userId : $request->input('userId');
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
