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

Route::get('blade',function(){
	return view('child', ['name'=>'samo']);
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
	Route::resource('schools','SchoolController');
	Route::resource('students','StudentsController');
	Route::resource('users','UserController');
	Route::resource('useractions','UserActionsController');
	Route::resource('userclaims','UserClaimsController');
	Route::resource('userlogins','UserLoginsController');
	Route::resource('userroles','UserRolesController');
	Route::resource('teachers', 'TeachersController');
	
	Route::resource('oroom', 'ORoomController');
	Route::resource('lunch', 'LunchDetentionController');
	Route::resource('iss', 'ISSController');
	Route::resource('oss', 'OSSController');
	Route::resource('activities', 'ActivitiesController');
	Route::resource('counters', 'CountersController');
	Route::resource('aeclist', 'AECController');
	Route::resource('aecabsencelist', 'AECAbsenceController');
	Route::get('referraltypes',function(){
		return App\Referraltypes::all();
	});
	
	Route::post('task_asp_dunbar', 'TestTasksController@aspDunbar', ['middleware' => '']);
	Route::post('task_asp_estacado', 'TestTasksController@aspEstacado', ['middleware' => '']);
	Route::post('task_commit_aec_attendance', 'TestTasksController@commitAECAttendance', ['middleware' => '']);
	Route::post('task_commit_reteach_attendance', 'TestTasksController@commitReteachAttendance', ['middleware' => '']);
	Route::post('task_submit_aec_attendance','TestTasksController@submitAECAttendance', ['middleware' => '']);
	Route::post('task_submit_reteach_attendance','TestTasksController@submitReteachAttendance', ['middleware' => '']);
	Route::post('task_report_demand','TestTasksController@report');
	
	
	Route::resource('reteachlist', 'ReteachController');
	Route::resource('reteachaecabsencelist', 'ReteachAbsenceController');
	
	Route::resource('asp', 'ASPController');
	
	Route::resource('admin_referrals','ReferralsAdminController');
	Route::resource('admin_activities','ActivitiesADminController');
	Route::resource('admin_users','UsersADminController');
	
	
	Route::get('report-eod-oroom', 'ReportsController@EODoroom');
	Route::get('report-eod-lunchd', 'ReportsController@EODlunchD');
	Route::get('report-eod-iss', 'ReportsController@EODiss');
	Route::get('report-eod-oss', 'ReportsController@EODoss');
	Route::get('report-eod-aec', 'ReportsController@EODAEC');
	Route::get('report-eod-asp', 'ReportsController@EODASP');
	Route::get('report-eod-all', 'ReportsController@EODall');
	Route::get('report-eod-reteach','ReportsController@EODReteach' );
	
	Route::get('report-oroomactivity', 'ReportsController@oroomActivity');
	
	
        Route::resource('printAssignments', 'PrintAssignmentsController');
        Route::resource('printPasses', 'PrintPassesController');
        
    Route::resource('authenticate', 'AuthenticateController', ['only' => ['index']]);
	Route::post('authenticate', 'AuthenticateController@authenticate');
	Route::get('authenticate/user', 'AuthenticateController@getAuthenticatedUser');

	
	Route::post('generaldb', 'generaldbController@store');
	Route::get('generaldb', 'generaldbController@index');
	
	Route::post('generaldb2', 'generaldb2Controller@store');
	Route::get('generaldb2', 'generaldb2Controller@index');
	
//	
//	Route::post('activities', 'activitiesController@store');
//	Route::get('activities', 'activitiesController@index');
//	Route::delete('activities','activitiesController@destroy');	

	Route::resource('/bbyargus/generaldb', 'BbyArgusGeneralDBController');
//		function(){
//		$client = new GuzzleHttp\Client();
//		$res  = $client->request('get', 'http://localhost:8081/api/generaldb?school=Estacado High School');
//		
//		return DB::connection('bbyArgus')->table('generaldb')->get();
//		return $res->getBody;
//	});
});

/*Display all SQL executed in Eloquent
	Event::listen('illuminate.query', function($query)
	{
    var_dump($query);
	});
 */