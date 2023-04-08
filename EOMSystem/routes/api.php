<?php

use App\Http\Controllers\ProgramsController;
use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Program related Routes
Route::get('programs',[ProgramsController::class, 'getPrograms']);
Route::get('programs/{id}',[ProgramsController::class, 'getProgramById']);
Route::get('programs/search/{query}',[ProgramsController::class, 'searchPrograms']);
Route::get('programs/filter/{filterBy}/{direction}',[ProgramsController::class, 'filterPrograms']);
Route::post('programs',[ProgramsController::class, 'addProgram']);
Route::put('programs/edit/{id}',[ProgramsController::class, 'editProgram']);
Route::delete('programs/{id}',[ProgramsController::class, 'deleteProgram']);

//Program-members routes
Route::post('members/{uid}',[ProgramsController::class, 'addMember']);
Route::get('members/{pid}',[ProgramsController::class, 'getMemberByProgram']);
Route::post('members/{id}',[ProgramsController::class, 'updateMember']);
Route::post('members/delete/{id}',[ProgramsController::class, 'deleteMember']);

//Program-participants routes
Route::post('participant/',[ProgramsController::class, 'addParticipant']);
Route::get('participant/{pid}',[ProgramsController::class, 'getParticipantByProgram']);
Route::post('participant/{id}',[ProgramsController::class, 'updateParticipant']);
Route::post('participant/delete/{id}',[ProgramsController::class, 'deleteParticipant']);

//Program-partners routes
Route::post('partners/',[ProgramsController::class, 'addPartner']);
Route::get('partner/{pid}',[ProgramsController::class, 'getPartnerByProgram']);
Route::post('partner/{id}',[ProgramsController::class, 'updatePartner']);
Route::post('partner/delete/{id}',[ProgramsController::class, 'deletePartner']);

//Program-files routes
Route::post('files/{pid}',[ProgramsController::class, 'addFile']);
Route::get('file/{pid}',[ProgramsController::class, 'getFileByProgram']);
Route::post('file/edit/{id}',[ProgramsController::class, 'updateFile']);
Route::post('file/delete/{id}',[ProgramsController::class, 'deleteFile']);

Route::middleware('auth')->group( function(){

});
//UserModel routes
Route::post('signup/',[AuthController::class, 'signup']);
Route::post('login', [AuthController::class,'login']);
Route::get('users',[AuthController::class,'getUsers']);
Route::get('user/{id}',[AuthController::class,'getUserById']);
Route::post('user/edit/{id}',[AuthController::class, 'editUser']);
Route::post('user/delete/{id}',[AuthController::class, 'deleteUser']);

Route::group(['middleware' => 'api',], function ($router) {
    // Route::post('logout', 'AuthController@logout');
    // Route::post('refresh', 'AuthController@refresh');
    // Route::post('me', 'AuthController@me');
});
