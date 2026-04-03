<?php

namespace App\Http\Controllers;

use App\Models\MenuItem;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    /**
     * GET /api/orders  [auth]
     * Return orders for the authenticated user (all orders if admin/staff).
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $query = Order::with(['items.menuItem'])
            ->orderByDesc('CreatedAt'); // Use custom column

        if ($user->role === 'customer') {
            $query->where('CustomerID', $user->id); // Use custom column
        }

        return response()->json($query->get());
    }

    /**
     * POST /api/orders  [auth]
     * Place a new order for the authenticated user.
     * Expected body: { items: [{menu_item_id, quantity}], notes?: string }
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'items'                => 'required|array|min:1',
            'items.*.menu_item_id' => 'required|exists:Menu,ItemID',
            'items.*.quantity'     => 'required|integer|min:1',
            'notes'                => 'nullable|string|max:500',
            'table_number'         => 'nullable|string|max:10',
        ]);

        $order = DB::transaction(function () use ($validated, $request) {
            $totalPrice = 0;
            $orderItemsData = [];

            // Calculate price from live DB values (not client-submitted prices)
            foreach ($validated['items'] as $cartItem) {
                $menuItem = MenuItem::findOrFail($cartItem['menu_item_id']);
                $lineTotal = $menuItem->price * $cartItem['quantity'];
                $totalPrice += $lineTotal;

                $orderItemsData[] = [
                    'menu_item_id' => $menuItem->id,
                    'quantity'     => $cartItem['quantity'],
                    'unit_price'   => $menuItem->price,
                ];
            }

            // Create the order
            $order = Order::create([
                'CustomerID'      => $request->user()->id,
                'CanteenID'       => 1,
                'Status'          => 'pending',
                'TotalAmount'     => $totalPrice,
                'SpecialNotes'    => $validated['notes'] ?? null,
                'TableNumber'     => $validated['table_number'] ?? null,
            ]);

            // Create all order items
            foreach ($orderItemsData as $itemData) {
                $order->items()->create([
                    'ItemID'    => $itemData['menu_item_id'],
                    'Quantity'  => $itemData['quantity'],
                    'UnitPrice' => $itemData['unit_price'],
                ]);
            }

            // Create synchronous payment record
            $order->payment()->create([
                'Amount'        => $totalPrice,
                'PaymentMethod' => 'cash', // Defaulted to cash for now
                'Status'        => 'completed',
                'PaymentTime'   => now(),
            ]);

            return $order->load('items.menuItem');
        });

        return response()->json($order, 201);
    }

    /**
     * PUT /api/orders/{id}/status  [admin/staff]
     * Update the status of an order.
     */
    public function updateStatus(Request $request, int $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,preparing,ready,completed,cancelled',
        ]);

        $order = Order::findOrFail($id);

        $updateData = ['Status' => $validated['status']];

        // Assign the staff member exclusively when they move the order to "preparing"
        if ($validated['status'] === 'preparing' && !$order->AssignedStaffID) {
            $updateData['AssignedStaffID'] = $request->user()->id;
        }

        $order->update($updateData);

        return response()->json($order->load('items.menuItem'));
    }
}
