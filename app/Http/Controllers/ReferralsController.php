<?php

namespace App\Http\Controllers;
use Log;
use Illuminate\Http\Request;
// use Illuminate\Support\Facades\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

use App\Referrals;

use App\Students;
use App\Useractions;

use App\ClassStudents;
use App\Professorclasses;
use App\User;
use App\Assignments;
use Carbon\Carbon ;

class ReferralsController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        // UserId = Teacher's Id of the referral,, get the refferrals of a given teacher
		// if using user authentication use that user id else use the url  encoded userid  "url/?userId=userid"
		
		$userId = $this->getUserId($request);
		$date = new Carbon();
        $referrals = Referrals::with('studentUser', 'assignment')->where('UserId', $userId)->orderBy('Date', 'desc')->get();//find('00d02dc6-4aa7-41a0-afdd-e0772ae4ba4b')->classStudents()->get();
        
		$referrals = User::with(['referred'=>function($query)use($userId, $date){
				$query->with('assignment', 'user.assignments')
					->where('refferals.UserId',$userId)
					//->where('Date','>=',$date)
					//->where('RefferalStatus',0)
					//->OrWhere('RefferalStatus',2);
					;
			}])->with('student')->whereHas('referred',function($query)use($userId, $date){
				$query
					->where('refferals.UserId',$userId);
					//->where('Date','>=',$date);
			})
			->get();
		
		// $referrals = Referrals::all();
		
		return $referrals;
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
		$userId = $this->getUserId($request);// getUserId is in base controller
		$date = new \Carbon\Carbon($request->date);
        $dataIn = collect($request->data);
		
		
		
		
        error_log(print_R($dataIn[0],TRUE) );
        error_log($dataIn->count());
		$created=0;
		$updated=0;
        for($i=0;$i<$dataIn->count();$i++){
			// check if the referral is already there 
			// a referral is uniquely identified by 4 fields
			// (UserID, StudentId, AssignmentId, Date)
			$referral = Referrals
				::whereUserid($userId)
				->whereStudentid($dataIn[$i]['StudentId'])
				->whereAssignmentid($dataIn[$i]['AssignmentId'])
				->where('Date',$date)
				->first();
			if(!$referral){
				$created++;
				Referrals::create(
				['UserId' => $dataIn[$i]['UserId'],//$userId,//$this->userId, 
					'StudentId' => $dataIn[$i]['StudentId'],
					'AssignmentId' => $dataIn[$i]['AssignmentId'], 
					'RefferalStatus' => $dataIn[$i]['RefferalStatus'],
					'Date' => $date,
					'ParentNotified' => $dataIn[$i]['ParentNotified'],
					'StudentNotified' => $dataIn[$i]['StudentNotified']]
				 );
			}else{
				$updated++;
				$referral->ParentNotified = $dataIn[$i]['ParentNotified'];
				$referral->StudentNotified = $dataIn[$i]['StudentNotified'];
				//$referral->RefferalStatus = $dateIn[$i]['ReferralStatus'];
				$referral->save();
				
					
			}
        }
        
		return ['Created'=>$created, 'Updated'=>$updated];
        // $referrals->save();
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request, $id)
    {
        //

        $date = $id;
		$date = new \Carbon\Carbon($date);
		
		// if using user authentication use that user id else use the url  encoded userid  "url/?userId=userid"
		
		$userId = isset($this->userId) ? $this->userId : $request->input('userId');
		$currentUser = User::find($userId);
		//$userId =  'fefdfc7c-8ce1-47a4-bb7c-f475ea116a0e';
		//$date  =  '2012-00-00 00:00:00';
		
		if($request->has('absence')){
			return  Referrals
			::with('studentUser.student','assignment','user')
				->where('Date', $date)
				->where('RefferalStatus',4)
				->get();
		}
		
		if(!$request->has('referral')){
			$referrals  = User::with(['referred'=>function($query)use($userId, $date){
					$query->with('assignment', 'user.assignments')
						//->where('refferals.UserId',$userId)
						->where('Date',$date)
						->where('RefferalStatus',0)
						->OrWhere('RefferalStatus',2)
						->OrWhere('RefferalStatus',4);
				}])->with('student')->whereHas('referred',function($query)use($userId, $date){
					$query
						//->where('refferals.UserId',$userId)
						->where('Date',$date);
				})
				->get();
		}
		else{
	
		$referrals = User::with(['referrals'=>function($q)use($date){
				$q->where('Date',$date)->with('studentUser', 'assignment');
			}])->where('SchoolId', $currentUser->SchoolId)->whereHas('roles',function($q){
				$q->where('aspnetroles.Name', 'teacher');
			})->whereHas('referrals', function($q)use($userId,$date){
				$q->where('Date',$date);
			})->get();
		 
//		$referrals = Referrals::with(['studentUser.referred'=>function($q){
//		}])->select('StudentId')->distinct()->where("Date",$date);
//		$referrals = $referrals->addSelect('UserId')->get()->load('user');
//		
			
			
//		$referrals = Referrals::with('user')->select('UserId')->distinct()->where("Date",$date);
//		$referrals = $referrals->addSelect('StudentId')->get()->load('studentUser.referred');
		 }
		 
		return $referrals;
		
        // $referrals = Referrals::where('UserId', $this->userId)->where('Date', $id)->get();//find('00d02dc6-4aa7-41a0-afdd-e0772ae4ba4b')->classStudents()->get();
        //Getting the user referals for an specific date
		$referrals = Referrals::with('studentUser.student','assignment')->where('UserId',$userId)
			->where('Date', $date)->get();
		
        $LeStatus = 0;
        $count = $referrals->count();

        $collection = collect();

        for( $i = 0; $i <  $count; $i++){
            $test =  $collection->collapse();
            if($test->contains('Id', $referrals[$i]['StudentId']) && !($collection->isEmpty())){


                $existentInfo = $test->where('Id', $referrals[$i]['StudentId']);
                error_log(print_R($existentInfo[0]['Assignments'],TRUE) );
                error_log('Inside If');

                if(!($existentInfo[0]['Assignments']->contains('Id',$referrals[$i]['AssignmentId'] ))){
                    $assignmentInfo = Assignments::where('Id',$referrals[$i]['AssignmentId'])->get();
                    $existentInfo[0]['Assignments']->push($assignmentInfo);
                    // $collection = collect($test);
                }
            }else{
                error_log('Inside Else');
                $userInfo = Students::with('user')->where('Id', $referrals[$i]['StudentId'])->get();
                $assignmentInfo = Assignments::where('Id',$referrals[$i]['AssignmentId'])->get();

                $userInfo[0]['Assignments'] = $assignmentInfo;
                $collection->push($userInfo);

                
            }

            error_log($LeStatus );
            $LeStatus++;
        }

        
        return $collection->collapse();

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
    {   ///////////////////////////////////////
        //TODO: Change the timezone to the one in TEXAS on the tomorrow part.
        /////////////////////////////
		$param = $request->input('param');

        error_log($param);

		switch($param){
			case 'present':
				// update the assignments for which the student was present.
				// move the others to the next day
				$status = $request->input('Completed')?1:0;
				$Reprint =$request->input('Reprint')?1:0;
                Referrals::where('Id',$id)->update(['RefferalStatus' => $status, 'Reprint'=>$Reprint]);
				if(!$request->input('Completed')){// not completed, reschedule to next day
					Referrals::where('Id',$id)->update(['RefferalStatus' => 0, 'Date'=> Carbon::tomorrow()]);
				}
				return ['msg'=>'present  student'];

			case 'reschedule':
                Referrals::where('Id',$id)->update(['RefferalStatus' => 2, 'Date'=> Carbon::tomorrow()]);
				if($request->input('comment') ==='Parent Requested Reschedule' ){
					return ['msg'=>'parent requested rescheduling the student'];
				}
				return ['msg'=>'rescheduling the student'];
			case 'clear':
                Referrals::where('Id',$id)->update(['RefferalStatus' => 3]);
				//Useractions::create([])
				return ['msg'=>'clearing the student'];
			case 'teacherUpdate': 
				$referral = $request->data;
				$accepted = $referral['Accepted']?1:0;
				$status = $accepted?3:2;
				$reason = $referral['Reason']['value'];
				$update = ['RefferalStatus'=>$status,'Accepted'=>$accepted,
					'RejectedComment'=>$referral['RejectedComment'], "Reason"=>$reason];
				Referrals::where('Id',$id)->update($update);
				// check if the refferral was not accepted reschedule 
				if(!$accepted){
					// check next day available,, for now reschedue for next day 
					
					Referrals::where('Id',$id)->update(['Date'=> Carbon::tomorrow()]);
				}
				return ['msg'=>'Teacher Updating the  referral'];
			case 'absent':
				$status = 4;
				$update = Referrals::find($id)->update(['RefferalStatus'=>$status, 'Date'=>Carbon::tomorrow()]);
				return ['msg'=>'Student was Absent, rescheduling for  tomorrow :'.$update];
			case 'AbsentComment':
				$status = 0;
				$comment = $request->comment;
				$update = Referrals::find($id)->update(['RefferalStatus'=>$status]);
				return ['msg'=>'Student Absence Processed, Comment: '.$comment];
				
			default:
				return response('Unknown param ', 500);
		}
		return ['studentid'=>$id, 'userId'=>$request->input('userId'), 'param'=>$request->input('param')];
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
