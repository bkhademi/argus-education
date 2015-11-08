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

    public function school(){
        $this->belongsTo('App\Schools',  'SchoolId','id');
    }
    
    public function role(){
        return $this->belongsToMany('App\Userroles');
    }
    
    public function classStudents(){
        return $this->hasManyThrough( 'App\Classstudents', 'App\Professorclasses','UserId', 'ProfessorClassId');
    }

    public function studentInfo(){
        $this->hasOne('App\Students', 'Id', 'id');
    }
}
