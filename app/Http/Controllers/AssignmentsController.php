<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use File;
use Storage;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Input;

use App\Assignments;
use App\Blobreferences;
use App\Professorclasses;




class AssignmentsController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $userId = isset($this->userId)? $this->userId : $request->input('userId') ;
		if($request->has('teacherId')){
			// if teacherId passed then grab only the content of the Assignments Table
			// dont check if the file exists
			$userId = $request->input('teacherId');
			return Assignments::with('teacher')->whereTeacherid($userId)->get();
		}
      //  $userFolder = "UsersFiles/$userId/";
    
///        $files = Storage::allFiles($userFolder);
   //     if(!$files)
     //       return response()->json(["no_files_found_for_'".$user->FirstName.' '.$user->LastName."'"], 404);
       
        //return $files;
        
        
        $assignments = Assignments::where('TeacherId', $userId)->get();
		return $assignments;
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)//works
    {
        $userId = $this->getUserId($request);
        $file = Input::file('file');
        
         if(!$file){
			// a file was not posted.. check if an assignment name was posted
			if($request->has('assignment')){
				// an assignment was posted.. only save its name 
				$teacher = $request->input('teacher');
				$teacherId = $teacher['id'];
				//get the classes the current professor is teaching
				$defaultProfessorClass = Professorclasses::where('UserId',$teacherId)->first();
				$assignment = Assignments::create(['Name'=>$request->input('assignment')['assignment'], 'TeacherId'=>$teacherId, 'ProfessorClassId'=>$defaultProfessorClass->Id]);
				return ["message"=>'assignment was saved with teachername '.$teacher['FirstName']."  ".$teacher['LastName'], "assignment"=>$assignment];
				
			}
            return response()->json(["no_file_posted"],500);
		} 
        
        $extension = $file->getClientOriginalExtension();
        $filePath = "UsersFiles/$userId/";
        $fileName = $file->getClientOriginalName();
        $fileMimeType = $file->getClientMimeType();
        
        //get the classes the current professor is teaching
        $defaultProfessorClass = Professorclasses::where('UserId',$userId)->first();
       
        // store the  filename on the assignments table
        
        // check if there is already an assignment with the same name
        $assignment = Assignments::where('name', $fileName)->first();
        if(!$assignment){
            $assignId = Assignments::insertGetId(['Name'=>$fileName,'TeacherId'=>$userId , 'ProfessorClassId'=>$defaultProfessorClass->Id]);
            
        }else{
            $assignId = $assignment->Id;
        }
        
        //store filename with path on the blobReference table
        $blobReference = BlobReferences::where('Reference', $filePath.$fileName)->first();
        if(!$blobReference)
            Blobreferences::insert(['Reference'=>$filePath.$fileName, 'Assignment_Id'=>$assignId]);
        
        
        Storage::disk('local')->put($filePath.$fileName, File::get($file));
        
        return [ 'extension'=>$extension , 'filename'=> $file->getFilename(),'mime'=>$fileMimeType,  'originalFileName'=>$fileName];
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $userId = $this->userId;
        
        $file = Assignments::where('name',$id)->first();
        if(!$file)
            return response()->json(['file_not_found'], 404);
        $filePath = $file->reference()->first()->Reference;
        
        $file = Storage::disk('local')->get($filePath);
        return (new Response($file, 200))->header('Content-Type','application/pdf');
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
		return 'not Implemented';
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $userId = $this->userId;
        /*Missing*/
        // code for deleting the corresponing entries in assignments and blobreferences
        
        $filePath = "UsersFiles/$userId/";
        $exist = Storage::disk('local')->exists($filePath.$id);
        
        if(!$exist){
            return response("error, file not found", 404);
        }
        
        $result = Storage::delete($filePath.$id);
       
        return $result? 'true':'false';
    }
}
