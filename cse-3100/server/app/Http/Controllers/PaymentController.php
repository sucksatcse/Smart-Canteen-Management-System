<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

/**
 * PaymentController – Issue 6 will implement full payment logic.
 *
 * Stub routes available:
 *   POST  /api/payments            → store()  [auth]
 *   GET   /api/payments/{payment}  → show()   [auth]
 */
class PaymentController extends Controller
{
    /**
     * Store a new payment record for an order.
     * TODO (Issue 6): implement payment creation logic.
     */
    public function store(Request $request)
    {
        return response()->json(['message' => 'Payment store – coming in Issue 6'], 501);
    }

    /**
     * Show payment details for a given payment.
     * TODO (Issue 6): implement show logic.
     */
    public function show(int $id)
    {
        return response()->json(['message' => 'show – coming in Issue 6'], 501);
    }
}
