<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group.
|
*/

// API Version 1
Route::prefix('v1')->group(function () {
    
    // Public routes
    Route::get('/health', fn () => response()->json(['status' => 'ok', 'timestamp' => now()]));
    
    // Authentication routes (will be added in auth setup)
    // Route::prefix('auth')->group(base_path('routes/api/auth.php'));
    
    // Product routes (will be added in product setup)
    // Route::prefix('products')->group(base_path('routes/api/products.php'));
    
    // Cart routes (will be added in cart setup)
    // Route::prefix('cart')->group(base_path('routes/api/cart.php'));
    
    // Order routes (will be added in order setup)
    // Route::prefix('orders')->group(base_path('routes/api/orders.php'));
});
