<?php
 
namespace App\Models;
 
use MongoDB\Laravel\Eloquent\Model as Eloquent;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use MongoDB\Laravel\Relations\BelongsToMany;
use MongoDB\Laravel\Relations\HasMany;
 
class Tim extends Eloquent
 
{
    use HasFactory;
    protected $connection = 'mongodb';
    protected $collection = 'timovi';
 
    protected $fillable = [
        'naziv',
        'mesto'
    ];
 
 
    public function utakmice():HasMany{
        return $this->hasMany(Utakmica::class);
    }
 
    public function turniri():BelongsToMany{
        return $this->belongsToMany(Turnir::class);
    }
 
 
 
   
 
    public function igraci():BelongsToMany
    {
        return $this->belongsToMany(Igrac::class);
    }
}
 