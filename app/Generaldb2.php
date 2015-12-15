<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Generaldb2 extends Model
{
    //
	protected $connection = 'bbyArgus';
	protected $table = "generaldb2";
	
	public $timestamps = false;
	
	protected $hidden = [];
	
	protected $guarded =['id'];
	
	public function student(){
		return $this->belongsTo('App\Student', 'students_id', 'id' );
	}
	
	public function Teacher(){
		return $this->belongsTo('App\Teacher', 'teachers_id', 'id' );
	}
}
