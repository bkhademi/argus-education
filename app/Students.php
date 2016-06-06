<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Students extends Model
{
	protected $table = 'students';
	protected $primaryKey = 'Id';
	protected $guarded = [];

	public $timestamps = false;
	public $incrementing = false;

	// Eloquent relationship that says one user belongs to each time entry
	public function classes()
	{// link not well established
		return $this->hasMany('App\ClassStudents', 'StudentId', 'Id');
	}

	//  get all the classsttudents for this user (many to many throurgh
	public function professorClasses()
	{
		return $this->hasManyThrough('App\ProfessorClasses','App\ClassStudents', 'StudentId', 'Id');
	}

	public function user()
	{
		return $this->belongsTo('App\User', 'Id');
	}

	public function aspAttendance()
	{
		return $this->hasMany('App\Aspattendance', 'StudentId', 'Id');
	}

	public function counters()
	{
		return $this->hasOne('App\Counters', 'Id', 'Id');
	}

	public function referred()
	{
		return $this->hasMany('App\Referrals', 'StudentId');
	}

	public function scopeofSchoolId($q, $schoolId)
	{
		return $q->whereHas('user', function ($q) use ($schoolId) {
			$q->where('SchoolId', $schoolId);
		});
	}


	public function scopeofTypesAndDate($q, $types, $date)
	{
		$q->whereHas('referred', function ($q) use ($date, $types) {
			$q->whereIn('ReferralTypeId', $types)
				->where('Date', $date);
		});
	}

	public function scopesortByUserProperty($q, $property, $direction)
	{
		$q->join('aspnetusers', 'aspnetusers.id', '=', 'students.Id')
			->orderBy($property, $direction)
			->select('students.*')
			->get();
	}

	public function scopeWithPeriodRoomsWherePeriodsIn($q, $periods)
	{
		$q->with(['classes' => function ($q) use ($periods) {
			$q->whereHas('professor_class', function ($q) use ($periods) {
				$q->whereIn('PeriodId', $periods);
			})->with('professor_class.room');
		}]);

	}

	public function scopewithReferralsFromDateWithAndWithout($q, $date, $includedReferralTypes, $excludedReferralTypes, $load,$sort)
	{
		$q->with(['referred' => function ($q) use ($date, $includedReferralTypes, $excludedReferralTypes, $load,$sort) {
			$q->where('Date', $date);
			if ($includedReferralTypes)
				$q->ofTypes($includedReferralTypes);
			if($excludedReferralTypes)
				$q->notOfTypes($excludedReferralTypes);
			if($sort)
				$q->sortByPriority();
			$q->with($load);
		}]);
	}

	public function scopeSortByLastName($q){
		return $q->join('aspnetusers', 'aspnetusers.id', '=', 'students.Id')
			->orderBy('LastName', 'ASC')
			->select('students.*');
	}

}
