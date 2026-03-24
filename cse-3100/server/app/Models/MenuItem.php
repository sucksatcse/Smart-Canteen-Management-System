<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MenuItem extends Model
{
    use HasFactory;

    protected $table = 'menu_items';

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'name',
        'description',
        'price',
        'category',
        'image_url',
        'available',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'price'     => 'decimal:2',
        'available' => 'boolean',
    ];

    /**
     * A menu item can appear in many order items.
     */
    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }
}
