<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/
use App\Http\Controllers\AuthController;
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

App\Http\Controllers\IgracController;
 
//igraci
 
Route::middleware('auth:sanctum')->group(function () {
    Route::get('igraci', [IgracController::class, 'index']);
    Route::get('igraci/{id}', [IgracController::class, 'show']);
    Route::post('igraci', [IgracController::class, 'store']);
    Route::put('igraci/{id}', [IgracController::class, 'update']);
    Route::delete('igraci/{id}', [IgracController::class, 'destroy']);
});
 
//timovi
use App\Http\Controllers\TimController;
 
Route::middleware('auth:sanctum')->group(function () {
    Route::get('timovi', [TimController::class, 'index']);
    Route::get('timovi/{id}', [TimController::class, 'show']);
    Route::post('timovi', [TimController::class, 'store']);
    Route::put('timovi/{id}', [TimController::class, 'update']);
    Route::delete('timovi/{id}', [TimController::class, 'destroy']);
});
ima kontekstualni meni