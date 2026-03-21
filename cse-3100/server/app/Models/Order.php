<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $table = 'orders';

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'user_id',
        'status',
        'total_price',
        'notes',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'total_price' => 'decimal:2',
    ];

    /**
     * An order belongs to a user (customer).
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * An order has many order items.
     */
    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * An order has one payment.
     */
    public function payment()
    {
        return $this->hasOne(Payment::class);
    }
}
