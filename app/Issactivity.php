<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Issactivity extends Model
{
     //
	public $timestamps = false;
	protected $guarded = [];
	public $primaryKey = 'Id';
	
	public function student(){
		return $this->hasOne('App\User','id','StudentId');
	}
}
