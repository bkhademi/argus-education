<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Schools extends Model
{
    //
    /**
     * The database table used by the model.
     *
     * @var string
     */
	public static $estacadoSchoolId = 1;
	public static $dunbarSchoolId =2;
	public static $ervinSchoolId = 3;
	public static $adrianSchoolId = 4;
	public static $aldersonSchoolId = 5;

    protected $table = 'schools';

    /**
	 * The primary key of this model's table
	 * @var string
	 */
	 protected $primaryKey = 'Id';
	 
	
    
}
