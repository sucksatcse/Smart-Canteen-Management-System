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
use App\Http\Controllers\AdminController;

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
        Route::put('/menu/{id}/stock', [MenuController::class, 'updateStock']);
    });
    
    // Orders & Payments
    Route::get('/orders', [OrderController::class, 'index']);
    Route::post('/orders', [OrderController::class, 'store']);
    Route::put('/orders/{id}/cancel', [OrderController::class, 'cancelOrder']);
    Route::put('/orders/{id}/status', [OrderController::class, 'updateStatus'])->middleware('role:admin,staff');
    
    Route::post('/payments', [PaymentController::class, 'store']);
    Route::get('/payments/{id}', [PaymentController::class, 'show']);

    // Profile
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::post('/profile/avatar', [ProfileController::class, 'uploadAvatar']);
});

// ── Admin Routes (JWT + Admin Role) ─────────────────────────────────────
Route::middleware(['auth:api', 'role:admin'])->group(function () {
    // Dashboard & Analytics
    Route::get('/admin/dashboard',      [AdminController::class, 'dashboard']);

    // Staff / Salary
    Route::get('/admin/staff',          [AdminController::class, 'getStaff']);
    Route::put('/admin/staff/{id}',     [AdminController::class, 'updateStaffSalary']);
    Route::delete('/admin/staff/{userId}', [AdminController::class, 'deleteStaff']);

    // Users
    Route::get('/admin/users',          [AdminController::class, 'getUsers']);

    // All Orders
    Route::get('/admin/orders',         [AdminController::class, 'getAllOrders']);

    // Admin Menu CRUD
    Route::post('/admin/menu',          [MenuController::class, 'store']);
    Route::put('/admin/menu/{id}',      [MenuController::class, 'update']);
    Route::delete('/admin/menu/{id}',   [MenuController::class, 'destroy']);
});