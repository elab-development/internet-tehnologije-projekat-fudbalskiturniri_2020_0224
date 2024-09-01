<?php
 
namespace App\Http\Controllers;
use App\Http\Resources\UtakmicaResource;
use App\Models\Utakmica;
use App\Models\Tim;
use Illuminate\Http\Request;
use App\Models\StatistikaIgraca;
 
class UtakmicaController extends Controller
{
    public function index()
    {
        try {
            $utakmica = Utakmica::all();
            return UtakmicaResource::collection($utakmica);
        } catch (\Exception $e) {
            \Log::error($e->getMessage());
            return response()->json(['error' => 'An error occurred'], 500);
        }
    }
 
    public function store(Request $request)
    {
        try{
            $utakmica = Utakmica::create($request->all());
            return response()->json($utakmica, 201);
        }
        catch (\Exception $e) {
            \Log::error($e->getMessage());
            return response()->json(['error' => 'An error occurred'], 500);
        }
    }
 
    public function show($id)
    {
        try{
            $utakmica = Utakmica::findOrFail($id);
            return new UtakmicaResource($utakmica);
        }
        catch (\Exception $e) {
            \Log::error($e->getMessage());
            return response()->json(['error' => 'An error occurred'], 500);
        }
    }
 
 
   
    public function update(Request $request, $id)
    {
 
        try{
 
            $utakmica = Utakmica::findOrFail($id);
            $utakmica->update($request->all());
            return response()->json(['message' => 'Game updated successfully']);
        }
        catch (\Exception $e) {
            \Log::error($e->getMessage());
            return response()->json(['error' => 'An error occurred'], 500);
        }
    }
 
 
    
 
    public function destroy($id)
    {
        try{
            Utakmica::destroy($id);
            return response()->json(null, 204);
        }
        catch (\Exception $e) {
            \Log::error($e->getMessage());
            return response()->json(['error' => 'An error occurred'], 500);
        }
    }
}