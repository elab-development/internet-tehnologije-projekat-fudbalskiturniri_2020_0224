<?php
 
namespace App\Http\Controllers;
use Illuminate\Support\Facades\Log;
use App\Http\Resources\TurnirResource;
use App\Models\Turnir;
use Illuminate\Http\Request;
use MongoDB\Driver\Exception\Exception as MongoDBException;
 
 
class TurnirController extends Controller
{
    public function index()
    {
        try {
            $turniri = Turnir::all(); 
            return TurnirResource::collection($turniri);
        } catch (\Exception $e) {
            \Log::error($e->getMessage());
            return response()->json(['error' => 'An error occurred'], 500);
        }
    }
    public function store(Request $request)
    {
 
    }


 
    public function show($id)
    {
        try{
            $turnir = Turnir::findOrFail($id);
            return response()->json($turnir, 200);
        }
        catch (\Exception $e) {
            \Log::error($e->getMessage());
            return response()->json(['error' => 'An error occurred'], 500);
        }
    }
 
    public function update(Request $request, $id)
    {
        try{
            $turnir = Turnir::findOrFail($id);
            $turnir->update($request->all());
            return response()->json($turnir, 200);
        }
        catch (\Exception $e) {
            \Log::error($e->getMessage());
            return response()->json(['error' => 'An error occurred'], 500);
        }
    }
 
    public function destroy($id)
    {
        try{
            Turnir::destroy($id);
            return response()->json(null, 204);
        }
        catch (\Exception $e) {
            \Log::error($e->getMessage());
            return response()->json(['error' => 'An error occurred'], 500);
        }
    }
 
  
 
  
}