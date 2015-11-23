<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class BbyArgusSchool extends Model
{
    protected $connection = 'bbyArgus';
	
	protected $table = 'schools';
	
	public function teachers(){
		return $this->hasMany('App\BbyArgusTeachers');
	}
	public function students(){
		return $this->hasMany('App\BbyArgusStudents', 'schools_id');
	}
	//
}
