<?php

use App\Http\Controllers\Api\V1\AuthController;
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
    Route::get('/health', fn() => response()->json(['status' => 'ok', 'timestamp' => now()]));

    // Authentication routes
    Route::prefix('auth')->group(function () {
        // Public auth routes
        Route::post('/register', [AuthController::class, 'register']);
        Route::post('/login', [AuthController::class, 'login']);

        // Protected auth routes
        Route::middleware('auth:sanctum')->group(function () {
            Route::post('/logout', [AuthController::class, 'logout']);
            Route::get('/user', [AuthController::class, 'user']);
        });
    });

    // Product routes (will be added in product setup)
    // Route::prefix('products')->group(base_path('routes/api/products.php'));

    // Cart routes (will be added in cart setup)
    // Route::prefix('cart')->group(base_path('routes/api/cart.php'));

    // Order routes (will be added in order setup)
    // Route::prefix('orders')->group(base_path('routes/api/orders.php'));
});
