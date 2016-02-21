<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

use App\Userroles;
use App\Roles;
use App\User;


class AuthenticateController extends Controller
{
    public function __construct(){
		// apply the jwt.auth middleware to all methods in thiscontroller
		// except for the authenticate method. We don't want to prevent
		// the  user from retrieving their token if they don't already have it
		
		$this->middleware('jwt.auth', ['except' => ['authenticate']]);
		
	}
    
    
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
        $users = User::all();
		return $users;
        
    }
    public function getAuthenticatedUser(){
        try {

            if (! $user = JWTAuth::parseToken()->authenticate()) {
                return response()->json(['user_not_found'], 404);
            }

        } catch (Tymon\JWTAuth\Exceptions\TokenExpiredException $e) {

            return response()->json(['token_expired'], $e->getStatusCode());

        } catch (Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {

            return response()->json(['token_invalid'], $e->getStatusCode());

        } catch (Tymon\JWTAuth\Exceptions\JWTException $e) {

            return response()->json(['token_absent'], $e->getStatusCode());

        }

        // the token is valid and we have found uservia the sub claim
        $roleId =  Userroles::where('userId', $user->id)->first()->RoleId;
		$role = Roles::where('Id', $roleId)->first();
		$school = \App\Schools::find($user->SchoolId);
        $user->role = $role->Name;
		$user->route = $role->Route;
		$user->schoolId = $school->Id;
		$user->logo = $school->ImageReference;
        return response()->json(compact('user'));
    }

    public function authenticate(Request $request){
        $credentials = $request->only('email', 'password');
        
        try{
            // verify credentials and create a token for the user
            if(! $token = JWTAuth::attempt($credentials)){
                    return response()->json(['error' => 'invalid_credentials'], 401);
            }
        }catch(JWTException $e){
            // something went wrong 
            return response()->json(['error' => 'could_not_create_token'], 500);
		}
		
        //$UserID = User::where('email', $credentials['email'])->value('name');
        //$UserID = Auth::user()->name;   // get the username when the user is authenticated 
        //if no error are encountered return a JWT
        return response()->json(compact('token'));
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
