<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use App\Http\Resources\UtakmicaResource;

class StatistikaUtakmiceUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets;

    public $utakmica_id;

    public function __construct($utakmica_id)
    {
        $this->utakmica_id = $utakmica_id;
    }

    public function broadcastOn()
    {
        return new Channel('utakmica.' . $this->utakmica_id);
    }

    public function broadcastAs()
    {
        return 'promena-statistika';
    }

    public function broadcastWith()
    {
        return [
            'data' => $this->utakmica_id
        ];
    }
}
