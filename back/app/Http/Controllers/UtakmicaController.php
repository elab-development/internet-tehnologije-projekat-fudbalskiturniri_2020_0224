<?php
 
namespace App\Http\Controllers;
use App\Http\Resources\UtakmicaResource;
use App\Models\Utakmica;
use App\Models\Tim;
use Illuminate\Http\Request;
use App\Models\Turnir;
use App\Events\AzuriranjeTurnira;
use App\Models\StatistikaIgraca;
use App\Events\StatistikaUtakmiceUpdated;
use Illuminate\Support\Facades\Log;

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
            $game = Utakmica::findOrFail($id);

            
            $gameStats = $game->statistika_utakmice;
            $gameStats->sutevi_u_gol_domacina = array_sum($request->input('domaci_tim.igraci.shotsOnTarget'));
            $gameStats->sutevi_van_gola_domacina = array_sum($request->input('domaci_tim.igraci.shotsOffTarget'));
            $gameStats->sutevi_u_gol_gosta = array_sum($request->input('gostujuci_tim.igraci.shotsOnTarget'));
            $gameStats->sutevi_van_gola_gosta = array_sum($request->input('gostujuci_tim.igraci.shotsOffTarget'));
            $gameStats->sutevi_domacina= $gameStats->sutevi_u_gol_domacina +   $gameStats->sutevi_van_gola_domacina;
            $gameStats->sutevi_gosta=$gameStats->sutevi_u_gol_gosta +  $gameStats->sutevi_van_gola_gosta;
            $gameStats->posed_lopte_domacina = $request->input('domaci_tim.possession');
            $gameStats->posed_lopte_gosta = $request->input('gostujuci_tim.possession');
            $gameStats->save();

           
            $homeTeamStats = $request->input('domaci_tim.igraci');
            $totalHomeGoals = 0; 
            foreach ($homeTeamStats['id'] as $index => $playerId) {
                $playerStats = StatistikaIgraca::where('utakmica_id', $id)
                                        ->where('igrac_id', $playerId)
                                        ->firstOrFail();
                $playerStats->golovi = $homeTeamStats['goals'][$index];
                $totalHomeGoals += $homeTeamStats['goals'][$index];
                $playerStats->asistencije = $homeTeamStats['assists'][$index];
                $playerStats->zuti_kartoni = $homeTeamStats['yellowCards'][$index];
                $playerStats->crveni_kartoni = $homeTeamStats['redCards'][$index];
                $playerStats->sutevi_u_gol = $homeTeamStats['shotsOnTarget'][$index];
                $playerStats->sutevi_van_gola = $homeTeamStats['shotsOffTarget'][$index];
                $playerStats->save();
            }
            \Log::info($totalHomeGoals);

            $awayTeamStats = $request->input('gostujuci_tim.igraci');
            $totalAwayGoals = 0; 
            foreach ($awayTeamStats['id'] as $index => $playerId) {
                $playerStats = StatistikaIgraca::where('utakmica_id', $id)
                                        ->where('igrac_id', $playerId)
                                        ->firstOrFail();
                $playerStats->golovi = $awayTeamStats['goals'][$index];
                $totalAwayGoals += $awayTeamStats['goals'][$index];
                $playerStats->asistencije = $awayTeamStats['assists'][$index];
                $playerStats->zuti_kartoni = $awayTeamStats['yellowCards'][$index];
                $playerStats->crveni_kartoni = $awayTeamStats['redCards'][$index];
                $playerStats->sutevi_u_gol = $awayTeamStats['shotsOnTarget'][$index];
                $playerStats->sutevi_van_gola = $awayTeamStats['shotsOffTarget'][$index];
                $playerStats->save();
            }

          
            $game->golovi_domaci_tim = $totalHomeGoals;
            $game->golovi_gostujuci_tim = $totalAwayGoals;
            $game->save();

            \Log::info($game->golovi_domaci_tim);
            \Log::info($game->golovi_gostujuci_tim);
            broadcast(new StatistikaUtakmiceUpdated($game->_id));
            broadcast(new AzuriranjeTurnira($game->turnir_id));
            return response()->json(['message' => 'Game and player stats updated successfully']);
        }
        catch (\Exception $e) {
            \Log::error($e->getMessage());
            return response()->json(['error' => 'An error occurred'], 500);
        }
        
    }
 
    public function updateWinner(Request $request,$id){
        try{
            $game = Utakmica::findOrFail($id);
            $home_team_goals = $game->golovi_domaci_tim;
            $away_team_goals = $game->golovi_gostujuci_tim;
            if($home_team_goals>$away_team_goals || $home_team_goals<$away_team_goals){
                $game->status = 'completed';
            }
            else{
                return response()->json(['stat'=>false,'message' => 'Broj golova ne sme biti jednak da bi se zavrsila utakmica']);
            }
            if($home_team_goals>$away_team_goals){
                $game->pobednik_id =$game->domaci_tim;
            }
            else{
                $game->pobednik_id = $game->gostujuci_tim;
            }
    
            $br = $game->broj_utakmice;
            if($br!==1){
                $new_game_num = intdiv($br,2);
                $matchingGame = Utakmica::where('broj_utakmice', $new_game_num)
                ->where('turnir_id', $game->turnir_id)
                ->first();
               
    
                function createPlayerStatsForTeam($team, $gameId) {
                    \Log::info($team);
                    foreach ($team->igraci as $player) {
                        $playerStats = StatistikaIgraca::create([
                            'golovi' => 0,
                            'asistencije' => 0,
                            'zuti_kartoni' => 0,
                            'crveni_kartoni' => 0,
                            'sutevi_u_gol' => 0,
                            'sutevi_van_gola' => 0,
                            'igrac_id' => $player->_id,
                            'utakmica_id' => $gameId
                        ]);
                
                        $player->statistika_igraca()->save($playerStats);
                    }
                }
                
               
                
    
                $home = $br%2;
                if($home){
                    $matchingGame->domaci()->associate($game->pobednik_id);
                    $homeTeam = $matchingGame->domaci;
                    \Log::info($matchingGame);
                    createPlayerStatsForTeam($homeTeam, $matchingGame->_id);
                 
            
               
                }
                else{
                    $matchingGame->gostujuci()->associate($game->pobednik_id);
                    $awayTeam = $matchingGame->gostujuci;
                    createPlayerStatsForTeam($awayTeam, $matchingGame->_id);
                   
                }
                $matchingGame->save();
            }
          
    
            $game->save();
          
            return response()->json(['stat'=>true,'message' => 'Uspesno zavrsena utakmica']);
        }
        catch (\Exception $e) {
            \Log::error($e->getMessage());
            return response()->json(['error' => 'An error occurred'], 500);
        }
      

    }
 
    public function updateStatus(Request $request,$id){
        try{
            $utakmica = Utakmica::findOrFail($id);
            $utakmica->status = $request->input('status');
            $utakmica->save();
            broadcast(new AzuriranjeTurnira($utakmica->turnir_id));
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