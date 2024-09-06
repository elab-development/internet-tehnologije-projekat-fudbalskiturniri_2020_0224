<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use MongoDB\Laravel\Relations\HasOne;
use MongoDB\Laravel\Relations\HasMany;
use MongoDB\Laravel\Eloquent\Model as Eloquent;
use MongoDB\Laravel\Relations\BelongsTo;
class Utakmica extends Eloquent
{
    use HasFactory;


    protected $connection = 'mongodb';
    protected $collection = 'utakmice';

    protected $fillable = [
        
        'golovi_domaci_tim',
        'golovi_gostujuci_tim',
        'domaci_tim',
        'gostujuci_tim',
        'pobednik_id',
        'turnir_id',
        'status',
        'broj_utakmice'
     
       
    ];

    public function statistika_utakmice():HasOne
    {
        return $this->hasOne(StatistikaUtakmice::class);
    }

    public function statistika_igraca():HasMany{
        return $this->hasMany(StatistikaIgraca::class);
    }
    

    public function turnir():BelongsTo
    {
        return $this->belongsTo(Turnir::class);
    }

    public function domaci():BelongsTo
    {
        return $this->belongsTo(Tim::class, 'domaci_tim');
    }

    public function gostujuci():BelongsTo
    {
        return $this->belongsTo(Tim::class, 'gostujuci_tim');
    }

    public function pobednik():BelongsTo
    {
        return $this->belongsTo(Tim::class, 'pobednik_id');
    }
}
