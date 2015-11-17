<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Students extends Model
{
	protected $table = 'students';
	protected $primaryKey = 'Id';
	protected $guarded = [];
	
	public $timestamps = false;
	
    // Eloquent relationship that says one user belongs to each time entry
    public function classes()
    {// link not well established
        return $this->belongsTo('App\Professorclasses','ProfessorClass_Id','Id');
    }
	
	//  get all the classsttudents for this user (many to many throurgh
    public function professorClasses(){
        return $this->hasManyThrough( 'App\ClassStudents','App\ProfessorClasses',  'Id',  'ProfessorClassId');
    }

    public function user(){
        return $this->belongsTo('App\User', 'Id');
    }
}
