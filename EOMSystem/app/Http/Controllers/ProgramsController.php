<?php

namespace App\Http\Controllers;

use App\Models\Program;
use App\Models\member_program;
use App\Models\ProgramFiles;
use App\Models\ProgramParticipants;
use App\Models\ProgramPartners;
use App\Models\ArchievedPrograms;
use App\Models\ProgramFlow;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use App\Notifications\MoaExpirationNotification;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;


class ProgramsController extends Controller
{
    // ProgramModel

    public function getPrograms(){
        if(Auth::check()){
            $program = Program::all();
            return response()->json($program);
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

        $program =Program::find($id);

        $aprogram = new ArchievedPrograms;
        $aprogram->id = $program->id;
        $aprogram->title = $program->title;
        $aprogram->startDate = $program->startDate;
        $aprogram->endDate = $program->endDate;
        $aprogram->place = $program->place;
        $aprogram->leaderId = $program->leaderId;
        $aprogram->flow = $program->flow;
        $aprogram->additionalDetail = $program->additionalDetail;
        $aprogram->save();

        $program->delete();

        return response()->json(['message'=>'Deleted Successfully']);
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
        $member = DB::table('member_programs')->where('programId','=',$pid)
        ->where('memberId','=',$uid)->delete();
        return response()->json(['message'=>'Record Deleted']);
    }

    //ProgramPartnerModel
    public function addPartner(Request $request,$pid){
        if(!auth()->user()){
            return response()->json(['message'=>'You must login']);
        }
        $request->validate([
            'name'=>'required',
            'address'=>'required',
            'contactPerson'=>'required',
            'contactNumber'=>'required|min:11',
            'MoaFile'=>'required|mimes:pdf,docx|max:1999',
            'startPartnership'=>'required',
            'endPartnership'=>'required',
        ]);

        if($request->hasFile('MoaFile')){
            $fileNameWithExt = $request->file('MoaFile')->getClientOriginalName();
            $fileName = pathinfo($fileNameWithExt, PATHINFO_FILENAME);
            $extension = $request->file('MoaFile')->getClientOriginalExtension();
            $fileNameToStore = $fileName.'_'.time().'.'.$extension;
            $path = $request->file('MoaFile')->storeAs('public/moa_files',$fileNameToStore);
        }else{
            return response()->json('Problem uploading file');
        }
            $partner = new ProgramPartners;
            $partner->programId = $pid;
            $partner->name = $request->input('name');
            $partner->address = $request->input('address');
            $partner->contactPerson = $request->input('contactPerson');
            $partner->contactNumber = $request->input('contactNumber');
            $partner->MoaFile = $fileNameToStore;
            $partner->startPartnership = $request->input('startPartnership');
            $partner->endPartnership = $request->input('endPartnership');
            $partner->save();
        return response()->json(['message'=>'Partner added ']);
    }

    public function getPartnerByProgram($pid){
        if(!auth()->user()){
            return response()->json(['message'=>'You must login']);
        }
        $result = DB::table('program_partners')
        ->where('programId', '=', $pid)
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
        $file = ProgramPartners::find($id);

        $request->validate([
            'name'=>'required',
            'address'=>'required',
            'contactPerson'=>'required',
            'contactNumber'=>'required|min:11',
            'MoaFile'=>'required|mimes:pdf,docx|max:1999',
            'startPartnership'=>'required',
            'endPartnership'=>'required',
        ]);

        if($request->hasFile('MoaFile')){
            $file_name = $file->MoaFile;
            $file_path = public_path('storage/moa_files/'.$file_name);
            unlink($file_path);
            $file->delete();

            $fileNameWithExt = $request->file('MoaFile')->getClientOriginalName();
            $fileName = pathinfo($fileNameWithExt, PATHINFO_FILENAME);
            $extension = $request->file('MoaFile')->getClientOriginalExtension();
            $fileNameToStore = $fileName.'_'.time().'.'.$extension;
            $path = $request->file('MoaFile')->storeAs('public/moa_files',$fileNameToStore);
        }else{
            return 'file too large';
        }
            $file->name = $request->input('name');
            $file->address = $request->input('address');
            $file->contactPerson = $request->input('contactPerson');
            $file->contactNumber = $request->input('contactNumber');
            $file->MoaFile = $fileNameToStore;
            $file->startPartnership = $request->input('startPartnership');
            $file->endPartnership = $request->input('endPartnership');
            $file->save();
    }

    public function deletePartner($id){
        if(!auth()->user()){
            return response()->json(['message'=>'You must login']);
        }
        return ProgramPartners::destroy($id);
    }

    public function expiringMoa(){
        $today = Carbon::now()->toDateString();
        $expiration = Carbon::now()->addDay(30)->toDateString();
        return ProgramPartners::whereBetween('endPartnership', [$today, $expiration])->get();
    }

    public function renewMoa(Request $request, $id){
        if(!auth()->user()){
            return response()->json(['message'=>'You must login']);
        }
        $file = ProgramPartners::find($id);
        $request->validate([
            'MoaFile'=>'required|mimes:pdf,docx|max:1999',
            'startPartnership'=>'required',
            'endPartnership'=>'required',
        ]);
        if($request->hasFile('MoaFile')){
            $file_name = $file->MoaFile;
            $file_path = public_path('storage/moa_files/'.$file_name);
            unlink($file_path);
            $file->delete();

            $fileNameWithExt = $request->file('MoaFile')->getClientOriginalName();
            $fileName = pathinfo($fileNameWithExt, PATHINFO_FILENAME);
            $extension = $request->file('MoaFile')->getClientOriginalExtension();
            $fileNameToStore = $fileName.'_'.time().'.'.$extension;
            $path = $request->file('MoaFile')->storeAs('public/moa_files',$fileNameToStore);
        }else{
            return 'file too large';
        }
            $file->MoaFile = $fileNameToStore;
            $file->startPartnership = $request->input('startPartnership');
            $file->endPartnership = $request->input('endPartnership');
            $file->save();
    }

     //ProgramParticipantModel
     public function addParticipant(Request $request,$pid){
        if(!auth()->user()){
            return response()->json(['message'=>'You must login']);
        }
        $request->validate([
            'name'=>'required',
        ]);
        $participant = new ProgramParticipants;
        $participant->name = $request->input('name');
        $participant->programId = $pid;
        $participant->save();

        return response()->json(['message'=>'Participant Added']);
    }

    public function getParticipantByProgram($pid){
        if(!auth()->user()){
            return response()->json(['message'=>'You must login']);
        }
        $result = DB::table('program_participants')
        ->where('programId', '=', $pid)
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

    //Program flow

    public function deleteFlow($id){
        if(!auth()->user()){
            return response()->json(['message'=>'You must login']);
        }
        return ProgramFlow::destroy($id);
    }
    public function getFlowByProgram($pid){
        if(!auth()->user()){
            return response()->json(['message'=>'You must login']);
        }
        $result = DB::table('program_flows')
        ->where('programId', '=', $pid)
        ->get();
        if(is_null($result)){
            return response()->json(['message'=>'Query not found']);
        }
        return response()->json($result);
    }

    public function addFlow(Request $request, $pid){
        if(!auth()->user()){
            return response()->json(['message'=>'You must login']);
        }
        $request->validate([
            'flows.*.event'=>'required',
            'flows.*.remarks'=>'required',
            'flows.*.time'=>'required',
        ]);
        $flows = $request->input('flows',[]);
        foreach ($flows as $flow) {
            $event = $flow['event'];
            $remarks = $flow['remarks'];
            $time = $flow['time'];

            $newFlow = new ProgramFlow;
            $newFlow->programId = $pid;
            $newFlow->event = $event;
            $newFlow->remarks = $remarks;
            $newFlow->time = $time;
            $newFlow->save();
        }
        return response()->json(['message'=>'Flow Added']);
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
        return response()->json(['message'=>'File Added']);
    }

    public function getFileByProgram($pid){
        if(!auth()->user()){
            return response()->json(['message'=>'You must login']);
        }
        $result = DB::table('program_files')
        ->where('programId', '=', $pid)
        ->get();
        if(is_null($result)){
            return response()->json(['message'=>'Query not found']);
        }
        return $result;
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

    //should access the name of the user and pass that name to the notification
    public function notify(Request $request) {
        $user = User::first();
        $user->name = $request->name;
        $user->notify(new MoaExpirationNotification($user->name));
    }

    //Faculty related functions
    public function programByLeader(){
        $user = auth()->user();
        if ($user) {
            $userId = $user->id;
            $leaderOf = DB::table('programs')
            ->where('leaderId', '=', $userId)->get();
            return response()->json($leaderOf);
        } else {
            return response()->json(['message'=>'You must login']);
        }
    }
    public function programsByMember(){

        $user = auth()->user();
        if ($user) {
            $userId = $user->id;
            $member = User::find($userId);
            $programs = $member->programs()->get();
            return response()->json($programs);
        } else {
            return response()->json(['message'=>'You must login']);
        }
    }

    //for dashboard
    public function upcomingProgramsCount(){
        if(!auth()->user()){
            return response()->json(['message'=>'You must login']);
        }
        $currentDate = Carbon::now();
        $results = Program::whereDate('endDate', '>', $currentDate->toDateString())->count();

        return response()->json($results);
    }
    public function pastProgramsCount(){
        if(!auth()->user()){
            return response()->json(['message'=>'You must login']);
        }
        $currentDate = Carbon::now();
        $results = Program::whereDate('endDate', '<', $currentDate->toDateString())->count();

        return response()->json($results);
    }
    public function expiredMoaCount(){
        if(!auth()->user()){
            return response()->json(['message'=>'You must login']);
        }
        $currentDate = Carbon::now();
        $results = ProgramPartners::whereDate('endPartnership', '<', $currentDate->toDateString())->count();

        return response()->json($results);
    }
    public function activeMoaCount(){
        if(!auth()->user()){
            return response()->json(['message'=>'You must login']);
        }
        $currentDate = Carbon::now();
        $results = ProgramPartners::whereDate('endPartnership', '>', $currentDate->toDateString())->count();

        return response()->json($results);
    }
}
