<?php
 
namespace App\Http\Controllers;
 
use App\Models\Igrac;
use Illuminate\Http\Request;
use App\Http\Resources\IgracResource;
class IgracController extends Controller
{
    public function index()
    {
        try {
            $igraci = Igrac::all();
            return IgracResource::collection($igraci);
        } catch (\Exception $e) {
            \Log::error($e->getMessage());
            return response()->json(['error' => 'An error occurred'], 500);
        }
    }
 
    public function store(Request $request)
    {
        try{
            $igrac = Igrac::create($request->all());
            return response()->json($igrac, 201);
        }
        catch (\Exception $e) {
            \Log::error($e->getMessage());
            return response()->json(['error' => 'An error occurred'], 500);
        }
    }
 
    public function show($id)
    {
        try{
            $igrac = Igrac::findOrFail($id);
            \Log::info($igrac);
            return response()->json(new IgracResource($igrac));
        }
        catch (\Exception $e) {
            \Log::error($e->getMessage());
            return response()->json(['error' => 'An error occurred'], 500);
        }
    }
 
    public function update(Request $request, $id)
    {
        try{
            $igrac = Igrac::findOrFail($id);
            $igrac->update($request->all());
            return response()->json($igrac, 200);
        }
        catch (\Exception $e) {
            \Log::error($e->getMessage());
            return response()->json(['error' => 'An error occurred'], 500);
        }
    }
 
    public function destroy($id)
    {
        try{
            Igrac::destroy($id);
        return response()->json(null, 204);
        }
        catch (\Exception $e) {
            \Log::error($e->getMessage());
            return response()->json(['error' => 'An error occurred'], 500);
        }
    }
 
   
 
}