<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

/**
 * CheckRole middleware
 *
 * Usage in routes:
 *   Route::middleware('role:admin')->group(function () { ... });
 *   Route::middleware('role:customer')->group(function () { ... });
 *
 * Requires the user to be authenticated (use after 'auth' or 'auth:sanctum').
 */
class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string    $role  Required role (e.g. 'admin', 'customer')
     * @return mixed
     */
    public function handle(Request $request, Closure $next, string $role)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'message' => 'Unauthenticated.',
            ], 401);
        }

        if ($user->role !== $role) {
            return response()->json([
                'message' => 'Forbidden. You do not have the required role.',
                'required_role' => $role,
                'your_role'     => $user->role,
            ], 403);
        }

        return $next($request);
    }
}
