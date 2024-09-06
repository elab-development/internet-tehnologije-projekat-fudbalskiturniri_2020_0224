<?php
 
namespace App\Http\Controllers;
 
use App\Models\Igrac;
use Illuminate\Http\Request;
use App\Http\Resources\IgracResource;
use Illuminate\Support\Facades\Log;
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
 
    public function getAllPlayersWithAllStatistics(Request $request)
    {
        try {
    
            $perPage = $request->input('perPage', 20);
    
    
            $igraci = Igrac::paginate($perPage);
    
    
            foreach ($igraci as $igrac) {
                $statistika = $igrac->statistika_igraca;
    
                $kumulativna_statistika = [
                    'golovi' => $statistika->sum('golovi'),
                    'asistencije' => $statistika->sum('asistencije'),
                    'faulovi' => $statistika->sum('faulovi'),
                    'zuti_kartoni' => $statistika->sum('zuti_kartoni'),
                    'crveni_kartoni' => $statistika->sum('crveni_kartoni'),
                    'sutevi_u_gol' => $statistika->sum('sutevi_u_gol'),
                    'sutevi_van_gola' => $statistika->sum('sutevi_van_gola'),
                ];
    
    
                $igrac->kumulativna_statistika = $kumulativna_statistika;
            }
    
    
            return IgracResource::collection($igraci);
        } catch (\Exception $e) {
            \Log::error($e->getMessage());
            return response()->json(['error' => 'Greska u citanju podataka'], 500);
        }
    }
 
}