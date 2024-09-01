<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\StatistikaIgracaResource;

class IgracResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $utakmicaId = $request->route('id'); 
    

        
        $statistika_igraca = $this->stats_player()->firstWhere('utakmica_id', $utakmicaId);
        
       

        return [
            'id' => $this->id,
            'ime' => $this->ime,
            'prezime' => $this->prezime,
            'pozicija' => $this->pozicija,
            'statistika_igraca' => $statistika_igraca ? new StatistikaIgracaResource($statistika_igraca) : null,
            'kumulativna_statistika' => $this->kumulativna_statistika,
        ];
    }
}
