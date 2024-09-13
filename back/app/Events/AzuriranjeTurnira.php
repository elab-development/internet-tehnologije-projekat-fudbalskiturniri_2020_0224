<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use App\Http\Resources\TurnirResource;
class AzuriranjeTurnira implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets;
    public $turnir_id;

    public function __construct($turnir_id)
    {
        $this->turnir_id = $turnir_id;
    }

    public function broadcastOn()
    {
        return new Channel('turnir.' . $this->turnir_id);
    }

    public function broadcastAs()
    {
        return 'promena_turnira';
    }

    public function broadcastWith()
    {
        return [
            'data' => $this->turnir_id
        ];
    }
}
