<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Generaldb extends Model
{
    //
	protected $connection = 'bbyArgus';
	protected $table =  "generaldb";
	
	protected $hidden = [];
	
	public $timestamps = false;
	
	public function student(){
		return $this->belongsTo('App\Student', 'students_id', 'id' );
	}
	
	protected $guarded =['id'];
	
}
