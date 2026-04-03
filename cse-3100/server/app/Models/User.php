<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'Users';
    protected $primaryKey = 'UserID';
    const CREATED_AT = 'CreatedAt';
    const UPDATED_AT = 'UpdatedAt';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'Name',
        'Email',
        'Role',
        'PasswordHash',
        'PhoneNo'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'PasswordHash',
        'remember_token',
    ];

    // Normalize PascalCase DB columns to lowercase via $attributes directly
    public function getIdAttribute()    { return $this->attributes['UserID'] ?? null; }
    public function getNameAttribute()  { return $this->attributes['Name'] ?? null; }
    public function getEmailAttribute() { return $this->attributes['Email'] ?? null; }
    public function getRoleAttribute()  { return $this->attributes['Role'] ?? null; }

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];
    /**
     * Get the identifier that will be stored in the subject claim of the JWT.
     *
     * @return mixed
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        return [
            'role' => $this->Role,
        ];
    }

    /**
     * Define the relationship to the Post model.
     * A user has many posts.
     */
    public function posts()
    {
        return $this->hasMany(Post::class, 'user_id', 'UserID');
    }

    /**
     * Override authentication password retrieval mechanism
     */
    public function getAuthPassword()
    {
        return $this->PasswordHash;
    }
}
