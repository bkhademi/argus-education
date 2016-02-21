<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Studentgroups extends Model
{
    //
	protected $primaryKey = 'Id';
	public $timestamps = false;
	protected $guarded = ['Id'];
	public $incrementing = false;
	
	public function student(){
		return $this->belongsTo('App\Students', 'StudentId', 'Id');
	}
	
	public function group(){
		return $this->belongsTo('App\Groups', 'GroupId', 'Id');
	}
	
	
}
