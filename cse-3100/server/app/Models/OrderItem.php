<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    use HasFactory;

    protected $table = 'order_items';

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'order_id',
        'menu_item_id',
        'quantity',
        'unit_price',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'unit_price' => 'decimal:2',
        'quantity'   => 'integer',
    ];

    /**
     * An order item belongs to a specific order.
     */
    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    /**
     * An order item references a menu item.
     */
    public function menuItem()
    {
        return $this->belongsTo(MenuItem::class);
    }

    /**
     * Calculate subtotal for this line item.
     */
    public function getSubtotalAttribute(): float
    {
        return $this->unit_price * $this->quantity;
    }
}
