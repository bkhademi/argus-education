<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Activities extends Model
{
    //
	protected $guarded = [];
	
	public $primaryKey = 'Id';
	
	public $timestamps = false;
}
