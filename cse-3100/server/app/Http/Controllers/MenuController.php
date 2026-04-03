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
        $items = MenuItem::where('IsAvailable', true)
            ->orderBy('Category')
            ->orderBy('Name')
            ->get();

        return response()->json($items);
    }

    /**
     * POST /api/menu  [admin]
     * Add a new menu item.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string',
            'price'       => 'required|numeric|min:0',
            'category'    => 'required|in:main,snack,drinks,dessert',
            'image_url'   => 'nullable|string|max:500',
            'available'   => 'boolean',
        ]);

        $item = MenuItem::create([
            'CanteenID'     => 1, // Defaulting to 1 as per current logic
            'Name'          => $validated['name'],
            'Category'      => $validated['category'],
            'Price'         => $validated['price'],
            'ImageURL'      => $validated['image_url'] ?? null,
            'IsAvailable'   => $validated['available'] ?? true,
        ]);

        return response()->json($item, 201);
    }

    /**
     * PUT /api/menu/{id}  [admin]
     * Update an existing menu item.
     */
    public function update(Request $request, int $id)
    {
        $item = MenuItem::findOrFail($id);

        $validated = $request->validate([
            'name'        => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'price'       => 'sometimes|numeric|min:0',
            'category'    => 'sometimes|in:main,snack,drinks,dessert',
            'image_url'   => 'nullable|string|max:500',
            'available'   => 'boolean',
        ]);

        $updateData = [];
        if (isset($validated['name'])) $updateData['Name'] = $validated['name'];
        if (isset($validated['category'])) $updateData['Category'] = $validated['category'];
        if (isset($validated['price'])) $updateData['Price'] = $validated['price'];
        if (array_key_exists('image_url', $validated)) $updateData['ImageURL'] = $validated['image_url'];
        if (isset($validated['available'])) $updateData['IsAvailable'] = $validated['available'];

        $item->update($updateData);

        return response()->json($item);
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
}
