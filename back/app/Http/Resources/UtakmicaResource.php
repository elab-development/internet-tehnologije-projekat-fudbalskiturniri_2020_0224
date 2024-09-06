<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UtakmicaResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'status'=>$this->status,
            'broj_utakmice' => $this->broj_utakmice,
            'golovi_domaci_tim' => $this->golovi_domaci_tim,
            'golovi_gostujuci_tim'=>$this->golovi_gostujuci_tim,
            'domaci_tim' => new TimResource($this->domaci),
            'gostujuci_tim' => new TimResource($this->gostujuci),
            'pobednik' => new TimResource($this->pobednik),
            'statistika_utakmice'=>new StatistikaUtakmiceResource($this->statistika_utakmice)
           
        ];
    }
}