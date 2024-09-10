<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

use Illuminate\Support\Facades\Http;
use Illuminate\Http\Request;

Route::get('/api/tabela', function (Request $request) {
    $season = $request->query('season', date('Y'));
 
    $response = Http::withHeaders([
        'X-Auth-Token' => '3f67e6c5848344f99e46142768ce07fa',
    ])->get('http://api.football-data.org/v4/competitions/SA/standings', [
        'season' => $season
    ]);
 
    return $response->json();
});