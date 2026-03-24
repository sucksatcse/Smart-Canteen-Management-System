<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// ─── Auth (existing) ──────────────────────────────────────────────────
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;

// ─── Canteen (new) ────────────────────────────────────────────────────
use App\Http\Controllers\MenuController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PaymentController;

/*
|--------------------------------------------------------------------------
| API Routes – Smart Canteen Management System
|--------------------------------------------------------------------------
*/

// ── Authenticated user info ───────────────────────────────────────────
Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

// ── Menu Routes ───────────────────────────────────────────────────────
// Public: anyone can browse the menu
Route::get('/menu', [MenuController::class, 'index']);

// Admin only: manage menu items
Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::post('/menu',          [MenuController::class, 'store']);
    Route::put('/menu/{id}',      [MenuController::class, 'update']);
    Route::delete('/menu/{id}',   [MenuController::class, 'destroy']);
});

// ── Order Routes ──────────────────────────────────────────────────────
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/orders',                    [OrderController::class, 'index']);
    Route::post('/orders',                   [OrderController::class, 'store']);
    // Admin only: update order status
    Route::put('/orders/{id}/status', [OrderController::class, 'updateStatus'])
        ->middleware('role:admin');
});

// ── Payment Routes ────────────────────────────────────────────────────
Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/payments',     [PaymentController::class, 'store']);
    Route::get('/payments/{id}', [PaymentController::class, 'show']);
});