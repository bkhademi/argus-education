<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Useractions extends Model
{
    //
	public $guarded = [];
	public $timestamps = false;
	public $primaryKey = 'Id';
	public function student(){
		return $this->belongsTo('App\User', 'ActionToUserId');	
	}
	
	public function user(){
		return $this->belongsTo('App\User', 'ActionByUserId');	
	}
}
