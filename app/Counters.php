<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Counters extends Model
{
    //
	public $incrementing = false;
	public $timestamps = false;
	public $guarded =[];
	protected $primaryKey = 'Id';
}
