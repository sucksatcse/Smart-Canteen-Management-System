<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

/**
 * MenuController – Issue 4 will implement full CRUD logic.
 *
 * Stub routes available:
 *   GET    /api/menu              → index()
 *   POST   /api/menu              → store()   [admin]
 *   PUT    /api/menu/{menuItem}   → update()  [admin]
 *   DELETE /api/menu/{menuItem}   → destroy() [admin]
 */
class MenuController extends Controller
{
    /**
     * Return all available menu items.
     * TODO (Issue 4): implement with MenuItem model.
     */
    public function index()
    {
        return response()->json([
            'message' => 'Menu management – coming in Issue 4',
            'data'    => [],
        ]);
    }

    /**
     * Add a new menu item (admin only).
     * TODO (Issue 4): implement store logic.
     */
    public function store(Request $request)
    {
        return response()->json(['message' => 'store – coming in Issue 4'], 501);
    }

    /**
     * Update an existing menu item (admin only).
     * TODO (Issue 4): implement update logic.
     */
    public function update(Request $request, int $id)
    {
        return response()->json(['message' => 'update – coming in Issue 4'], 501);
    }

    /**
     * Remove a menu item (admin only).
     * TODO (Issue 4): implement destroy logic.
     */
    public function destroy(int $id)
    {
        return response()->json(['message' => 'destroy – coming in Issue 4'], 501);
    }
}
