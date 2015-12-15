<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Teacher extends Model
{
    //
	protected $connection = 'bbyArgus';		
	public $timestamps = false;
	
	public function School(){
		return $this->belongsTo('App\School', 'schools_id');
	}
}
