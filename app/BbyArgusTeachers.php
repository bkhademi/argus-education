<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class BbyArgusTeachers extends Model
{
    protected $connection = 'bbyArgus';
	
	protected $table = 'teachers';
	//
	public $timestamps = false;
	
	public function School(){
		return $this->belongsTo('App\BbyArgusSchool', 'schools_id');
	}
}
