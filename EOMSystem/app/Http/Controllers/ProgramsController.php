<?php

namespace App\Http\Controllers;

use App\Models\Program;
use App\Models\member_program;
use App\Models\ProgramFiles;
use App\Models\ProgramParticipants;
use App\Models\ProgramPartners;
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
            $program = DB::table('programs')
            ->where('archived', '=', 0)
            ->get();
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
    if (!auth()->check()) {
        return response()->json(['message' => 'You must log in']);
    }

    $programs = Program::with('leader')->where('archived', '=', 0)
        ->where('title', 'like', '%' . $query . '%')
        ->orWhere('place', 'like', '%' . $query . '%')
        ->orWhereHas('leader', function ($q) use ($query) {
            $q->where('name', 'like', '%' . $query . '%');
        })
        ->get();

    if ($programs->isEmpty()) {
        return response()->json(['message' => 'No matching programs found']);
    }

    return response()->json($programs);
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
            'startDate'=>'required|date',
            'endDate'=>'required|date|after_or_equal:startDate',
            'place'=>'required',
            'leaderId'=>'required',
            'additionalDetail'=>'required',
        ]);
        $program = new Program;
        $program->title = $request->title;
        $program->startDate = $request->startDate;
        $program->endDate = $request->endDate;
        $program->place = $request->place;
        $program->leaderId = $request->leaderId;
        $program->additionalDetail = $request->additionalDetail;
        $program->save();
        $pid = $program->id;
        return response()->json($pid);
    }

    public function editProgram(Request $request, $id){
        if(!auth()->user()){
            return response()->json(['message'=>'You must login']);
        }
        $program = Program::find($id);
        $program->update($request->all());
        return response()->json($program,['message'=>'Program Edited']);
    }

    public function deleteProgram($id){
        if(!auth()->user()){
            return response()->json(['message'=>'You must login']);
        }
        $program = Program::find($id);
        $program->archived = true;

        if($program->save()){

            foreach ($program->members as $member) {
                $program->members()->updateExistingPivot($member->id, ['archived' => true]);
            }
            $partners = ProgramPartners::where('programId', $id)->get();
            foreach($partners as $partner){
                $partner->archived = true;
                $partner->save();
            }
            $participants = ProgramParticipants::where('programId', $id)->get();
            foreach($participants as $participant){
                $participant->archived = true;
                $participant->save();
            }
            $files = ProgramFiles::where('programId', $id)->get();
            foreach($files as $file){
                $file->archived = true;
                $file->save();
            }
            $flows = ProgramFlow::where('programId', $id)->get();
            foreach($flows as $flow){
                $flow->archived = true;
                $flow->save();
            }
        }else{
            return response()->json(['message'=>'Error Deleting Item']);
        }
    }

    public function getProgramsByLeader($id){
        if(!auth()->user()){
            return response()->json(['message'=>'You must login']);
        }
        $program = DB::table('programs')
        ->where('leaderId', '=', $id)->where('archived', '=', 0)
        ->get();
        if(is_null($program)){
            return response()->json(['message'=>'Query not found']);
        }
        return response()->json($program);
    }

    // //ProgramMembersModel
    public function getMemberByProgram($pid){
        $program = Program::find($pid);
        $members = $program->members()
                          ->wherePivot('archived', false)
                          ->get();
        return response()->json($members);
    }


    public function addMember(Request $request, $pid){
        if(!auth()->user()){
            return response()->json(['message'=>'You must login']);
        }
        $request->validate([
            'members.*.memberId'=>'required',
        ]);
        $members = $request->input('members',[]);
        foreach ($members as $member) {
                $memberId = $member['memberId'];
                $newMember = new member_program();
                $newMember->memberId = $memberId;
                $newMember->programId = $pid;
                $newMember->save();
                }
        return response()->json(['message'=>'Success']);
    }

    public function deleteMember($pid,$uid){
        $member = DB::table('member_programs')
          ->where('programId', '=', $pid)
          ->where('memberId', '=', $uid)
          ->update(['archived' => true]);

        return response()->json(['message'=>'Member Deleted']);
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
        ->where('programId', '=', $pid)->where('archived', '=', 0)
        ->get();
        if(is_null($result)){
            return response()->json(['message'=>'Query not found']);
        }
        return response()->json($result);
    }

    public function getPartners(){
        if(!auth()->user()){
            return response()->json(['message'=>'You must login']);
        }
        $partners = DB::table('program_partners')->where('archived', '=', 0)->get();

        if(is_null($partners)){
            return response()->json(['message'=>'Query not found']);
        }
        return response()->json($partners);
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

            return response()->json(['message'=>'Partner Updated']);
    }

    public function deletePartner($id){
        if(!auth()->user()){
            return response()->json(['message'=>'You must login']);
        }
        $member = DB::table('program_partners')
          ->where('id', '=', $id)
          ->update(['archived' => true]);

          return response()->json(['message'=>'Partner Deleted']);
    }

    public function expiringMoa() {
        $today = Carbon::now()->toDateString();
        $expiration = Carbon::now()->addDay(30)->toDateString();
        return ProgramPartners::whereBetween('endPartnership', [$today, $expiration])
            ->where('archived', 0)->get();
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

            return response()->json(['message'=>'Partner Updted']);
    }

     //ProgramParticipantModel
     public function addParticipant(Request $request,$pid){
        if(!auth()->user()){
            return response()->json(['message'=>'You must login']);
        }
        $request->validate([
            'participants.*.name'=>'required',
        ]);
        $participants = $request->input('participants',[]);
        foreach ($participants as $participant) {
            $name = $participant['name'];
            $newParticipant = new ProgramParticipants();
            $newParticipant->name = $name;
            $newParticipant->programId = $pid;
            $newParticipant->save();
            }
        return response()->json(['message'=>'Participant Added']);
    }

    public function getParticipantByProgram($pid){
        if(!auth()->user()){
            return response()->json(['message'=>'You must login']);
        }
        $result = DB::table('program_participants')
        ->where('programId', '=', $pid)->where('archived', '=', 0)
        ->get();
        if(is_null($result)){
            return response()->json(['message'=>'Query not found']);
        }
        return response()->json($result);
    }

    public function getParticipantByID($id){
        if(!auth()->user()){
            return response()->json(['message'=>'You must login']);
        }
        $result = DB::table('program_participants')
        ->where('id', '=', $id)->where('archived', '=', 0)
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
        return response()->json($participant,['message'=>'Participant Updated']);
    }

    public function deleteParticipant($id){
        if(!auth()->user()){
            return response()->json(['message'=>'You must login']);
        }
        $participant = DB::table('program_participants')
          ->where('id', '=', $id)
          ->update(['archived' => true]);
        return response()->jsom(['message'=>'PArticipant Deleted']);
    }

    //Program flow

    public function deleteFlow($id){
        if(!auth()->user()){
            return response()->json(['message'=>'You must login']);
        }
        $flow = DB::table('program_flows')
          ->where('id', '=', $id)
          ->update(['archived' => true]);
        return response()->jsom(['message'=>'Flow Deleted']);
    }
    public function getFlowByProgram($pid){
        if(!auth()->user()){
            return response()->json(['message'=>'You must login']);
        }
        $result = DB::table('program_flows')
        ->where('programId', '=', $pid)->where('archived', '=', 0)
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
    public function addFile(Request $request, $pid){
        if(!auth()->user()){
            return response()->json(['message'=>'You must login']);
        }

        $request->validate([
            'file.*'=>'required|mimes:pdf,docx|max:1999'
        ]);

        foreach ($request->file('file') as $file) {
            $fileModel = new ProgramFiles;

            if($file->isValid()){
                $fileNameWithExt = $file->getClientOriginalName();
                $fileName = pathinfo($fileNameWithExt, PATHINFO_FILENAME);
                $extension = $file->getClientOriginalExtension();
                $fileNameToStore = $fileName.'_'.time().'.'.$extension;
                $path = $file->storeAs('public/program_files',$fileNameToStore);
            }else{
                return response()->json(['message'=>'Problem uploading file']);
            }

            $fileModel->title = $fileName;
            $fileModel->programId = $pid;
            $fileModel->file = $fileNameToStore;
            $fileModel->save();
        }

        return response()->json(['message'=>'Files Added']);
    }

    public function getFileByProgram($pid){
        if(!auth()->user()){
            return response()->json(['message'=>'You must login']);
        }
        $result = DB::table('program_files')
        ->where('programId', '=', $pid)->where('archived', '=', 0)
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
        return response()->json(['message'=>'File Updated']);
    }

    public function deleteFile($id){
        if(!auth()->user()){
            return response()->json(['message'=>'You must login']);
        }
        $file = ProgramFiles::findOrFail($id);

        $file->archived = true;
        $file->save();

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
            $leaderOf = DB::table('programs')->where('archived', '=', 0)
            ->where('leaderId', '=', $userId)->get();
            return response()->json($leaderOf);
        } else {
            return response()->json(['message'=>'You must login']);
        }
    }

    public function programsByMember(){
    $user = auth()->user();

    if (!$user) {
        return response()->json(['message' => 'You must log in']);
    }

    $userId = $user->id;
    $member = User::find($userId);

    $programs = $member->programs()
        ->wherePivot('archived', false)
        ->get();

    return response()->json($programs);
    }


    //for dashboard
    public function upcomingProgramsCount(){
        if(!auth()->user()){
            return response()->json(['message'=>'You must login']);
        }
        $currentDate = Carbon::now();
        $results = Program::whereDate('endDate', '>', $currentDate->toDateString())->where('archived', '=', 0)->count();

        return response()->json($results);
    }
    public function pastProgramsCount(){
        if(!auth()->user()){
            return response()->json(['message'=>'You must login']);
        }
        $currentDate = Carbon::now();
        $results = Program::whereDate('endDate', '<', $currentDate->toDateString())->where('archived', '=', 0)->count();

        return response()->json($results);
    }
    public function expiredMoaCount(){
        if(!auth()->user()){
            return response()->json(['message'=>'You must login']);
        }
        $currentDate = Carbon::now();
        $results = ProgramPartners::whereDate('endPartnership', '<', $currentDate->toDateString())->where('archived', '=', 0)->count();

        return response()->json($results);
    }
    public function activeMoaCount(){
        if(!auth()->user()){
            return response()->json(['message'=>'You must login']);
        }
        $currentDate = Carbon::now();
        $results = ProgramPartners::whereDate('endPartnership', '>', $currentDate->toDateString())->where('archived', '=', 0)->count();

        return response()->json($results);
    }
    public function acceptedUsersCount(){
        if(!auth()->user()){
            return response()->json(['message'=>'You must login']);
        }
        $users = DB::table('users')
        ->where('status', '=', 'accepted')->where('role','=',0)->where('archived', '=', 0)
        ->count();
        if(is_null($users)){
            return response()->json(['message'=>'Query not found']);
        }
        return response()->json($users);
    }
    public function pendingUsersCount(){
        if(!auth()->user()){
            return response()->json(['message'=>'You must login']);
        }
        $users = DB::table('users')
        ->where('status', '=', 'pending')->where('role','=',0)->where('archived', '=', 0)
        ->count();
        if(is_null($users)){
            return response()->json(['message'=>'Query not found']);
        }
        return response()->json($users);
    }

    public function facultyCount(){
        if(!auth()->user()){
            return response()->json(['message'=>'You must login']);
        }
        $users = DB::table('users')
        ->where('status', '=', 'accepted')->where('role','=',0)->where('archived', '=', 0)
        ->count();
        if(is_null($users)){
            return response()->json(['message'=>'Query not found']);
        }
        return response()->json($users);
    }

    public function partnersCount(){
        if(!auth()->user()){
            return response()->json(['message'=>'You must login']);
        }
        $partners = DB::table('program_partners')->where('archived', '=', 0)->count();
        if(is_null($partners)){
            return response()->json(['message'=>'Query not found']);
        }
        return response()->json($partners);
    }

    //for generate reports
    public function getAllActivePartners() {
        if(!auth()->user()){
            return response()->json(['message'=>'You must login']);
        }
        $currentDate = Carbon::now();
        $result = DB::table('program_partners')
        ->where('endPartnership', '>', $currentDate)->where('archived', '=', 0)
        ->orderBy('id', 'desc')
        ->get();

        if($result->count() > 0) {
            return response()->json($result);
        } else {
            return response()->json($result);
        }
    }

    public function getAllExpiredPartners() {
        if(!auth()->user()){
            return response()->json(['message'=>'You must login']);
        } else {
        $currentDate = Carbon::now();
        $result = DB::table('program_partners')
        ->where('endPartnership', '<', $currentDate)->where('archived', '=', 0)
        ->orderBy('id', 'desc')
        ->get();

            if($result->count() > 0) {
                return response()->json($result);
            } else {
                return response()->json($result);
            }
        }
    }

    public function activeMoaPerYear(){
        if(!auth()->user()){
            return response()->json(['message'=>'You must login']);
        } else {
            $currentDate = Carbon::now()->addDay(1)->toDateString();
            $dateFilter = Carbon::now()->addYear(2)->toDateString();
            $result = DB::table('program_partners')->select('*')
            ->where('endPartnership', '>', $currentDate)->where('archived', '=', 0)
            ->orderBy('id', 'desc')
            ->count();
            if ($result > 0) {
                $results = ProgramPartners::whereBetween('endPartnership', [$currentDate, $dateFilter])
                ->where('archived', '=', 0)
                ->orderBy('id', 'desc')
                ->get();
                return response()->json($results);
            } else {
                return response()->json();
            }
        }
    }

    public function expiredMoaPerYear(){
        if(!auth()->user()){
            return response()->json(['message'=>'You must login']);
        } else {

            $currentDate = Carbon::now()->toDateString();
            $dateFilter = Carbon::now()->addYear(1)->toDateString();
            $result = ProgramPartners::whereBetween('endPartnership', [$currentDate, $dateFilter])->count();
            if ($result > 0) {
                $results = DB::table('program_partners')->select('*')
                ->where('endPartnership', '<=', $currentDate)->where('archived', '=', 0)
                ->orderBy('id', 'desc')
                ->get();
                return response()->json($results);
            } else {
                return response()->json();
            }
        }
    }

    //Archives
    public function archivedPrograms(){
        if(Auth::check()){
            $program = DB::table('programs')
            ->where('archived', '=', 1)
            ->get();
            return response()->json($program);
        }
        return response()->json(['message'=>'You must login']);
    }
    public function searchArchivePrograms($query){
        if (!auth()->check()) {
            return response()->json(['message' => 'You must log in']);
        }
        $programs = Program::with('leader')->where('archived', '=', 1)
            ->where('title', 'like', '%' . $query . '%')
            ->orWhere('place', 'like', '%' . $query . '%')
            ->orWhereHas('leader', function ($q) use ($query) {
                $q->where('name', 'like', '%' . $query . '%');
            })
            ->get();

        if ($programs->isEmpty()) {
            return response()->json(['message' => 'No matching programs found']);
        }
        return response()->json($programs);
    }
    public function getArchiveProgramsByLeader($id){
        if(!auth()->user()){
            return response()->json(['message'=>'You must login']);
        }
        $program = DB::table('programs')
        ->where('leaderId', '=', $id)->where('archived', '=', 1)
        ->get();
        if(is_null($program)){
            return response()->json(['message'=>'Query not found']);
        }
        return response()->json($program);
    }
    public function recoverProgram($id){
        if(!auth()->user()){
            return response()->json(['message'=>'You must login']);
        }
        $program = Program::find($id);
        $program->archived = false;

        if($program->save()){

            foreach ($program->members as $member) {
                $program->members()->updateExistingPivot($member->id, ['archived' => false]);
            }
            $partners = ProgramPartners::where('programId', $id)->get();
            foreach($partners as $partner){
                $partner->archived = false;
                $partner->save();
            }
            $participants = ProgramParticipants::where('programId', $id)->get();
            foreach($participants as $participant){
                $participant->archived = false;
                $participant->save();
            }
            $files = ProgramFiles::where('programId', $id)->get();
            foreach($files as $file){
                $file->archived = false;
                $file->save();
            }
            $flows = ProgramFlow::where('programId', $id)->get();
            foreach($flows as $flow){
                $flow->archived = false;
                $flow->save();
            }
            return response()->json(['message'=>'Recovered Successfully']);
        }else{
            return response()->json(['message'=>'Error Recovering Item']);
        }
    }
}
