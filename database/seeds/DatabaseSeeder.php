<?php

use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Model;
use App\User;
class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Model::unguard();

        // $this->call(UserTableSeeder::class);
        User::create(
                [
                    'username' => 'you',
                    'email' => 'you@you.com',
                    'passwordhash' => Hash::make('secret'),
                    'schoolid' => 1 
                ]
        );
        Model::reguard();
    }
}
