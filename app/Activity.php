<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Activity extends Model
{
    //
	protected $connection = 'bbyArgus';
	protected $guarded =['id'];
	protected $table =  "activities";
	
	public $timestamps = true;
	
	public function student(){
		return $this->belongsTo('App\Student', 'students_id');
	}
}
