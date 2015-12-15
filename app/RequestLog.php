<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class RequestLog extends Model
{
	protected $connection = 'bbyArgus';
    
	protected $guarded = ['id'];
	
	public function school(){
		return $this->belongsTo('App\School', 'schools_id','id');
	}
}
