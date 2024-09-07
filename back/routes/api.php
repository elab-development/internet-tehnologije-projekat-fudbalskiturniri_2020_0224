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

use App\Http\Controllers\IgracController;
 
//igraci
 
Route::middleware('auth:sanctum')->group(function () {
    Route::get('igraci/kumulativna_statistika', [IgracController::class, 'getAllPlayersWithAllStatistics']);
    Route::get('igraci', [IgracController::class, 'index']);
    Route::get('igraci/{id}', [IgracController::class, 'show']);

    Route::middleware('role:admin')->group(function () {
        Route::post('igraci', [IgracController::class, 'store']);
        Route::put('igraci/{id}', [IgracController::class, 'update']);
        Route::delete('igraci/{id}', [IgracController::class, 'destroy']);
    });
});
 
//timovi
use App\Http\Controllers\TimController;
 
Route::middleware('auth:sanctum')->group(function () {
    Route::get('timovi', [TimController::class, 'index']);
    Route::get('timovi/{id}', [TimController::class, 'show']);

    Route::middleware('role:admin')->group(function () {
        Route::post('timovi', [TimController::class, 'store']);
        Route::put('timovi/{id}', [TimController::class, 'update']);
        Route::delete('timovi/{id}', [TimController::class, 'destroy']);
    });
});

use App\Http\Controllers\UtakmicaController;
 
//utakmice
 
Route::middleware('auth:sanctum')->group(function () {
    Route::get('utakmice', [UtakmicaController::class, 'index']);
    Route::get('utakmice/{id}', [UtakmicaController::class, 'show']);


    Route::middleware('role:admin')->group(function () {   
        Route::put('utakmice/status/{id}', [UtakmicaController::class, 'updateStatus']);
        Route::put('utakmice/finish/{id}', [UtakmicaController::class, 'updateWinner']);
        Route::post('utakmice', [UtakmicaController::class, 'store']);
        Route::put('utakmice/{id}', [UtakmicaController::class, 'update']);
        Route::delete('utakmice/{id}', [UtakmicaController::class, 'destroy']);
    });
});
 
use App\Http\Controllers\TurnirController;
 
//turniri
 
Route::middleware('auth:sanctum')->group(function () {
    Route::get('turniri/omiljeni', [TurnirController::class, 'getFavorites']);
    Route::apiResource('turniri', TurnirController::class)->only([
        'index', 'show'
    ]);

    Route::post('turniri/omiljeni/{id}', [TurnirController::class, 'addToFavorite']);
    Route::delete('turniri/omiljeni/{id}', [TurnirController::class, 'removeFromFavorites']);

    Route::middleware('role:admin')->group(function () {
        Route::apiResource('turniri', TurnirController::class)->only([
            'store', 'update', 'destroy'
        ]);
    });
});