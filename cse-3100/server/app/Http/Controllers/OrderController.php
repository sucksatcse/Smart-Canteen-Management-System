<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

/**
 * OrderController – Issue 5 will implement full order logic.
 *
 * Stub routes available:
 *   GET   /api/orders              → index()        [auth]
 *   POST  /api/orders              → store()        [auth]
 *   PUT   /api/orders/{order}/status → updateStatus() [admin]
 */
class OrderController extends Controller
{
    /**
     * Return all orders for the authenticated user (or all if admin).
     * TODO (Issue 5): implement with Order model.
     */
    public function index(Request $request)
    {
        return response()->json([
            'message' => 'Order listing – coming in Issue 5',
            'data'    => [],
        ]);
    }

    /**
     * Place a new order for the authenticated user.
     * TODO (Issue 5): implement order placement logic.
     */
    public function store(Request $request)
    {
        return response()->json(['message' => 'store – coming in Issue 5'], 501);
    }

    /**
     * Update the status of an order (admin only).
     * TODO (Issue 5): implement status update logic.
     */
    public function updateStatus(Request $request, int $id)
    {
        return response()->json(['message' => 'updateStatus – coming in Issue 5'], 501);
    }
}
