<?php
 
namespace App\Http\Controllers;
use Illuminate\Support\Facades\Log;
use App\Http\Resources\TurnirResource;
use App\Models\Turnir;
use Illuminate\Http\Request;
use MongoDB\Driver\Exception\Exception as MongoDBException;
use App\Models\Utakmica;
use App\Models\StatistikaUtakmice;
use App\Models\StatistikaIgraca;
use App\Models\Tim;
use App\Models\Igrac;
use MongoDB\Client;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;  
 
 
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
        $validated = $request->validate([
            'naziv' => 'required|string',
            'mesto_odrzavanja' => 'required|string',
            'logo' => 'nullable|string',
            'timovi' => 'required|array',
            'timovi.*.naziv' => 'required|string',
            'timovi.*.mesto' => 'required|string',
            'timovi.*.id' => 'nullable|string',
            'broj_ekipa' => 'required|integer',
            'timovi.*.igraci' => 'required|array',
            'timovi.*.igraci.*.ime' => 'required|string',
            'timovi.*.igraci.*.prezime' => 'required|string',
            'timovi.*.igraci.*.pozicija' => 'required|string|in:Branič,Vezni,Napadač',
            'timovi.*.igraci.*.id' => 'nullable|string',
        ]);

        $client = DB::connection('mongodb')->getMongoClient();
        $session = $client->startSession();
        $session->startTransaction();

        try {
            $tournament = Turnir::create([
                'naziv' => $validated['naziv'],
                'mesto_odrzavanja' => $validated['mesto_odrzavanja'],
                'logo' => $validated['logo'],
                'broj_ekipa' => $validated['broj_ekipa'],
            ]);

            $teams = [];
            foreach ($validated['timovi'] as $teamData) {
                if (is_null($teamData['id'])) {
                    $team = Tim::create([
                        'naziv' => $teamData['naziv'],
                        'mesto' => $teamData['mesto'],
                    ]);

                    $tournament->timovi()->save($team);
                } else {
                    $team = Tim::find($teamData['id']);
                    if (!$team) {
                        $session->abortTransaction();
                        return response()->json(['success' => false, 'message' => 'Team not found'], 404);
                    }

                    $tournament->timovi()->save($team);
                }

                foreach ($teamData['igraci'] as $playerData) {
                    if (is_null($playerData['id'])) {
                        $player = new Igrac();
                        $player->ime = $playerData['ime'];
                        $player->prezime = $playerData['prezime'];
                        $player->pozicija = $playerData['pozicija'];


                        $team->igraci()->save($player);


                    } else {
                        $player = Igrac::find($playerData['id']);
                        $existingStats = $player->statistika_igraca;


                        if (!$player) {
                            $session->abortTransaction();
                            return response()->json(['success' => false, 'message' => 'Player not found'], 404);
                        }
                        $team->igraci()->save($player);

                    }
                }

                $teams[] = $team;
            }


            $numGames = $validated['broj_ekipa'] - 1;
            $brojUtakmice = $numGames;

            while (count($teams) > 1) {

                $domaci = array_splice($teams, array_rand($teams), 1)[0];
                $gostujuci = array_splice($teams, array_rand($teams), 1)[0];

                $game = Utakmica::create([
                    'broj_utakmice' => $brojUtakmice,
                    'status'=>'not_started',
                    'golovi_domaci_tim' => 0,
                    'golovi_gostujuci_tim' => 0,
                    'domaci_tim' => $domaci->_id, 
                    'gostujuci_tim' => $gostujuci->_id, 
                    'pobednik_id' => null, 
                    'turnir_id' => $tournament->_id 
                ]);

                $gameStats = StatistikaUtakmice::create([
                    'sutevi_domacina'=>0,
                    'sutevi_gosta'=>0,
                    'sutevi_u_gol_domacina'=>0,
                    'sutevi_van_gola_domacina'=>0,
                    'sutevi_u_gol_gosta'=>0,
                    'sutevi_van_gola_gosta'=>0,
                    'faulovi_domacina'=>0,
                    'faulovi_gosta'=>0,
                    'posed_lopte_domacina'=>50,
                    'posed_lopte_gosta'=>50
                ]);
                $game->statistika_utakmice()->save($gameStats);


                foreach ([$domaci, $gostujuci] as $team) {
                    foreach ($team->igraci as $player) {
                        $playerStats = StatistikaIgraca::create([
                            'golovi' => 0,
                            'asistencije' => 0,
                            'zuti_kartoni' => 0,
                            'crveni_kartoni' => 0,
                            'faulovi' => 0,
                            'sutevi_u_gol' => 0,
                            'sutevi_van_gola' => 0,
                            'igrac_id' => $player->_id,
                            'utakmica_id' => $game->_id 
                        ]);

                        $player->statistika_igraca()->save($playerStats);
                    }
                }


                $game->domaci()->associate($domaci);
                $game->gostujuci()->associate($gostujuci);
                $game->turnir()->associate($tournament);
                $game->save();
                $brojUtakmice--;
            }


            while ($brojUtakmice > 0) {
                $game = Utakmica::create([
                    'broj_utakmice' => $brojUtakmice,
                    'status'=>'not_started',
                    'golovi_domaci_tim' => 0,
                    'golovi_gostujuci_tim' => 0,
                    'domaci_tim' => null, 
                    'gostujuci_tim' => null,
                    'pobednik_id' => null, 
                    'turnir_id' => $tournament->_id
                ]);

                $gameStats = StatistikaUtakmice::create([
                    'sutevi_domacina'=>0,
                    'sutevi_gosta'=>0,
                    'sutevi_u_gol_domacina'=>0,
                    'sutevi_van_gola_domacina'=>0,
                    'sutevi_u_gol_gosta'=>0,
                    'sutevi_van_gola_gosta'=>0,
                    'faulovi_domacina'=>0,
                    'faulovi_gosta'=>0,
                    'posed_lopte_domacina'=>50,
                    'posed_lopte_gosta'=>50
                ]);
                $game->statistika_utakmice()->save($gameStats);

                $game->turnir()->associate($tournament);
                $game->save();

                $brojUtakmice--;
            }

            $session->commitTransaction();

            return response()->json(['success' => true, 'tournament' => $tournament], 201);
        } catch (MongoDBException $e) {
            \Log::error($e->getMessage());
            $session->abortTransaction();
            return response()->json(['success' => false, 'message' => 'An error occurred: ' . $e->getMessage()], 500);
        }
    }


 
    public function show($id)
    {
        try{
            $turnir = Turnir::findOrFail($id);
            return new ($tournament);
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
 
    public function addToFavorite(Request $request,$id){
        try{
            $user = Auth::user();
            $tournament = Turnir::findOrFail($id);
            $user->turniri()->save($tournament);
            return response()->json(['success' => true, 'message' => 'Uspesno dodat turnir u omiljene: ' ], 200);
        }
        catch (\Exception $e) {
            \Log::error($e->getMessage());
            return response()->json(['success' => false,'message' => 'Nije uspesno dodat turnir u omiljene'], 500);
        }


    }

    public function removeFromFavorites(Request $request,$id){

        try{
            $user = Auth::user();
            $tournament = Turnir::findOrFail($id);
            $user->turniri()->detach($tournament->_id);
            $tournament->users()->detach($user->_id);

            return response()->json(['success' => true, 'message' => 'Uspesno uklonjen turnir iz omiljenih: ' ], 200);
        }
        catch (\Exception $e) {
            \Log::error($e->getMessage());
            return response()->json(['success' => false,'message' => 'Nije uspesno uklonjen turnir iz omiljenih'], 500);
        }

    }

    public function getFavorites(Request $request){
        try{
            $user = Auth::user();
            return TurnirResource::collection($user->turniri);
        }
        catch (\Exception $e) {
            \Log::error($e->getMessage());
            return response()->json(['success' => false, 'message' => 'Ne mogu da se vrate turniri: ' . $e->getMessage()], 500);
        }
    }
 
  
}