<?php

namespace App\Http\Controllers;

use App\Models\Program;
use App\Models\member_program;
use App\Models\ProgramFiles;
use App\Models\ProgramParticipants;
use App\Models\ProgramPartners;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;


class ProgramsController extends Controller
{
    // ProgramModel

    public function getPrograms(){
        if(Auth::check()){
            return response()->json(Program::all(),200);
        }
        return response()->json(['message'=>'You must login']);
    }

    public function getProgramById($id){
        if(!auth()->user()){
            return response()->json(['message'=>'You must login']);
        }
        $program = DB::table('programs')
        ->where('id', '=', $id)
        ->get();
        if(is_null($program)){
            return response()->json(['message'=>'Query not found']);
        }
        return response()->json($program);
    }

    public function searchPrograms($query){
        if(!auth()->user()){
            return response()->json(['message'=>'You must login']);
        }
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
        if(!auth()->user()){
            return response()->json(['message'=>'You must login']);
        }
        return response()->json(Program::select('*')->orderBy($filterBy,$direction)->get());
    }

    public function addProgram(Request $request){
        if(!auth()->user()){
            return response()->json(['message'=>'You must login']);
        }
        $request->validate([
            'title'=>'required',
            'startDate'=>'required',
            'endDate'=>'required',
            'place'=>'required',
            'leaderId'=>'required',
            'flow'=>'required',
            'additionalDetail'=>'required',
        ]);
        $program = Program::create($request->all());
        return response()->json($program);
    }

    public function editProgram(Request $request, $id){
        if(!auth()->user()){
            return response()->json(['message'=>'You must login']);
        }
        $program = Program::find($id);
        $program->update($request->all());
        return response()->json($program,200);
    }

    public function deleteProgram($id){
        if(!auth()->user()){
            return response()->json(['message'=>'You must login']);
        }
        return Program::destroy($id);
    }

    // //ProgramMembersModel
    public function getMemberByProgram($pid){
        $program = Program::find($pid);

        $members = $program->members()->get();
        return response()->json($members);
    }
    public function addMember(Request $request, $pid){
        if(!auth()->user()){
            return response()->json(['message'=>'You must login']);
        }
        $request->validate([
            'userId'=>'required',
        ]);

        $memberProgram = new member_program;

        $memberProgram->memberId = $request->input('userId');
        $memberProgram->programId = $pid;
        $memberProgram->save();

        return response()->json('Success');
    }

    public function deleteMember($pid,$uid){
        $member = DB::table('member_program')->where('program_id','=',$pid)
        ->where('member_id','=',$uid)->delete();
        return response()->json(['message'=>'Record Deleted']);
    }

    //ProgramPartnerModel
    public function addPartner(Request $request){
        if(!auth()->user()){
            return response()->json(['message'=>'You must login']);
        }
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
        if(!auth()->user()){
            return response()->json(['message'=>'You must login']);
        }
        $result = DB::table('program_partners')
        ->where('program_id', '=', $pid)
        ->get();
        if(is_null($result)){
            return response()->json(['message'=>'Query not found']);
        }
        return response()->json($result);
    }

    public function getPartnerById($id){
        if(!auth()->user()){
            return response()->json(['message'=>'You must login']);
        }
        $program = DB::table('program_partners')
        ->where('id', '=', $id)
        ->get();
        if(is_null($program)){
            return response()->json(['message'=>'Query not found']);
        }
        return response()->json($program);
    }

    public function updatePartner(Request $request, $id){
        if(!auth()->user()){
            return response()->json(['message'=>'You must login']);
        }
        $partner = ProgramPartners::find($id);
        $partner->update($request->all());
        return response()->json($partner,200);
    }

    public function deletePartner($id){
        if(!auth()->user()){
            return response()->json(['message'=>'You must login']);
        }
        return ProgramPartners::destroy($id);
    }

     //ProgramParticipantModel
     public function addParticipant(Request $request){
        if(!auth()->user()){
            return response()->json(['message'=>'You must login']);
        }
        $request->validate([
            'name'=>'required',
            'program_id'=>'required',
        ]);

    return response()->json(ProgramParticipants::create($request->all()));
    }

    public function getParticipantByProgram($pid){
        if(!auth()->user()){
            return response()->json(['message'=>'You must login']);
        }
        $result = DB::table('program_participants')
        ->where('program_id', '=', $pid)
        ->get();
        if(is_null($result)){
            return response()->json(['message'=>'Query not found']);
        }
        return response()->json($result);
    }

    public function updateParticipant(Request $request, $id){
        if(!auth()->user()){
            return response()->json(['message'=>'You must login']);
        }
        $participant = ProgramParticipants::find($id);
        $participant->update($request->all());
        return response()->json($participant,200);
    }

    public function deleteParticipant($id){
        if(!auth()->user()){
            return response()->json(['message'=>'You must login']);
        }
        return ProgramParticipants::destroy($id);
    }

    //Program Files
    public function addFile(Request $request,$pid){
        if(!auth()->user()){
            return response()->json(['message'=>'You must login']);
        }
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
        $file->programId = $pid;
        $file->file = $fileNameToStore;
        $file->save();
    }

    public function getFileByProgram($pid){
        if(!auth()->user()){
            return response()->json(['message'=>'You must login']);
        }
        $result = DB::table('program_files')
        ->where('program_id', '=', $pid)
        ->get();
        if(is_null($result)){
            return response()->json(['message'=>'Query not found']);
        }
        return response()->json($result);
    }

    public function updateFile(Request $request, $id){
        if(!auth()->user()){
            return response()->json(['message'=>'You must login']);
        }
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
        if(!auth()->user()){
            return response()->json(['message'=>'You must login']);
        }
        $file = ProgramFiles::findOrFail($id);
        $file_name = $file->file;
        $file_path = public_path('storage/program_files/'.$file_name);

        unlink($file_path);
        $file->delete();
        return response()->json(['message'=>$file->file.' deleted.']);
    }
}
