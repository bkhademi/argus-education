<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class School extends Model
{
	protected $connection = 'bbyArgus';	

	public $timestamps = false;
	
	protected $guarded = ['id'];
	
	public function teachers(){
		return $this->hasMany('App\Teacher');
	}
	public function students(){
		return $this->hasMany('App\Student', 'schools_id');
	}
}
