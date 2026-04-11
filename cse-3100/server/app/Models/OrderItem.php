
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    use HasFactory;

    protected $table = 'OrderItems';
    protected $primaryKey = 'OrderItemID';
    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'OrderID',
        'ItemID',
        'Quantity',
        'UnitPrice',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'UnitPrice' => 'decimal:2',
        'Quantity'  => 'integer',
    ];

    protected $appends = ['id', 'order_id', 'menu_item_id', 'quantity', 'unit_price'];

    // Provide lowercase fields for the frontend
    public function getIdAttribute() { return $this->attributes['OrderItemID'] ?? null; }
    public function getOrderIdAttribute() { return $this->attributes['OrderID'] ?? null; }
    public function getMenuItemIdAttribute() { return $this->attributes['ItemID'] ?? null; }
    public function getQuantityAttribute() { return $this->attributes['Quantity'] ?? null; }
    public function getUnitPriceAttribute() { return $this->attributes['UnitPrice'] ?? null; }


    /**
     * An order item belongs to a specific order.
     */
    public function order()
    {
        return $this->belongsTo(Order::class, 'OrderID', 'OrderID');
    }

    /**
     * An order item references a menu item.
     */
    public function menuItem()
    {
        return $this->belongsTo(MenuItem::class, 'ItemID', 'ItemID');
    }

    /**
     * Calculate subtotal for this line item.
     */
    public function getSubtotalAttribute(): float
    {
        return ($this->attributes['UnitPrice'] ?? 0) * ($this->attributes['Quantity'] ?? 0);
    }
}
