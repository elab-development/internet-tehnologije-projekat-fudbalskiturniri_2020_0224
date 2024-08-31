<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use MongoDB\Laravel\Eloquent\Model as Eloquent;
use MongoDB\Laravel\Relations\BelongsTo;

class StatistikaIgraca extends Eloquent
{
    use HasFactory;

    protected $connection = 'mongodb';
    protected $collection = 'statistika_igraca';


    protected $fillable = [
        'golovi', 
        'asistencije', 
        'zuti_kartoni',
        'crveni_kartoni',
        'faulovi',
        'sutevi_u_gol',
        'sutevi_van_gola',
        'igrac_id',
        'utakmica_id'
        
    ];

    public function igrac():BelongsTo
    {
        return $this->belongsTo(Igrac::class);
    }

    public function utakmica():BelongsTo
    {
        return $this->belongsTo(Utakmica::class);
    }


}
