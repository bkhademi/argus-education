<?php

use Illuminate\Database\Seeder;

use App\Schools;
use App\Rooms;

class EstacadoRoomsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $school = Schools::where('Name', 'Estacado High School')->first();
		
		//Rooms::truncate();
		$roomsJson = File::get(storage_path().'/jsondata/rooms.json');
		$rooms = json_decode($roomsJson);
		foreach($rooms as $room){
			Rooms::create(['SchoolId'=>$school->Id,'Name'=>$room->ROOM]);
		}
    }
}
