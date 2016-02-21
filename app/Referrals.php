<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Referrals extends Model
{
    //
    public $timestamps = true;

	protected $table = 'refferals';

	public $primaryKey = 'Id';
	
    protected $guarded  =  [];
	
	protected $hidden = ['ParentNotified', 'StudentNotified', 'created_at', 'updated_at'];

	// Eloquent relationship that says one user belongs to each time entry
    public function user()
    {
        return $this->belongsTo('App\User','UserId','id');
    }

	public function teacher()
    {
        return $this->belongsTo('App\User','TeacherId','id');
    }
    // Eloquent relationship that says one user belongs to each time entry
    public function studentUser()
    {
        return $this->belongsTo('App\User','StudentId','id');
    }
	
	public function assignment(){
		return $this->hasOne('App\Assignments',  'Id' ,'AssignmentId');
	}
	
	public function referralType(){
		return $this->hasOne('App\Referraltypes',  'Id' ,'ReferralTypeId');
	}
	
	public function period(){
		return $this->hasOne('App\Periods',  'Id' ,'PeriodId');
	}
	
	public function activity(){
		return $this->hasOne('App\Activities',  'Id' ,'ActivityTypeId');
	}
	
	public function overlapActivity(){
		return $this->hasOne('App\Activities', 'Id', 'OverlapId');
	}
	
	public function overlapAction(){
		return $this->hasOne('App\Activities', 'Id', 'OverlapActionId');
	}
	
	public function scopeofTypes($q, $types){
		return $q->whereIn('ReferralTypeId', $types);
	}
	public function scopenotOfTypes($q, $types){
		return $q->whereNotIn('ReferralTypeId', $types);
	}
	
	public function scopeofType($q, $type){
		return $q->where('ReferralTypeId',$type);
	}
	
	public function scopefrom($q,$date){
		return $q->where('Date',$date);
	}
	
	
	
	
}
