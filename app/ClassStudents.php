<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Classstudents extends Model
{
    
	protected $primarykey = 'Id';
	public $timestamps = false;
	public $guarded = [];
	
    public function user(){
        return $this->belongsTo('App\User', 'StudentId');
    }
}
