<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Oroomactivity;
use App\Referrals;
use App\Useractions;
use App\Counters;
use App\Activities;
use Carbon\Carbon;
use DB;
use App\Referraltypes;
use App\Students;
use App\Referralconsequences;


class ISSFollowupController extends Controller
{
    public function index(Request $request){
        $schoolId = $this->user->SchoolId;

        if($request->has('roster')){
            $iss = Referrals::with('user', 'studentUser.student.counters', 'studentUser.student.classes.professor_class.room', 'teacher', 'referralType', 'activity')
//			->where('Date', $date)
                ->wherehas('studentUser', function ($q) use ($schoolId) {
                    $q->where('SchoolId', $schoolId);
                })
                //->whereIn('ReferralTypeId', [7, 5, 6, 17, 10])
                ->where('RefferalStatus', 16)
                ->get();

        }


        if($request->has('count')){
            $iss = $iss->count();
        }
        return $iss;
    }

    public function store(Request $request){

    }

    public function show(Request $request){

    }

    public function update(Request $request,$id){
        $schoolId = $this->user->SchoolId;
        $studentId = $request->StudentId;
        $referral = Referrals::findOrFail($id);

        $today = new Carbon($referral->Date);
        if($today->eq(Carbon::today())){
            $tomorrow= Carbon::today()->addWeekDay();
        }else if($today->lt(Carbon::today())){
            $tomorrow = Carbon::today();
        }else{
            $tomorrow = $today->copy()->addWeekDay();
        }

        $action = Useractions::create([
            'ActionDate'=>$referral->Date,
            'ActionByUserId' => $this->userId,
            'ActionToUserId' => $studentId,
            'Comment' => $request->Comment
        ]);
        $counters = Counters::findOrFail($studentId);

        switch($request->param){
            case 'reassign':
                $msg = 'Reassigning student for ISS today';

                $action->update(['ActionType'=>86]);// ISS : Reassign
                if($today->ne(Carbon::today())) {// doing followup in another day.. make a duplicate
                    $referralCopy = $referral->replicate();
                    $referralCopy->save();
                    $referralCopy->update(['created_at' => $referral->created_at, 'Date' => $tomorrow, 'RefferalStatus' => 0, 'ActivityTypeId' => 0]);
                    $referral->update(['ActivityTypeId' => 86, 'RefferalStatus' => 1]); // ISS : Reassign // remove from followup
                }else{
                    $referral->update(['ActivityTypeId'=>0, 'ReferralStatus'=>0]);// modify the same one to be re modified again
                }
                break;
            case 'oss':
                $msg = 'Assigning  student to OSS';
                $action->update(['ActionType'=>46,
                    'Comment'=>$action->Comment. '[Parent Meeting on  '.$request->MeetingDate.'. at '.$request->MeetingTime.
                        ', Suspended from '.$request->DateOfSuspensionStart.' To '.$request->DateOfSuspensionEnd.'   (System)]']);// ISS -> OSS



                $referralCopy = $referral->replicate();
                $referralCopy->save();
                $referralCopy->update(['created_at'=>$referral->created_at, 'Date'=>$tomorrow, 'RefferalStatus'=>0, 'ActivityTypeId'=>0]);
                $referral->update([ 'RefferalStatus'=>1]); // ISS -> OSS // remove from followup

                $dateOfSuspensionStart = new Carbon($request->DateOfSuspensionStart);
                $dateOfSuspensionEnd = new Carbon($request->DateOfSuspensionEnd);
                $meetingDate = new Carbon($request->MeetingDate);

                $consequence = Referrals::create([
                    'UserId' => $this->userId,
                    'StudentId' => $referral->StudentId,
                    'TeacherId' => $request->MeetingWithId,
                    'ReferralTypeId' => 11,
                    'Date' => $dateOfSuspensionStart,
                    'DateEnd'=>$dateOfSuspensionEnd,
                    'Time' => $request->MeetingTime,
                    'NewDate'=> $meetingDate
                ]);
                $referral->update(['ConsequenceId'=>$consequence->Id]);
                $counters->increment('OSSReferral');
                $counters->increment('OSSPMP');
                $counters->increment('Cycles');
                $counters->save();
                break;
            case 'clear':
                $msg = 'Clear student from ISS';
                $action->update(['ActionType'=>87]);// ISS : clear
                $referral->update(['ActivityTypeId'=>87,'RefferalStatus'=>1]);// ISS : clear// remove from followup
                $counters->decrement('ISSDays');
                break;
            default:
                return response(['msg'=>'Invalid Paramenter '. $request->param],500);
        }
        $action->load('activity');
        return compact('msg','action','consequence','counters', 'referral', 'referralCopy');
    }

    public function destroy(Request $request){

    }

    private function MovePendingReferralsAndLeaveACopy($ref, $startDate, $endDate, $studentId){

    }
}