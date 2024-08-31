<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use MongoDB\Laravel\Eloquent\Model as Eloquent;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use MongoDB\Laravel\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use MongoDB\Laravel\Relations\BelongsToMany;

use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */


     const ROLE_ADMIN = 'admin';
     const ROLE_USER = 'user';

     protected $connection = 'mongodb';
     protected $collection = 'users';

    protected $fillable = [
        'username',
        'email',
        'password',
        'role',
    ];


    public function isAdmin()
    {
        return $this->role === self::ROLE_ADMIN;
    }
    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

  

}
