<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Referralactions extends Model
{
	public $timestamps = false;
	protected $guarded = [];
	public $incrementing = false;

	public function userAction(){
		return $this->hasOne('App\Useractions','Id','ActivityId');
	}

}