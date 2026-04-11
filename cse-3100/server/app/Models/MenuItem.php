<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MenuItem extends Model
{
    use HasFactory;

    protected $table = 'Menu';
    protected $primaryKey = 'ItemID';
    const CREATED_AT = 'CreatedAt';
    const UPDATED_AT = 'UpdatedAt';

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'CanteenID',
        'Name',
        'Category',
        'Price',
        'StockQuantity',
        'IsAvailable',
        'ImageURL',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'Price'       => 'decimal:2',
        'IsAvailable' => 'boolean',
    ];

    // Hidden attributes from raw output
    protected $hidden = [
        'CreatedAt',
        'UpdatedAt',
    ];

    // These normalized properties will be attached
    protected $appends = ['id', 'name', 'category', 'price', 'image_url', 'available', 'description', 'stockQuantity', 'inStock', 'image'];

    // Provide lowercase fields for the frontend
    public function getIdAttribute() { return $this->attributes['ItemID'] ?? null; }
    public function getNameAttribute() { return $this->attributes['Name'] ?? null; }
    public function getCategoryAttribute()
    {
        $rawCategory = $this->attributes['Category'] ?? null;
        // Normalize legacy DB values to frontend categories
        if ($rawCategory === 'meals') return 'main';
        if ($rawCategory === 'snacks') return 'snack';
        return $rawCategory;
    }
    public function getPriceAttribute() { return $this->attributes['Price'] ?? null; }
    public function getAvailableAttribute() { return $this->attributes['IsAvailable'] ?? null; }
    public function getImageUrlAttribute() { return $this->attributes['ImageURL'] ?? null; }
    public function getDescriptionAttribute() { return null; } // No description in custom schema
    public function getStockQuantityAttribute() { return (int)($this->attributes['StockQuantity'] ?? 0); }
    public function getInStockAttribute() { return (bool)($this->attributes['IsAvailable'] ?? false); }
    public function getImageAttribute() { return $this->attributes['ImageURL'] ?? null; }

    /**
     * A menu item can appear in many order items.
     */
    public function orderItems()
    {
        return $this->hasMany(OrderItem::class, 'ItemID', 'ItemID');
    }
}
