<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Rotationdays extends Model
{
    //
	protected $primaryKey = 'Id';
	public $timestamps = false;
	protected $guarded = [];
	
	public function day(){
		return $this->belongsTo('App\Days','DayId', 'Id');
	}
	
	public function activity(){
		return $this->belongsTo('App\Activities', 'ActivityId', 'Id');
	}
	
	public function group(){
		return $this->belongsTo('App\Groups', 'GroupId', 'Id');
	}
}
