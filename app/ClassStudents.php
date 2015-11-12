<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Classstudents extends Model
{
    //
	protected $primarykey = 'Id';
    public function user(){
        return $this->belongsTo('App\User', 'StudentId');
    }
}
