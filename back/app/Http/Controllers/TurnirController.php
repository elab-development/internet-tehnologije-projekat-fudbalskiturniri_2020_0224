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
            'name' => 'required|string',
            'place' => 'required|string',
            'logo' => 'nullable|string',
            'teams' => 'required|array',
            'teams.*.name' => 'required|string',
            'teams.*.place' => 'required|string',
            'teams.*.id' => 'nullable|string',
            'numTeams' => 'required|integer',
            'teams.*.players' => 'required|array',
            'teams.*.players.*.name' => 'required|string',
            'teams.*.players.*.surname' => 'required|string',
            'teams.*.players.*.pozicija' => 'required|string|in:Branič,Vezni,Napadač',
            'teams.*.players.*.id' => 'nullable|string',
        ]);

        $client = DB::connection('mongodb')->getMongoClient();
        $session = $client->startSession();
        $session->startTransaction();

        try {
            $tournament = Turnir::create([
                'ime' => $validated['name'],
                'mesto' => $validated['place'],
                'logo' => $validated['logo'],
                'broj_timova' => $validated['numTeams'],
            ]);

            $teams = [];
            foreach ($validated['teams'] as $teamData) {
                if (is_null($teamData['id'])) {
                    $team = Tim::create([
                        'ime' => $teamData['name'],
                        'mesto' => $teamData['place'],
                    ]);

                    $tournament->teams()->save($team);
                } else {
                    $team = Tim::find($teamData['id']);
                    if (!$team) {
                        $session->abortTransaction();
                        return response()->json(['success' => false, 'message' => 'Team not found'], 404);
                    }

                    $tournament->teams()->save($team);
                }

                foreach ($teamData['players'] as $playerData) {
                    if (is_null($playerData['id'])) {
                        $player = new Igrac();
                        $player->ime = $playerData['name'];
                        $player->prezime = $playerData['surname'];
                        $player->pozicija = $playerData['pozicija'];


                        $team->players()->save($player);


                    } else {
                        $player = Igrac::find($playerData['id']);
                        $existingStats = $player->stats_player;


                        if (!$player) {
                            $session->abortTransaction();
                            return response()->json(['success' => false, 'message' => 'Player not found'], 404);
                        }
                        $team->players()->save($player);

                    }
                }

                $teams[] = $team;
            }


            $numGames = $validated['numTeams'] - 1;
            $brojUtakmice = $numGames;

            while (count($teams) > 1) {

                $domaci = array_splice($teams, array_rand($teams), 1)[0];
                $gostujuci = array_splice($teams, array_rand($teams), 1)[0];

                $game = Igrac::create([
                    'broj_utakmice' => $brojUtakmice,
                    'status'=>'not_started',
                    'golovi_domaci_tim' => 0,
                    'golovi_gostujuci_tim' => 0,
                    'domaci_tim' => $domaci->_id, 
                    'gostujuci_tim' => $gostujuci->_id, 
                    'pobednik' => null, 
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
                $game->stats_game()->save($gameStats);


                foreach ([$domaci, $gostujuci] as $team) {
                    foreach ($team->players as $player) {
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

                        $player->stats_player()->save($playerStats);
                    }
                }


                $game->team1()->associate($domaci);
                $game->team2()->associate($gostujuci);
                $game->tournament()->associate($tournament);
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
                    'pobednik' => null, 
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
                $game->stats_game()->save($gameStats);

                $game->tournament()->associate($tournament);
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