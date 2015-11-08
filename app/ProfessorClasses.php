<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Professorclasses extends Model
{
    protected $table = 'professorclasses';

    // Eloquent relationship that says one user belongs to each time entry
    // public function user()
    // {
    //     return $this->belongsTo('App\User','UserId','Id');
    // }
    //
    public function user(){
        return $this->belongsTo('App\User', 'UserId');
    }
    public function period(){
        return $this->belongsTo('App\Periods', 'PeriodId');
    }
    
    public function room(){
        return $this->belongsTo('App\Rooms', 'RoomId');
    }
    
    public function classs(){
        return $this->belongsTo('App\Classes', 'ClassId');
    }
    
    public function classStudents(){
        return $this->hasMany('App\Classstudents', 'ProfessorClassId', 'Id');
    }
    
    public function students(){
        return $this->hasMany('App\students', 'ProfessorClass_Id','Id');
    }
    
}
