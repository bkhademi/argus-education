<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
	
	protected $connection = 'bbyArgus';
	public $timestamps = false;
    
	protected $guarded = ['id'];
	
	public function school(){
		return $this->belongsTo('App\School', 'schools_id');
	}
	
	public function gendb(){
		return $this->hasOne('App\Generaldb', 'students_id');
	}
	public function generaldb2(){
		return $this->hasMany('App\Generaldb2', 'students_id');
	}
}
