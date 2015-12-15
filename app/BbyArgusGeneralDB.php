<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class BbyArgusGeneralDB extends Model
{
	protected $connection = 'bbyArgus';
	
	
	protected $hidden = [];
	
	protected $table = 'generaldb';
	
	public $timestamps = false;
	
	public function student(){
		return $this->belongsTo('App\BbyArgusStudents', 'students_id', 'id' );
	}
	
	protected $guarded =['id'];
}
