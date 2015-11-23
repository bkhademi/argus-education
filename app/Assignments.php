<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Assignments extends Model
{
    //
	protected $guarded = [];
	
	public $primaryKey = 'Id';
	
	public $timestamps = false;
    public function reference(){
        return $this->hasMany('App\Blobreferences', 'Assignment_Id', 'Id');
    }
	
	public function teacher(){
		return $this->belongsTo('App\User', 'id', 'TeacherId');
	}
}
