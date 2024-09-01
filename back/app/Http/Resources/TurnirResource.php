<?php

namespace App\Http\Resources;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\UtakmicaResource;
class TurnirResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {

        $user = Auth::user();
        $omiljeni = $user->tournaments()->where('_id',$this->id)->exists();

        return [
            'id' => $this->id,
            'naziv' => $this->naziv,
            'mesto_odrzavanja' => $this->mesto_odrzavanja,
            'broj_ekipa' => $this->broj_ekipa,
            'logo'=>$this->logo,
            'utakmice' => UtakmicaResource::collection($this->utakmice),
            'omiljeni'=> $omiljeni
        ];
    }
}
