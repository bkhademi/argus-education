<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Classes extends Model
{
    //
	  //
    public function student(){
        return $this->belongsTo('App\Students','StudentId', 'Id' );
    }
}
