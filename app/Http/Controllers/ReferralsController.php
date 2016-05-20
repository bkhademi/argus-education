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
use DB;
use Carbon\Carbon;

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

        if($request->has('list')){
            $schoolId = $this->user->SchoolId;
            $date = $this->getDate($request);
            $list = Students
                ::with('counters', 'user')
                ->withPeriodRoomsWherePeriodsIn($request->Periods)
                ->with(['referred' => function ($q) use ($date) {
                    $q
                        ->where('Date', $date)
                        ->with('user', 'teacher', 'referralType', 'assignment', 'activity','consequence.referralType',
                            'period')
                        ->sortByPriority();

                }])
                ->ofSchoolId( $schoolId)
                ->whereHas('counters', function ($q) {
                    //$q->where('ORoomsToBeServed', '>', 0);
                })
                ->whereHas('referred', function ($q) use ($date) { // not processed with oroom referrals for $date
                    $q
                        ->where('Date', $date)
                    ;
                })
                ->join('aspnetusers', 'aspnetusers.id', '=', 'students.Id')
                ->orderBy('LastName', 'ASC')
                ->select('students.*')
                ->get();
            return compact('list');
        }
        if ($request->has('StudentId')) {
            $studentId = $request->StudentId;
            $referrals = Referrals
                ::with('activity', 'studentUser', 'user', 'teacher', 'referralType')
                ->whereHas('studentUser', function ($q) use ($studentId) {
                    $q->where('id', $studentId);
                })
                ->ofStatus(0)
                ->where('Date', '>=',Carbon::today())
                ->get();
            return $referrals;
        }

        $userId = $this->getUserId($request);
        $schoolId = $this->user->SchoolId;
        $date = new Carbon();
        $referrals = Referrals::with('studentUser', 'assignment')->where('UserId', $userId)->orderBy('Date', 'desc')->get();

        $referrals = User
            ::with(['referred' => function ($query) use ($userId, $date) {
                $query->with('assignment', 'user.assignments')
                    ->where('refferals.UserId', $userId)
                    //->where('Date','>=',$date)
                    //->where('RefferalStatus',0)
                    //->OrWhere('RefferalStatus',2);
                ;
            }])
            ->where('SchoolId', $schoolId)
            ->with('student')
            ->whereHas('referred', function ($query) use ($userId, $date) {
                $query
                    ->where('refferals.UserId', $userId);
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
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
        $userId = $this->getUserId($request); // getUserId is in base controller
        $date = new \Carbon\Carbon($request->date);
        $dataIn = collect($request->data);


        error_log(print_R($dataIn[0], TRUE));
        error_log($dataIn->count());
        $created = 0;
        $updated = 0;
        for ($i = 0; $i < $dataIn->count(); $i++) {
            // check if the referral is already there
            // a referral is uniquely identified by 4 fields
            // (UserID, StudentId, AssignmentId, Date)
            $teacher = User::find($dataIn[$i]['TeacherId']);
            $assign = Assignments::find($dataIn[$i]['AssignmentId']);
            $referral = Referrals
                ::whereTeacherid($dataIn[$i]['TeacherId'])
                ->whereStudentid($dataIn[$i]['StudentId'])
                ->whereAssignmentid($dataIn[$i]['AssignmentId'])
                ->whereReferraltypeid(12)
                ->whereRefferalstatus(0)
                ->where('Date', $date)
                ->first();
            $action = Useractions::create([
                'ActionDate' => Carbon::today(),
                'ActionByUserId' => $dataIn[$i]['TeacherId'],
                'ActionToUserId' => $dataIn[$i]['StudentId'],
                'ActionType' => 48,
                'Comment' => 'Student Referred from teacher ' . $teacher->LastName . ', for assignment ' . $assign->Name . ', for date ' . $date->toDateString()
            ]);
            if (!$referral) {
                $created++;
                Referrals::create([
                        'UserId' => $this->userId,
                        'TeacherId' => $dataIn[$i]['TeacherId'],
                        'StudentId' => $dataIn[$i]['StudentId'],
                        'AssignmentId' => $dataIn[$i]['AssignmentId'],
                        'RefferalStatus' => $dataIn[$i]['RefferalStatus'],
                        'ReferralTypeId' => 12,
                        'Date' => $date,
                    ]
                );
            } else {
                $updated++;
                $referral->ParentNotified = $dataIn[$i]['ParentNotified'];
                $referral->StudentNotified = $dataIn[$i]['StudentNotified'];
                //$referral->RefferalStatus = $dateIn[$i]['ReferralStatus'];
                $referral->save();
            }
        }

        return ['Created' => $created, 'Updated' => $updated];
        // $referrals->save();
    }

    /**
     * Display the specified resource.
     *
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request, $id)
    {
        //

        $date = $id;
        $date = new \Carbon\Carbon($date);
        $schoolId = $this->user->SchoolId;
        // if using user authentication use that user id else use the url  encoded userid  "url/?userId=userid"

        $userId = isset($this->userId) ? $this->userId : $request->input('userId');
        $currentUser = User::find($userId);
        //$userId =  'fefdfc7c-8ce1-47a4-bb7c-f475ea116a0e';
        //$date  =  '2012-00-00 00:00:00';

        if ($request->has('absence')) {

            /* return  Referrals
              ::with('studentUser.student','assignment','user')
              ->where('Date', $date)
              ->where('RefferalStatus',4)
              ->get(); */
            return User::with(['referred' => function ($query) use ($userId, $date) {
                $query->with('assignment', 'user.assignments', 'teacher', 'overlapActivity', 'overlapAction')
                    ->where('RefferalStatus', 4);
            }])
                ->where('SchoolId', $schoolId)
                ->with('student')->whereHas('referred', function ($query) use ($userId, $date) {
                    $query
                        ->where('RefferalStatus', 4);
                })->get();
        }

        if (!$request->has('referral')) {

            $referrals = User
                ::with(['referred' => function ($query) use ($userId, $date) {
                    $query->with('assignment', 'teacher')
                        //->where('refferals.UserId',$userId)
                        ->where('Date', $date)
                        ->where('RefferalStatus', 0)
                        ->where('ReferralTypeId', 12);
                }])->with('student.counters')
                ->where('SchoolId', $schoolId)
                ->whereHas('referred', function ($query) use ($userId, $date) {
                    $query
                        //->where('refferals.UserId',$userId)
                        ->where('Date', $date)
                        ->where('RefferalStatus', 0)
                        ->where('ReferralTypeId', 12);
                })
                ->get();
        } else {

            $referrals = User
                ::with(['referrals' => function ($q) use ($date) {
                    $q->where('Date', $date)->with('studentUser', 'assignment');
                }], 'student')
                ->where('SchoolId', $currentUser->SchoolId)
                ->whereHas('roles', function ($q) {
                    $q->where('aspnetroles.Name', 'teacher');
                })
                ->whereHas('referrals', function ($q) use ($userId, $date) {
                    $q->where('Date', $date)
                        ->where('ReferralTypeId', 12);
                })->get();

//		$referrals = Referrals::with(['studentUser.referred'=>function($q){
//		}])->select('StudentId')->distinct()->where("Date",$date);
//		$referrals = $referrals->addSelect('UserId')->get()->load('user');
//		
//		$referrals = Referrals::with('user')->select('UserId')->distinct()->where("Date",$date);
//		$referrals = $referrals->addSelect('StudentId')->get()->load('studentUser.referred');
        }

        return $referrals;
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {   ///////////////////////////////////////
        /////////////////////////////
        $param = $request->input('param');

        error_log($param);


        switch ($param) {
            case 'present':
                $referral = Referrals::with('assignment')->findOrFail($id);
                $action = Useractions::create([
                    'ActionDate' => Carbon::today(),
                    'ActionByUserId' => $this->userId,
                    'ActionToUserId' => $referral->StudentId,
                    'ActionType' => 49,
                    'Comment' => 'student was present for assignment ' . $referral->assignment->Name . ' on ' . Carbon::now(),
                    'ParentNotified' => $request->data['ParentNotified'],
                    'StudentNotified' => $request->data['StudentNotified'], 'Completed' => $request->Completed
                ]);
                // update the assignments for which the student was present.
                // move the others to the next day- no, frontend sends requests for that,,
                $status = $request->input('Completed') ? 1 : 0;
                $Reprint = $request->input('Reprint') ? 1 : 0;
                $referral->update(['RefferalStatus' => $status, 'Reprint' => $Reprint]);
                if (!$request->input('Completed')) {// not completed, reschedule to next day
                    $referral->update(['Date' => Carbon::tomorrow()]);
                    $action->update(['Comment' => "Student didn't complete assignment " . $referral->assignment->Name . " , Rescheduling for Next Day"]);
                    return ['msg' => 'student didnt completed this assignent ' . $referral->assignment->Name];
                }
                return ['msg' => 'present  student'];

            case 'reschedule':
                $referral = Referrals::with('assignment')->findOrFail($id);
                $newDate = new Carbon($request->newDate);
                $action = Useractions::create(['ActionDate' => Carbon::today(),
                    'ActionByUserId' => $this->userId,
                    'ActionToUserId' => $referral->StudentId,
                    'ActionType' => 50,
                    //'Comment'=>'Student was Rescheduled from '.$request->oldDate.' to '.$request->newDate,
                    'Comment' => $request->comment,
                    'ParentNotified' => $request->data['ParentNotified'],
                    'StudentNotified' => $request->data['StudentNotified'],
                    'Excused' => $request->excused ? 1 : 0
                ]);
                $referral->update(['Date' => $newDate]);
                if ($request->input('comment') === 'Parent Requested Reschedule') {
                    $action->update(['comment' => $action->comment . 'Parent Requested Rescheduling']);
                    return ['msg' => 'parent requested rescheduling the student'];
                }
                return ['msg' => 'rescheduling the student'];
            case 'clear':
                $referral = Referrals::whereIn('Id', $request->ReferralIds);
                $referral->update(['RefferalStatus' => 3]);
                $action = Useractions::create(['ActionDate' => Carbon::today(),
                    'ActionByUserId' => $this->userId,
                    'ActionToUserId' => $request->student['id'],
                    'ActionType' => 51,
                    'Comment' => $request->comment,
                    'ParentNotified' => $request->data['ParentNotified'],
                    'StudentNotified' => $request->data['StudentNotified'],
                    'Completed' => 1]);

                return ['msg' => 'clearing the student', 'referrals' => $referral->get()];
            case 'teacherUpdate': // Not used in this 1st version
                $referral = Referrals::with('assignment')->findOrFail($id);
                $referral = $request->data;
                $accepted = $referral['Accepted'] ? 1 : 0;
                $status = $accepted ? 3 : 2;
                $reason = $referral['Reason']['value'];
                $update = ['RefferalStatus' => $status, 'Accepted' => $accepted,
                    'RejectedComment' => $referral['RejectedComment'], "Reason" => $reason];
                Referrals::where('Id', $id)->update($update);
                // check if the refferral was not accepted reschedule
                if (!$accepted) {
                    // check next day available,, for now reschedue for next day

                    Referrals::where('Id', $id)->update(['Date' => Carbon::tomorrow()]);
                }
                return ['msg' => 'Teacher Updating the  referral'];
            case 'absent': // used for students left when finish button is pressed

                $date = new Carbon($request->Date);
                $referral = Referrals::with('assignment')->findOrFail($id);
                $action = Useractions::create([
                    'ActionDate' => $date,
                    'ActionByUserId' => $this->userId,
                    'ActionToUserId' => $referral->StudentId,
                    'ActionType' => 58,
                    'Comment' => 'Student Was Absent For AEC on , moving to AEC followup List' . $date,
                ]);
                $status = 4;
                $referral->update(['RefferalStatus' => $status
                    //, 'Date' => Carbon::tomorrow()
                ]);
                $msg = 'Student was Absent, moving to Absent List  ';
                return compact('msg');
            case 'AbsentComment':
                $status = 0; // so it doesnt appear on absence list
                $comment = $request->comment;
                $absenceStatus = $request->status;
                $action = Useractions::create([
                    'AbsenceStatus' => $absenceStatus,
                    'ActionDate' => Carbon::today(),
                    'ActionByUserId' => $this->userId,
                    'ActionToUserId' => $id,
                    'ActionType' => 5,
                    'Comment' => $comment,
                    'ParentNotified' => $request->data['ParentNotified'] ? 1 : 0,
                    'StudentNotified' => $request->data['StudentNotified'] ? 1 : 0]);

                $referrals = Referrals
                    ::where('StudentId', $id)
                    ->where('RefferalStatus', 4)
                    ->update(['RefferalStatus' => $status]);
                return ['msg' => 'Student Absence Processed, Comment: ' . $comment];
            case 'ClearStudent':
                // register act
                $useraction = Useractions::create([
                    'ActionDate' => Carbon::today(),
                    'ActionByUserId' => $this->userId,
                    'ActionType' => 92, // Cleared Referrals
                    'ActionToUserId' => $request->StudentId,
                    'Comment' => $request->Comment . ""
                ]);
                $toRemoveReferrals = $request->ToRemoveReferralIds;
                $result = Referrals::decreaseCountersAndRemoveReferrals($toRemoveReferrals, $request->StudentId);

                $msg = 'Successfully Deleted ' . count($toRemoveReferrals) . ' from student';
                return compact('msg');
            default:
                return response('Unknown param ', 500);
        }
        return ['studentid' => $id, 'userId' => $request->input('userId'), 'param' => $request->input('param')];
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id, Request $request)
    {


    }

}
