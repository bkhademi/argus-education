<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Useractions extends Model
{
    //
	public $guarded = [];
	public $timestamps = true;
	public $primaryKey = 'Id';
	public function student(){
		return $this->belongsTo('App\User', 'ActionToUserId');	
	}
	
	public function user(){
		return $this->belongsTo('App\User', 'ActionByUserId');	
	}
	public function activity(){
		return $this->hasOne('App\Activities',  'Id' ,'ActionType');
	}

	public function scopeofSchoolId($q,$schoolId){
		$q->whereHas('student',function($q)use($schoolId){
			$q->where('SchoolId',$schoolId);
		});
	}
}
