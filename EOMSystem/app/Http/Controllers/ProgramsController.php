<?php

namespace App\Http\Controllers;

use App\Models\Program;
use App\Models\member_program;
use App\Models\ProgramFiles;
use App\Models\ProgramParticipants;
use App\Models\ProgramPartners;
use App\Models\User;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;


class ProgramsController extends Controller
{
    // ProgramModel

    public function getPrograms(){
        return response()->json(Program::all(),200);
    }

    public function getProgramById($id){
        $program = DB::table('programs')
        ->where('id', '=', $id)
        ->get();
        if(is_null($program)){
            return response()->json(['message'=>'Query not found']);
        }
        return response()->json($program);
    }

    public function searchPrograms($query){
        $program = Program::select('*')->where('title','like','%'.$query.'%')
        ->orWhere('place','like','%'.$query.'%')
        ->orWhere('lead','like','%'.$query.'%')->get();

        if(is_null($program)){
            return response()->json(['message'=>'Query not found']);
        }
        return response()->json(Program::select('*')->where('title','like','%'.$query.'%')
        ->orWhere('place','like','%'.$query.'%')
        ->orWhere('lead','like','%'.$query.'%')->get());
    }

    public function filterPrograms($filterBy, $direction){
        return response()->json(Program::select('*')->orderBy($filterBy,$direction)->get());
    }

    public function addProgram(Request $request){

        $request->validate([
            'title'=>'required',
            'start-date'=>'required',
            'end-date'=>'required',
            'place'=>'required',
            'leader_id'=>'required',
            'flow'=>'required',
            'additionalDetail'=>'required',
        ]);
        $program = Program::create($request->all());
        return response()->json($program);
    }

    public function editProgram(Request $request, $id){
        $program = Program::find($id);
        $program->update($request->all());
        return response()->json($program,200);
    }

    public function deleteProgram($id){
        return Program::destroy($id);
    }

    // //ProgramMembersModel
    public function addMember(Request $request, $uid){
            $request->validate([
                'program_id'=>'required',
            ]);

            $memberProgram = new member_program;

            $memberProgram->program_id = $request->input('program_id');
            $memberProgram->user_id = $uid;
            $memberProgram->save();

        return response()->json('Success');
    }

    //ProgramPartnerModel
    public function addPartner(Request $request){
        $request->validate([
            'name'=>'required',
            'program_id'=>'required',
            'adress'=>'required',
            'contactPerson'=>'required',
            'contactNumber'=>'required|min:11',
            'MoaFile'=>'required',
            'startPartnership'=>'required',
            'endPartnership'=>'required',
        ]);

    return response()->json(ProgramPartners::create($request->all()));
    }

    public function getPartnerByProgram($pid){
        $result = DB::table('program_partners')
        ->where('program_id', '=', $pid)
        ->get();
        if(is_null($result)){
            return response()->json(['message'=>'Query not found']);
        }
        return response()->json($result);
    }

    public function updatePartner(Request $request, $id){
        $partner = ProgramPartners::find($id);
        $partner->update($request->all());
        return response()->json($partner,200);
    }

    public function deletePartner($id){
        return ProgramPartners::destroy($id);
    }

     //ProgramParticipantModel
     public function addParticipant(Request $request){
        $request->validate([
            'name'=>'required',
            'program_id'=>'required',
        ]);

    return response()->json(ProgramParticipants::create($request->all()));
    }

    public function getParticipantByProgram($pid){
        $result = DB::table('program_participants')
        ->where('program_id', '=', $pid)
        ->get();
        if(is_null($result)){
            return response()->json(['message'=>'Query not found']);
        }
        return response()->json($result);
    }

    public function updateParticipant(Request $request, $id){
        $participant = ProgramParticipants::find($id);
        $participant->update($request->all());
        return response()->json($participant,200);
    }

    public function deleteParticipant($id){
        return ProgramParticipants::destroy($id);
    }

    //Program Files
    public function addFile(Request $request,$pid){
        $file = new ProgramFiles;

        $request->validate([
            'file'=>'required|mimes:pdf,docx|max:1999'
        ]);

        if($request->hasFile('file')){
            $fileNameWithExt = $request->file('file')->getClientOriginalName();
            $fileName = pathinfo($fileNameWithExt, PATHINFO_FILENAME);
            $extension = $request->file('file')->getClientOriginalExtension();
            $fileNameToStore = $fileName.'_'.time().'.'.$extension;
            $path = $request->file('file')->storeAs('public/program_files',$fileNameToStore);
        }else{
            return response()->json('Problem uploading file');
        }

        $file->title = $fileName;
        $file->program_id = $pid;
        $file->file = $fileNameToStore;
        $file->save();
    }

    public function getFileByProgram($pid){
        $result = DB::table('program_files')
        ->where('program_id', '=', $pid)
        ->get();
        if(is_null($result)){
            return response()->json(['message'=>'Query not found']);
        }
        return response()->json($result);
    }

    public function updateFile(Request $request, $id){
        $file = ProgramFiles::find($id);

        if($request->hasFile('file')){

            $request->validate([
                'file'=>'required|mimes:pdf,docx|max:1999'
            ]);

            $file_name = $file->file;
            $file_path = public_path('storage/program_files/'.$file_name);
            unlink($file_path);
            $file->delete();

            $fileNameWithExt = $request->file('file')->getClientOriginalName();
            $fileName = pathinfo($fileNameWithExt, PATHINFO_FILENAME);
            $extension = $request->file('file')->getClientOriginalExtension();
            $fileNameToStore = $fileName.'_'.time().'.'.$extension;
            $path = $request->file('file')->storeAs('public/program_files',$fileNameToStore);
        }else{
            return 'file too large';
        }

        $file->title = $fileName;
        $file->file = $fileNameToStore;
        $file->save();
    }

    public function deleteFile($id){
        $file = ProgramFiles::findOrFail($id);
        $file_name = $file->file;
        $file_path = public_path('storage/program_files/'.$file_name);

        unlink($file_path);
        $file->delete();
        return $file->file.' deleted.';
    }
}
