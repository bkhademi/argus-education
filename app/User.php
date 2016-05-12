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
	 public $incrementing = false;
	  /**
     * Indicates if the model should  be timestamped.
     *
     * @var bool
     */
    public $timestamps = false;


    protected $appends = ['Name'];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $guarded = [];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = ['password','EmailConfirmed',
        'IntroStep', 'SecurityStamp','TwoFactorEnabled',
        'PhoneNumberConfirmed', 'LockoutEndDateUtc',
        'LockoutEnabled', 'AccessFailedCount', 'email',
        'BirthDate', 'Ethnicity', 'Hometown', 'Gender', 'PhoneNumber'
    ];
    
    // many to one
    public function school(){
        return $this->belongsTo('App\Schools',  'SchoolId', 'Id');
    }
    
    // get all the roles this user might have (many to many)
    public function roles(){
        return $this->belongsToMany('App\Roles', 'aspnetuserroles', 'UserId', 'RoleId');
    }
    
    //  get all the classsttudents for this user (many to many throurgh
    public function classStudents(){
        return $this->hasManyThrough( 'App\Classstudents', 'App\Professorclasses','UserId', 'ProfessorClassId');
    }
    
	public function student(){
		return $this->hasOne('App\Students', 'Id', 'id');
	}
	
    // get all classes this user may have
    public function classes(){
        return $this->belongsToMany('App\Classes', 'professorclasses', 'UserId', 'ClassId' );
    }

	public function professorClasses(){
		return $this->hasMany('App\Professorclasses','UserId');
	}

    // get all assignments from a teacher 
    public function assignments(){
        return $this->hasMany('App\Assignments', 'TeacherId');
    }
    
	// get all referrals from a teacher  or user
    public function referrals(){
        return $this->hasMany('App\Referrals', 'UserId');
    }
    
	// get all referrals made to a student 
	public function referred(){
		return $this->hasMany('App\Referrals', 'StudentId');
	}
    
	// where this user Id is in ActionByUserId field
	public function activitiesCaused(){
		return $this->hasMany('App\Useractions', 'ActionByUserId');
	}
	
	// where this user Id is in the actionToUserId field
	public function activitiesAffected(){
		return $this->hasMany('App\Useractions', 'ActionToUserId');
	}

    public function getNameAttribute(){
        return " $this->FirstName  $this->LastName ";
    }

}
