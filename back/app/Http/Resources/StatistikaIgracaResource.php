<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StatistikaIgracaResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
        'id'=>$this->_id,
        'golovi'=>$this->golovi,
        'asistencije'=>$this->asistencije,
        'zuti_kartoni'=>$this->zuti_kartoni,
        'crveni_kartoni'=>$this->crveni_kartoni,
        'faulovi'=>$this->faulovi,
        'sutevi_u_gol'=>$this->sutevi_u_gol,
        'sutevi_van_gola'=>$this->sutevi_van_gola,
        'igrac_id'=>$this->igrac_id,
        'utakmica_id'=>$this->utakmica_id
           
        ];
    }
}