<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $table = 'Payments';
    protected $primaryKey = 'PaymentID';
    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'OrderID',
        'Amount',
        'PaymentMethod',
        'Status',
        'PaymentTime',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'Amount'  => 'decimal:2',
        'PaymentTime' => 'datetime',
    ];

    protected $appends = ['id', 'order_id', 'amount', 'method', 'status', 'paid_at', 'transaction_id'];

    // Provide lowercase fields for the frontend
    public function getIdAttribute() { return $this->attributes['PaymentID'] ?? null; }
    public function getOrderIdAttribute() { return $this->attributes['OrderID'] ?? null; }
    public function getAmountAttribute() { return $this->attributes['Amount'] ?? null; }
    public function getMethodAttribute() { return $this->attributes['PaymentMethod'] ?? null; }
    public function getStatusAttribute() { return $this->attributes['Status'] ?? null; }
    public function getPaidAtAttribute() { return $this->attributes['PaymentTime'] ?? null; }
    public function getTransactionIdAttribute() { return null; } // Custom schema doesn't have it

    /**
     * A payment belongs to an order.
     */
    public function order()
    {
        return $this->belongsTo(Order::class, 'OrderID', 'OrderID');
    }
}
