<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Referrals extends Model
{
	//
	public $timestamps = true;

	public static $oroomReferralTypes = [1, 2, 3, 16, 19];
	public static $issReferralTypes = [5, 6, 7, 10, 15, 17];
	public static $ossReferralType = [11];
	public static $aecReferralType = [12];
	public static $reteachReferralType = [18];
	public static $lunchReferralType = [9];
	public static $attendanceNotTakenStatus = 0;

	protected $table = 'refferals';

	public $primaryKey = 'Id';

	protected $guarded = [];

	protected $hidden = ['ParentNotified', 'StudentNotified'];

	protected $casts = ['AssignmentCompleted' => 'boolean', 'HasFolder' => 'boolean', 'Excused' => 'boolean'];

	// Eloquent relationship that says one user belongs to each time entry
	public function user()
	{
		return $this->belongsTo('App\User', 'UserId', 'id');
	}

	public function teacher()
	{
		return $this->belongsTo('App\User', 'TeacherId', 'id');
	}

	// Eloquent relationship that says one user belongs to each time entry
	public function studentUser()
	{
		return $this->belongsTo('App\User', 'StudentId', 'id');
	}

	public function assignment()
	{
		return $this->hasOne('App\Assignments', 'Id', 'AssignmentId');
	}

	public function referralType()
	{
		return $this->hasOne('App\Referraltypes', 'Id', 'ReferralTypeId');
	}

	public function consequence()
	{
		return $this->hasOne('App\Referrals', 'Id', 'ConsequenceId');
	}

	public function period()
	{
		return $this->hasOne('App\Periods', 'Id', 'PeriodId');
	}

	public function activity()
	{
		return $this->hasOne('App\Activities', 'Id', 'ActivityTypeId');
	}

	public function overlapActivity()
	{
		return $this->hasOne('App\Activities', 'Id', 'OverlapId');
	}

	public function overlapAction()
	{
		return $this->hasOne('App\Activities', 'Id', 'OverlapActionId');
	}

	public function actions(){
		return $this->hasMany('App\Referralactions','ReferralId', 'Id');
	}

	public function scopeofTypes($q, $types)
	{
		return $q->whereIn('ReferralTypeId', $types);
	}

	public function scopenotOfTypes($q, $types)
	{
		return $q->whereNotIn('ReferralTypeId', $types);
	}

	public function scopeofType($q, $type)
	{
		return $q->where('ReferralTypeId', $type);
	}

	public function scopefrom($q, $date)
	{
		return $q->where('Date', $date);
	}

	public function scopeofStatus($q, $status)
	{
		return $q->where('RefferalStatus', $status);
	}

	public function scopeofSchoolId($q, $schoolId)
	{
		return $q->whereHas('studentUser', function ($q) use ($schoolId) {
			$q->where('SchoolId', $schoolId);
		});
	}

	public function scopehasReferralsOfTypes($q, $types)
	{

	}

	public function scopesortByPriority($q)
	{
		return $q
			->join('referraltypes', 'referraltypes.id', '=', 'ReferralTypeId')
			->orderBy('Priority', 'ASC')
			->select('refferals.*');
	}

	public static function decreaseCountersAndRemoveReferrals($list, $studentId)
	{
		$refs = static::whereIn('Id', $list)->get();

		// FIND OUT HOW MANY OF EACH REFERRAL WERE REMOVED
		$removeCounters = ['oroom' => 0, 'iss' => 0, 'oss' => 0, 'aec' => 0, 'reteach' => 0, 'lunch' => 0];
		foreach ($refs as $ref) {
			if (in_array($ref->ReferralTypeId, static::$oroomReferralTypes)) {
				$removeCounters['oroom']++;
			} else if (in_array($ref->ReferralTypeId, static::$issReferralTypes)) {
				$removeCounters['iss']++;
			} else if (in_array($ref->ReferralTypeId, static::$ossReferralType)) {
				$removeCounters['oss']++;
			} else if (in_array($ref->ReferralTypeId, static::$aecReferralType)) {
				$removeCounters['aec']++;
			} else if (in_array($ref->ReferralTypeId, static::$reteachReferralType)) {
				$removeCounters['reteach']++;
			} else if (in_array($ref->ReferralTypeId, static::$lunchReferralType)) {
				$removeCounters['lunch']++;
			}

		}

		$counters = Counters::find($studentId);
		$counters->decrement('LunchDetentionsToBeServed', $removeCounters['lunch']);
		$counters->decrement('ORoomsToBeServed', $removeCounters['oroom']);
		$counters->decrement('ISSDays', $removeCounters['iss']);
		$counters->decrement('OSSPMP', $removeCounters['oss']);
		$counters->save();

		// remove referrals from $list ids
		self::destroy($list);

	}

	public static function getReferralsWithNoOverlaps($studentsWithReferrals, $referralTypeIdsofOverlapsToRemove)
	{
		$refsWithNoOverlaps = $studentsWithReferrals->reject(function ($student) use ($referralTypeIdsofOverlapsToRemove) {
			// filter referrals to get only passed Referrals
			$student->referred = $student->referred->filter(function ($item) use ($referralTypeIdsofOverlapsToRemove) {
				$referrals = collect($referralTypeIdsofOverlapsToRemove);
				$clearStatuses = collect([87]);
				// true if  is iss referral && is not cleared (has valid Overlap)
				return $referrals->contains($item->ReferralTypeId) && !$clearStatuses->contains($item->ActivityTypeId);
			});

			return $student->referred->count() > 0;
		});
		return $refsWithNoOverlaps;
	}



}
