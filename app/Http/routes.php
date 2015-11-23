<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.


*/

use Illuminate\Http\Request;

Route::get('/', function () {
    return view('teacherWelcome');
});

Route::group(array('prefix'=>'api'), function(){
	Route::resource('user', 'UserController');
	Route::resource('assignments','AssignmentsController');
	Route::resource('blobreferences','BlobReferencesController');
	Route::resource('classes','ClassesController');
	Route::resource('classstudents','ClassStudentsController');
	Route::resource('departments','DepartmentsController');
	Route::resource('periods','PeriodsController');
	Route::resource('professorclasses','ProfessorClassesController');
	Route::resource('referrals','ReferralsController');
	Route::resource('roles','RolesController');
	Route::resource('rooms','RoomsController');
	Route::resource('school','SchoolController');
	Route::resource('students','StudentsController');
	Route::resource('user','UserController');
	Route::resource('useractions','UserActionsController');
	Route::resource('userclaims','UserClaimsController');
	Route::resource('userlogins','UserLoginsController');
	Route::resource('userroles','UserRolesController');
	Route::resource('teachers', 'TeachersController');
	
        Route::resource('printAssignments', 'PrintAssignmentsController');
        Route::resource('printPasses', 'PrintPassesController');
        
    Route::resource('authenticate', 'AuthenticateController', ['only' => ['index']]);
	Route::post('authenticate', 'AuthenticateController@authenticate');
	Route::get('authenticate/user', 'AuthenticateController@getAuthenticatedUser');

	Route::resource('/bbyargus/generaldb', 'BbyArgusGeneralDBController');
//		function(){
//		$client = new GuzzleHttp\Client();
//		$res  = $client->request('get', 'http://localhost:8081/api/generaldb?school=Estacado High School');
//		
//		return DB::connection('bbyArgus')->table('generaldb')->get();
//		return $res->getBody;
//	});
});

