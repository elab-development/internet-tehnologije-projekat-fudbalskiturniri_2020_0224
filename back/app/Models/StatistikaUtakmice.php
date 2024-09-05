<?php
 
namespace App\Models;
 
use Illuminate\Database\Eloquent\Factories\HasFactory;
use MongoDB\Laravel\Eloquent\Model as Eloquent;
use MongoDB\Laravel\Relations\BelongsTo;
 
class StatistikaUtakmice extends Eloquent
{
 
    use HasFactory;
 
    protected $connection = 'mongodb';
    protected $collection = 'statistika_utakmice';
 
   
 
    protected $fillable = [
        'sutevi_domacina',
        'sutevi_gosta',
        'sutevi_u_gol_domacina',
        'sutevi_van_gola_domacina',
        'sutevi_u_gol_gosta',
        'sutevi_van_gola_gosta',
        'faulovi_domacina',
        'faulovi_gosta',
        'posed_lopte_domacina',
        'posed_lopte_gosta',
       
       
    ];
 
    public function utakmica():BelongsTo
    {
        return $this->belongsTo(Utakmica::class);
    }
}