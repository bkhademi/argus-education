<?php

namespace App;

use Illuminate\Auth\Authenticatable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Auth\Passwords\CanResetPassword;
use Illuminate\Foundation\Auth\Access\Authorizable;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Illuminate\Contracts\Auth\CanResetPassword as CanResetPasswordContract;

class User extends Model implements AuthenticatableContract,
                                    AuthorizableContract,
                                    CanResetPasswordContract
{
    use Authenticatable, Authorizable, CanResetPassword;

    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'aspnetusers';
	
	/**
	 * The primary key of this model's table
	 * @var string
	 */
	 protected $primaryKey = 'id';
	 
	  /**
     * Indicates if the model should  be timestamped.
     *
     * @var bool
     */
    public $timestamps = false;
	

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['name', 'email', 'password'];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = ['password','EmailConfirmed','IntroStep', 'SecurityStamp','TwoFactorEnabled','PhoneNumberConfirmed', 'LockoutEndDateUtc', 'LockoutEnabled', 'AccessFailedCount', ];
    
    // many to one
    public function school(){
        $this->belongsTo('App\Schools',  'SchoolId');
    }
    
    // get all the roles this user might have (many to many)
    public function roles(){
        return $this->belongsToMany('App\roles', 'aspnetuserroles', 'UserId', 'RoleId');
    }
    
    //  get all the classsttudents for this user (many to many throurgh
    public function classStudents(){
        return $this->hasManyThrough( 'App\Classstudents', 'App\Professorclasses','UserId', 'ProfessorClassId');
    }
    
    // get all classes this user may have
    public function classes(){
        return $this->belongsToMany('App\Classes', 'professorclasses', 'UserId', 'ClassId' );
    }
    
    // get all assignments froma teacher 
    public function assignments(){
        return $this->hasMany('App\Assignments', 'TeacherId');
    }
    
    public function referrals(){
        return $this->hasMany('App\referrals', 'UserId');
    }
    
  
    
}
