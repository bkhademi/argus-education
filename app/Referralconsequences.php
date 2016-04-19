<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Referralconsequences extends Model
{
	public $timestamps = false;
	protected $guarded = [];

	public function referral(){
		return $this->hasOne('App\Referrals','Id','ReferralId');
	}
	public function consequence(){
		return $this->hasOne('App\Referrals','Id','ConsequenceId');
	}

}