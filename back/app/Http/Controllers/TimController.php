<?php
 
namespace App\Http\Controllers;
use App\Http\Resources\TimResource;
use App\Models\Tim;
use App\Models\Igrac;
use Illuminate\Http\Request;
 
class TimController extends Controller
{
    public function index()
    {
        try {
            $timovi = Tim::all(); 
            return TimResource::collection($timovi);
        } catch (\Exception $e) {
            \Log::error($e->getMessage());
            return response()->json(['error' => 'An error occurred'], 500);
        }
    }
 
    public function store(Request $request)
{
    try {
        $tim = Tim::create(['naziv'=> $request-> input('naziv'),
                            'mesto'=> $request-> input('mesto')]);
 
       
        foreach ($request->input('igraci') as $igrac) {
            if (!empty($igrac['id'])) {
                $igracBaza = Igrac::find($igrac['id']);
                if ($igracBaza) {
                    $tim->igraci()->attach($igracBaza);
                }
            } else {
                $novIgrac = new Igrac([
                    'ime' => $igrac['ime'],
                    'prezime' => $igrac['prezime'],
                    'pozicija' => $igrac['pozicija'],
                ]);
                $novIgrac->save();
                $tim->igraci()->attach($novIgrac);
            }
        }
 
        return response()->json($tim, 201);
    } catch (\Exception $e) {
        \Log::error($e->getMessage());
        return response()->json(['error' => 'An error occurred'], 500);
    }
}
 
 
    public function show($id)
    {
        try{
            $tim = Tim::with('igraci')->findOrFail($id);
        return new TimResource($tim);
        }
        catch (\Exception $e) {
            \Log::error($e->getMessage());
            return response()->json(['error' => 'An error occurred'], 500);
        }
    }
 
   
        public function update(Request $request, $id)
        {
            try {
                $tim = Tim::findOrFail($id);

                $tim->update($request->all());
                $postojeciIgraci = $tim->igraci->pluck('id')->toArray();

                $noviIgraci = [];

                foreach ($request->input('igraci') as $igrac) {
                    if (!empty($igrac['id'])) {
                        $igracBaza = Igrac::find($igrac['id']);
                        if ($igracBaza) {
                            $noviIgraci[] = $igracBaza->id;
                        }
                    } else {
                        $novIgrac = new Igrac([
                            'ime' => $igrac['ime'],
                            'prezime' => $igrac['prezime'],
                            'pozicija' => $igrac['pozicija'],
                        ]);
                        $novIgrac->save();
                        $noviIgraci[] = $novIgrac->id;
                    }
                }

                $tim->igraci()->sync($noviIgraci);
                return response()->json($tim, 200);
            } catch (\Exception $e) {
                \Log::error($e->getMessage());
                return response()->json(['error' => 'An error occurred'], 500);
            }
        }


 
    public function destroy($id)
    {
        try{
            $tim = Tim::findOrFail($id);
            $tim->igraci()->detach();
            $tim->delete();
            return response()->json(null, 204);
        }
        catch (\Exception $e) {
            \Log::error($e->getMessage());
            return response()->json(['error' => 'An error occurred'], 500);
        }
    }
}