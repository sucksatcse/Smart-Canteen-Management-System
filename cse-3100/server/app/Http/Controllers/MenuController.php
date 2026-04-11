<?php

namespace App\Http\Controllers;

use App\Models\MenuItem;
use Illuminate\Http\Request;

class MenuController extends Controller
{
    /**
     * GET /api/menu
     * Return all available menu items (public).
     */
    public function index()
    {
        $items = MenuItem::orderBy('Category')->orderBy('Name')->get()
            ->map(function ($item) {
                return [
                    'id'             => $item->ItemID,
                    'name'           => $item->Name,
                    'category'       => strtolower($item->Category),
                    'price'          => (float) $item->Price,
                    'image_url'      => $item->ImageURL,
                    'stock_quantity' => (int) $item->StockQuantity,
                    'in_stock'       => (bool) $item->IsAvailable,
                    'description'    => $item->Description ?? null,
                ];
            });

        return response()->json($items);
    }

    /**
     * POST /api/menu  [admin]
     * Add a new menu item.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'          => 'required|string|max:255',
            'description'   => 'nullable|string',
            'price'         => 'required|numeric|min:0',
            'category'      => 'required|string|max:50',
            'image_url'     => 'nullable|string|max:1000',
            'stockQuantity' => 'nullable|integer|min:0',
        ]);

        $item = MenuItem::create([
            'CanteenID'     => 1,
            'Name'          => $validated['name'],
            'Category'      => $validated['category'],
            'Price'         => $validated['price'],
            'ImageURL'      => $validated['image_url'] ?? null,
            'StockQuantity' => $validated['stockQuantity'] ?? 50,
            'IsAvailable'   => ($validated['stockQuantity'] ?? 50) > 0,
        ]);

        return response()->json([
            'id'             => $item->ItemID,
            'name'           => $item->Name,
            'category'       => strtolower($item->Category),
            'price'          => (float) $item->Price,
            'image_url'      => $item->ImageURL,
            'stock_quantity' => (int) $item->StockQuantity,
            'in_stock'       => (bool) $item->IsAvailable,
        ], 201);
    }

    /**
     * PUT /api/menu/{id}  [admin]
     * Update an existing menu item.
     */
    public function update(Request $request, int $id)
    {
        $item = MenuItem::findOrFail($id);

        $validated = $request->validate([
            'name'          => 'sometimes|string|max:255',
            'description'   => 'nullable|string',
            'price'         => 'sometimes|numeric|min:0',
            'category'      => 'sometimes|string|max:50',
            'image_url'     => 'nullable|string|max:1000',
            'stockQuantity' => 'nullable|integer|min:0',
        ]);

        $updateData = [];
        if (isset($validated['name']))          $updateData['Name']          = $validated['name'];
        if (isset($validated['category']))      $updateData['Category']      = $validated['category'];
        if (isset($validated['price']))         $updateData['Price']         = $validated['price'];
        if (array_key_exists('image_url', $validated)) $updateData['ImageURL'] = $validated['image_url'];
        if (isset($validated['stockQuantity'])) {
            $updateData['StockQuantity'] = $validated['stockQuantity'];
            $updateData['IsAvailable']   = $validated['stockQuantity'] > 0;
        }

        $item->update($updateData);

        return response()->json([
            'id'             => $item->ItemID,
            'name'           => $item->Name,
            'category'       => strtolower($item->Category),
            'price'          => (float) $item->Price,
            'image_url'      => $item->ImageURL,
            'stock_quantity' => (int) $item->StockQuantity,
            'in_stock'       => (bool) $item->IsAvailable,
        ]);
    }

    /**
     * DELETE /api/menu/{id}  [admin]
     * Mark a menu item as unavailable (soft delete).
     */
    public function destroy(int $id)
    {
        $item = MenuItem::findOrFail($id);
        $item->update(['IsAvailable' => false]);

        return response()->json(['message' => 'Menu item removed successfully.']);
    }

    /**
     * PUT /api/menu/{id}/stock  [admin]
     * Update stock quantity for a menu item.
     */
    public function updateStock(Request $request, int $id)
    {
        $item = MenuItem::findOrFail($id);

        $validated = $request->validate([
            'stockQuantity' => 'required|integer|min:0',
        ]);

        $item->update([
            'StockQuantity' => $validated['stockQuantity'],
            'IsAvailable'   => $validated['stockQuantity'] > 0,
        ]);

        return response()->json(['message' => 'Stock updated successfully.']);
    }
}
