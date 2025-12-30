<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use Illuminate\Http\Request;

class AdminOrderController extends Controller
{
    /**
     * List all orders with pagination
     */
    public function index(Request $request)
    {
        $query = Order::with('items');

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by payment status
        if ($request->has('payment_status')) {
            $query->where('payment_status', $request->payment_status);
        }

        // Search by order number or customer email
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('order_number', 'like', "%{$search}%")
                    ->orWhere('shipping_email', 'like', "%{$search}%")
                    ->orWhere('shipping_first_name', 'like', "%{$search}%")
                    ->orWhere('shipping_last_name', 'like', "%{$search}%");
            });
        }

        // Date range
        if ($request->has('from_date')) {
            $query->where('created_at', '>=', $request->from_date);
        }
        if ($request->has('to_date')) {
            $query->where('created_at', '<=', $request->to_date);
        }

        // Sort
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $orders = $query->paginate($request->get('per_page', 15));

        return OrderResource::collection($orders);
    }

    /**
     * Show a single order
     */
    public function show(Order $order)
    {
        return new OrderResource($order->load('items'));
    }

    /**
     * Update order status
     */
    public function updateStatus(Request $request, Order $order)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,processing,shipped,delivered,cancelled',
        ]);

        $order->update([
            'status' => $validated['status'],
        ]);

        return new OrderResource($order->load('items'));
    }

    /**
     * Update payment status
     */
    public function updatePaymentStatus(Request $request, Order $order)
    {
        $validated = $request->validate([
            'payment_status' => 'required|in:pending,paid,failed,refunded',
        ]);

        $order->update([
            'payment_status' => $validated['payment_status'],
        ]);

        return new OrderResource($order->load('items'));
    }

    /**
     * Add notes to order
     */
    public function addNote(Request $request, Order $order)
    {
        $validated = $request->validate([
            'notes' => 'required|string|max:1000',
        ]);

        $order->update([
            'notes' => $validated['notes'],
        ]);

        return new OrderResource($order->load('items'));
    }
}
