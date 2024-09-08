<?php
 
namespace App\Http\Controllers;
use App\Http\Resources\UtakmicaResource;
use App\Models\Utakmica;
use App\Models\Tim;
use Illuminate\Http\Request;
use App\Models\Tournament;
use App\Models\Turnir;
 
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

            
            $gameStats = $game->stats_game;
            $gameStats->sut_u_okvir_domacin = array_sum($request->input('home_team.players.shotsOnTarget'));
            $gameStats->sut_van_okvira_domacin = array_sum($request->input('home_team.players.shotsOffTarget'));
            $gameStats->sut_u_okvir_gost = array_sum($request->input('away_team.players.shotsOnTarget'));
            $gameStats->sut_van_okvira_gost = array_sum($request->input('away_team.players.shotsOffTarget'));
            $gameStats->broj_suteva_domacin= $gameStats->sut_u_okvir_domacin +   $gameStats->sut_van_okvira_domacin;
            $gameStats->broj_suteva_gost=$gameStats->sut_u_okvir_gost +  $gameStats->sut_van_okvira_gost;
            $gameStats->posed_lopte_domacin = $request->input('home_team.possession');
            $gameStats->posed_lopte_gost = $request->input('away_team.possession');
            $gameStats->save();

           
            $homeTeamStats = $request->input('home_team.players');
            $totalHomeGoals = 0; 
            foreach ($homeTeamStats['id'] as $index => $playerId) {
                $playerStats = PlayerStats::where('game_id', $id)
                                        ->where('player_id', $playerId)
                                        ->firstOrFail();
                $playerStats->broj_golova = $homeTeamStats['goals'][$index];
                $totalHomeGoals += $homeTeamStats['goals'][$index];
                $playerStats->broj_asistencija = $homeTeamStats['assists'][$index];
                $playerStats->broj_zutih_kartona = $homeTeamStats['yellowCards'][$index];
                $playerStats->broj_crvenih_kartona = $homeTeamStats['redCards'][$index];
                $playerStats->broj_suta_u_ovkir = $homeTeamStats['shotsOnTarget'][$index];
                $playerStats->broj_suta_van_okvira = $homeTeamStats['shotsOffTarget'][$index];
                $playerStats->save();
            }

            $awayTeamStats = $request->input('away_team.players');
            $totalAwayGoals = 0; 
            foreach ($awayTeamStats['id'] as $index => $playerId) {
                $playerStats = PlayerStats::where('game_id', $id)
                                        ->where('player_id', $playerId)
                                        ->firstOrFail();
                $playerStats->broj_golova = $awayTeamStats['goals'][$index];
                $totalAwayGoals += $awayTeamStats['goals'][$index]; 
                $playerStats->broj_asistencija = $awayTeamStats['assists'][$index];
                $playerStats->broj_zutih_kartona = $awayTeamStats['yellowCards'][$index];
                $playerStats->broj_crvenih_kartona = $awayTeamStats['redCards'][$index];
                $playerStats->broj_suta_u_ovkir = $awayTeamStats['shotsOnTarget'][$index];
                $playerStats->broj_suta_van_okvira = $awayTeamStats['shotsOffTarget'][$index];
                $playerStats->save();
            }

          
            $game->broj_golova_domacin = $totalHomeGoals;
            $game->broj_golova_gost = $totalAwayGoals;
            $game->save();


            broadcast(new MatchStatsUpdated($game->_id));
            broadcast(new TournamentUpdated($game->tournament_id));
            return response()->json(['message' => 'Game and player stats updated successfully']);
        }
        catch (\Exception $e) {
            \Log::error($e->getMessage());
            return response()->json(['error' => 'An error occurred'], 500);
        }
        
    }
 
    public function updateWinner(Request $request,$id){
        try{
            $game = Game::findOrFail($id);
            $home_team_goals = $game->broj_golova_domacin;
            $away_team_goals = $game->broj_golova_gost;
            if($home_team_goals>$away_team_goals || $home_team_goals<$away_team_goals){
                $game->status = 'completed';
            }
            else{
                return response()->json(['stat'=>false,'message' => 'Broj golova ne sme biti jednak da bi se zavrsila utakmica']);
            }
            if($home_team_goals>$away_team_goals){
                $game->pobednik =$game->tim1;
            }
            else{
                $game->pobednik = $game->tim2;
            }
    
            $br = $game->broj_utakmice;
            if($br!==1){
                $new_game_num = intdiv($br,2);
                $matchingGame = Game::where('broj_utakmice', $new_game_num)
                ->where('tournament_id', $game->tournament_id)
                ->first();
               
    
                function createPlayerStatsForTeam($team, $gameId) {
                    foreach ($team->players as $player) {
                        $playerStats = PlayerStats::create([
                            'broj_golova' => 0,
                            'broj_asistencija' => 0,
                            'broj_zutih_kartona' => 0,
                            'broj_crvenih_kartona' => 0,
                            'broj_suta_u_ovkir' => 0,
                            'broj_suta_van_okvira' => 0,
                            'player_id' => $player->_id,
                            'game_id' => $gameId
                        ]);
                
                        $player->stats_player()->save($playerStats);
                    }
                }
                
               
                
    
                $home = $br%2;
                if($home){
                    $matchingGame->team1()->associate($game->pobednik);
                    $homeTeam = $matchingGame->team1;
                    createPlayerStatsForTeam($homeTeam, $matchingGame->_id);
                 
            
               
                }
                else{
                    $matchingGame->team2()->associate($game->pobednik);
                    $awayTeam = $matchingGame->team2;
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
            $game = Game::findOrFail($id);
            $game->status = $request->input('status');
            $game->save();
            broadcast(new TournamentUpdated($game->tournament_id));
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