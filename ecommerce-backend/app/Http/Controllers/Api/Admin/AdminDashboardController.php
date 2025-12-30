<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminDashboardController extends Controller
{
    /**
     * Get dashboard statistics
     */
    public function index()
    {
        // Total revenue
        $totalRevenue = Order::where('payment_status', 'paid')
            ->sum('total');

        // Orders count by status
        $ordersCount = Order::count();
        $pendingOrders = Order::where('status', 'pending')->count();
        $processingOrders = Order::where('status', 'processing')->count();
        $completedOrders = Order::where('status', 'delivered')->count();

        // Products stats
        $totalProducts = Product::count();
        $activeProducts = Product::where('is_active', true)->count();
        $lowStockProducts = Product::where('quantity', '<=', DB::raw('low_stock_threshold'))
            ->where('quantity', '>', 0)
            ->count();
        $outOfStockProducts = Product::where('quantity', '<=', 0)->count();

        // Users stats
        $totalUsers = User::where('is_admin', false)->count();
        $newUsersThisMonth = User::where('is_admin', false)
            ->where('created_at', '>=', now()->startOfMonth())
            ->count();

        // Recent orders
        $recentOrders = Order::with('items')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'customer_name' => $order->shipping_name,
                    'customer_email' => $order->shipping_email,
                    'total' => $order->total,
                    'status' => $order->status,
                    'status_label' => $order->status_label,
                    'created_at' => $order->created_at,
                ];
            });

        // Revenue by day (last 7 days)
        $revenueByDay = Order::where('payment_status', 'paid')
            ->where('created_at', '>=', now()->subDays(7))
            ->selectRaw('DATE(created_at) as date, SUM(total) as revenue')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        return response()->json([
            'data' => [
                'revenue' => [
                    'total' => $totalRevenue,
                    'by_day' => $revenueByDay,
                ],
                'orders' => [
                    'total' => $ordersCount,
                    'pending' => $pendingOrders,
                    'processing' => $processingOrders,
                    'completed' => $completedOrders,
                ],
                'products' => [
                    'total' => $totalProducts,
                    'active' => $activeProducts,
                    'low_stock' => $lowStockProducts,
                    'out_of_stock' => $outOfStockProducts,
                ],
                'users' => [
                    'total' => $totalUsers,
                    'new_this_month' => $newUsersThisMonth,
                ],
                'recent_orders' => $recentOrders,
            ],
        ]);
    }
}
