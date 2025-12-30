<?php

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\CategoryController;
use App\Http\Controllers\Api\V1\CheckoutController;
use App\Http\Controllers\Api\V1\ProductController;
use App\Http\Controllers\Api\Admin\AdminDashboardController;
use App\Http\Controllers\Api\Admin\AdminProductController;
use App\Http\Controllers\Api\Admin\AdminOrderController;
use App\Http\Controllers\Api\Admin\AdminUserController;
use App\Http\Controllers\Api\Admin\AdminCategoryController;
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

    // Category routes (public)
    Route::prefix('categories')->group(function () {
        Route::get('/', [CategoryController::class, 'index']);
        Route::get('/{slug}', [CategoryController::class, 'show']);
    });

    // Product routes (public)
    Route::prefix('products')->group(function () {
        Route::get('/', [ProductController::class, 'index']);
        Route::get('/featured', [ProductController::class, 'featured']);
        Route::get('/{slug}', [ProductController::class, 'show']);
    });

    // Checkout route (can be guest or authenticated)
    Route::post('/checkout', [CheckoutController::class, 'store']);
    Route::get('/orders/{orderNumber}', [CheckoutController::class, 'show']);

    // User orders (protected)
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/orders', [CheckoutController::class, 'index']);
    });

    // Admin routes (protected with auth + admin middleware)
    Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {

        // Dashboard
        Route::get('/dashboard', [AdminDashboardController::class, 'index']);

        // Products
        Route::get('/products', [AdminProductController::class, 'index']);
        Route::post('/products', [AdminProductController::class, 'store']);
        Route::get('/products/{product}', [AdminProductController::class, 'show']);
        Route::put('/products/{product}', [AdminProductController::class, 'update']);
        Route::delete('/products/{product}', [AdminProductController::class, 'destroy']);
        Route::patch('/products/{product}/toggle-status', [AdminProductController::class, 'toggleStatus']);

        // Product images (using existing controller)
        Route::post('/products/{product}/images', [ProductController::class, 'uploadImages']);
        Route::put('/products/{product}/images/{imageId}/primary', [ProductController::class, 'setPrimaryImage']);
        Route::delete('/products/{product}/images/{imageId}', [ProductController::class, 'deleteImage']);

        // Orders
        Route::get('/orders', [AdminOrderController::class, 'index']);
        Route::get('/orders/{order}', [AdminOrderController::class, 'show']);
        Route::patch('/orders/{order}/status', [AdminOrderController::class, 'updateStatus']);
        Route::patch('/orders/{order}/payment-status', [AdminOrderController::class, 'updatePaymentStatus']);
        Route::patch('/orders/{order}/notes', [AdminOrderController::class, 'addNote']);

        // Users
        Route::get('/users', [AdminUserController::class, 'index']);
        Route::get('/users/{user}', [AdminUserController::class, 'show']);
        Route::put('/users/{user}', [AdminUserController::class, 'update']);
        Route::patch('/users/{user}/toggle-admin', [AdminUserController::class, 'toggleAdmin']);

        // Categories
        Route::get('/categories', [AdminCategoryController::class, 'index']);
        Route::post('/categories', [AdminCategoryController::class, 'store']);
        Route::get('/categories/{category}', [AdminCategoryController::class, 'show']);
        Route::put('/categories/{category}', [AdminCategoryController::class, 'update']);
        Route::delete('/categories/{category}', [AdminCategoryController::class, 'destroy']);
    });
});



