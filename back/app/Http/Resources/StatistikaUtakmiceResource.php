<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StatistikaUtakmiceResource extends JsonResource
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
        'sutevi_domacina'=>$this->sutevi_domacina,
        'sutevi_gosta'=>$this->sutevi_gosta, 
        'sutevi_u_gol_domacina'=>$this->sutevi_u_gol_domacina ,
        'sutevi_van_gola_domacina'=>$this-> sutevi_van_gola_domacina,
        'sutevi_van_gola_gosta'=>$this-> sutevi_van_gola_gosta,
        'sut_van_okvira_gost'=>$this-> sut_van_okvira_gost,
        'faulovi_domacina'=>$this-> faulovi_domacina,
        'faulovi_gosta'=>$this-> faulovi_gosta,
        'posed_lopte_domacina'=>$this-> posed_lopte_domacina,
        'posed_lopte_gosta'=>$this-> posed_lopte_gosta
           
        ];
    }
}