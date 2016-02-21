<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Periods extends Model
{
    //
	public $table='periods';
	
	public $primaryKey='Id';
	
	public function school(){
        return $this->belongsTo('App\Schools',  'SchoolId', 'Id');
	}
	
}
