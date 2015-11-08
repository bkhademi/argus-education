<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Students extends Model
{
	protected $table = 'students';
    // Eloquent relationship that says one user belongs to each time entry
    public function classes()
    {
        return $this->belongsTo('App\Professorclasses','ProfessorClass_Id','Id');
    }

    public function user(){
        return $this->belongsTo('App\User', 'Id');
    }
}
