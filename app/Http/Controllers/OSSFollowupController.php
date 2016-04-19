<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Ossactivity;
use App\Referrals;
use App\Useractions;
use Carbon\Carbon;
use DB;

class OSSFollowupController extends Controller
{

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $schoolId = $this->user->SchoolId;

        if ($request->has('roster')) {
            $ossFollowup = Referrals
                ::with('user', 'teacher', 'studentUser.student.counters', 'referralType', 'activity')
                ->ofSchoolId($schoolId)
                ->ofStatus(32)
                ->ofType(11)
                ->get();
        }else{
            return response(['msg'=>'unknown paramenters'],500);
        }

        return $ossFollowup;
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
    }

    /**
     * Display the specified resource.
     *
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
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
    {
        DB::beginTransaction();

        $msg = 'Meeting Info Updated';
        $referral = Referrals::find($id);
        $meetingaDate = new Carbon($request->DateOfSuspension);
        $suspensionDate = new Carbon($request->MeetingDate);
        $referral->update([
            'TeacherId' => $request->MeetingWithId,
            'ReferralTypeId' => 11,
            'Date' => $meetingaDate,
            'Time' => $request->MeetingTime,
            'NewDate' => $suspensionDate
        ]);
        $useraction = Useractions::create([
            'ActionDate'=>$referral->Date,
            'ActionByUserId' => $this->userId,
            'ActionToUserId' => $referral->StudentId,
            'Comment' => $request->Comment. '[ Parent Meeting Rescheduled for'.$meetingaDate->toDateString.'.]',
            'ActionType'=>90
        ]);

        //$referral = Referrals::find($id)->with('activity', 'referralType', 'studentUser.student.counters', 'teacher', 'user');

        return compact('msg', 'referral', 'useraction');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}