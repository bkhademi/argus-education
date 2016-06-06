<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Oroomactivity extends Model
{
     //
	protected $guarded = [];
	public $primaryKey = 'Id';
	public $table = 'oroomactivity';
	
	public function student(){
		return $this->hasOne('App\User', 'id','StudentId');
	}
	public function teacher(){
		return $this->hasOne('App\User', 'id','SentOutById');
	}
	public function period(){
		return $this->hasOne('App\Periods', 'Id','PeriodId');
	}
	public function activity(){
		return $this->hasOne('App\Activities', 'Id','ActivityId');	
	}

	public function scopeOfSchoolId($q,$schoolId){
		$q->whereHas('student',function($q)use($schoolId){
			$q->where("SchoolId",$schoolId);
		});
	}
}
