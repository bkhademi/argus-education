<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class BbyArgusStudents extends Model
{
    protected $connection = 'bbyArgus';
	
	protected $table = 'students';
	
	public $timestamps = false;
    
	protected $guarded = ['id'];
	
	public function school(){
		return $this->belongsTo('App\BbyArgusSchool', 'schools_id');
	}
	
	public function generaldb(){
		return $this->hasOne('App\BbyArgusGeneralDB', 'students_id');
	}
	public function generaldb2(){
		return $this->hasMany('App\BbyArgusGeneralDB2', 'students_id');
	}
}
