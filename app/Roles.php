<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Roles extends Model
{
    //
	protected $table = 'aspnetroles';
	
	protected $guarded = [];
	
	//public $primaryKey = 'Id';
	
	public $timestamps = false;
}
