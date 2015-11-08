<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Assignments extends Model
{
    //
    public function reference(){
        return $this->hasMany('App\Blobreferences', 'Assignment_Id', 'Id');
    }
}
