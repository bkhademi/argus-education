<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Aspattendance extends Model
{
    //
	protected $primaryKey = 'Id';
	public $timestamps = false;
	protected $guarded = [];
	public $incrementing = false;
	
	public function student(){
		return $this->belongsTo('App\Students', 'StudentId', 'Id');
	}
}
