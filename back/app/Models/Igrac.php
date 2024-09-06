<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model as Eloquent;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use MongoDB\Laravel\Relations\BelongsToMany;
use MongoDB\Laravel\Relations\HasMany;
class Igrac extends Eloquent
{
    use HasFactory;
    protected $connection = 'mongodb';
    protected $collection = 'igraci';

    protected $fillable = [
        'ime', 
        'prezime',
        'pozicija', 
        
    ];

    protected $casts = [
       
    ];

    public function statistika_igraca():HasMany
    {
        return $this->hasMany(StatistikaIgraca::class);
    }


    public function timovi():BelongsToMany
    {
        return $this->belongsToMany(Tim::class);
    }
}
