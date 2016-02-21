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
        return $this->hasMany('App\ClassStudents','StudentId','Id');
    }
	
	//  get all the classsttudents for this user (many to many throurgh
    public function professorClasses(){
        return $this->hasManyThrough( 'App\ClassStudents','App\ProfessorClasses',  'Id',  'ProfessorClassId');
    }

    public function user(){
        return $this->belongsTo('App\User', 'Id');
    }
	
	public function aspAttendance(){
		return $this->hasMany('App\Aspattendance','StudentId','Id');
	}
	
	public function counters(){
		return $this->hasOne('App\Counters', 'Id', 'Id');
	}
	public function referred(){
		return $this->hasMany('App\Referrals', 'StudentId');
	}
	
	
}
