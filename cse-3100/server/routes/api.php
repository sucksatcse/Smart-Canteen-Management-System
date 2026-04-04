<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// ─── Auth (existing) ──────────────────────────────────────────────────
use App\Http\Controllers\JWTAuthController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ProfileController;

/*
|--------------------------------------------------------------------------
| API Routes – Smart Canteen Management System & JWT Assignment
|--------------------------------------------------------------------------
*/

// ── JWT Auth Endpoints ──────────────────────────────────────────────────
Route::group([
    'middleware' => 'api',
    'prefix' => 'auth'
], function ($router) {
    Route::post('/register', [JWTAuthController::class, 'register']);
    Route::post('/login', [JWTAuthController::class, 'login']);
    Route::post('/logout', [JWTAuthController::class, 'logout']);
    Route::get('/me', [JWTAuthController::class, 'me']);
});

// ── Posts CRUD (JWT Protected) ─────────────────────────────────────────
Route::middleware(['auth:api'])->group(function () {
    Route::get('/posts', [PostController::class, 'index']);
    Route::post('/posts', [PostController::class, 'store']);
    Route::get('/posts/{id}', [PostController::class, 'show']);
    Route::put('/posts/{id}', [PostController::class, 'update']);
    Route::delete('/posts/{id}', [PostController::class, 'destroy']);
});

// ── Canteen Routes (JWT Protected) ──────────────────────────────────────
Route::middleware(['auth:api'])->group(function () {
    Route::get('/menu', [MenuController::class, 'index']);
    
    // Admin only
    Route::middleware(['role:admin'])->group(function () {
        Route::post('/menu',          [MenuController::class, 'store']);
        Route::put('/menu/{id}',      [MenuController::class, 'update']);
        Route::delete('/menu/{id}',   [MenuController::class, 'destroy']);
    });
    
    // Orders & Payments
    Route::get('/orders', [OrderController::class, 'index']);
    Route::post('/orders', [OrderController::class, 'store']);
    Route::put('/orders/{id}/status', [OrderController::class, 'updateStatus'])->middleware('role:admin,staff');
    
    Route::post('/payments', [PaymentController::class, 'store']);
    Route::get('/payments/{id}', [PaymentController::class, 'show']);

    // Profile
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::post('/profile/avatar', [ProfileController::class, 'uploadAvatar']);
});