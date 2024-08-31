<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model as Eloquent;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use MongoDB\Laravel\Relations\BelongsToMany;
use MongoDB\Laravel\Relations\HasMany;
class Turnir extends Eloquent
{
    use HasFactory;
    protected $connection = 'mongodb';
    protected $collection = 'turniri';

    protected $fillable = [
        'naziv', 
        'mesto_odrzavanja', 
        'broj_ekipa',
        'logo',
        
    ];

    protected $casts = [
       
        
    ];



    public function timovi():BelongsToMany{
        return $this->belongsToMany(Tim::class);
    }


    public function utakmice():HasMany
    {
        return $this->hasMany(Utakmica::class);
    }


    public function users():BelongsToMany
    {
        return $this->belongsToMany(User::class);
    }
}

