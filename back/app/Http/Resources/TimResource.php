<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\IgracResource;

class TimResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'naziv' => $this->naziv,
            'mesto' => $this->mesto,
             'igraci' => IgracResource::collection($this->igraci),
        ];
    }
}
