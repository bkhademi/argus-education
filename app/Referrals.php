<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Referrals extends Model
{
    //
    public $timestamps = false;

	protected $table = 'refferals';

     protected $guarded  =  [];
    // protected $fillable = ['StudentId'];
    // protected $fillable = ['AssignmentId'];
    // protected $fillable = ['RefferalStatus'];
    // protected $fillable = ['Date'];
    // protected $fillable = ['ParentNotified'];
    // protected $fillable = ['StudentNotified'];

	// Eloquent relationship that says one user belongs to each time entry
    public function user()
    {
        return $this->belongsTo('App\User','UserId','id');
    }

    // Eloquent relationship that says one user belongs to each time entry
    public function studentUser()
    {
        return $this->belongsTo('App\User','StudentId','id');
    }
}
