<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Rooms extends Model
{
    //
	public $timestamps = false;
	
	protected $guarded = [];
	
	public $primaryKey = 'Id';
	
	
}
