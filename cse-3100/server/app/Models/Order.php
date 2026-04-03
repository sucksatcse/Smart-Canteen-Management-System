<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $table = 'Orders';
    protected $primaryKey = 'OrderID';

    const CREATED_AT = 'CreatedAt';
    const UPDATED_AT = 'UpdatedAt';

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'CustomerID',
        'CanteenID',
        'AssignedStaffID',
        'TotalAmount',
        'Status',
        'TableNumber',
        'SpecialNotes',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'TotalAmount' => 'decimal:2',
    ];

    protected $hidden = [
        'CreatedAt',
        'UpdatedAt',
    ];

    protected $appends = ['id', 'user_id', 'status', 'total_price', 'notes', 'created_at', 'updated_at'];

    // Provide lowercase fields for the frontend
    public function getIdAttribute() { return $this->attributes['OrderID'] ?? null; }
    public function getUserIdAttribute() { return $this->attributes['CustomerID'] ?? null; }
    public function getStatusAttribute() { return $this->attributes['Status'] ?? null; }
    public function getTotalPriceAttribute() { return $this->attributes['TotalAmount'] ?? null; }
    public function getNotesAttribute() { return $this->attributes['SpecialNotes'] ?? null; }
    public function getCreatedAtAttribute() { return $this->attributes['CreatedAt'] ?? null; }
    public function getUpdatedAtAttribute() { return $this->attributes['UpdatedAt'] ?? null; }

    /**
     * An order belongs to a user (customer).
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'CustomerID', 'UserID');
    }

    /**
     * An order has many order items.
     */
    public function items()
    {
        return $this->hasMany(OrderItem::class, 'OrderID', 'OrderID');
    }

    /**
     * An order has one payment.
     */
    public function payment()
    {
        return $this->hasOne(Payment::class, 'OrderID', 'OrderID');
    }
}
