<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class CheckoutController extends Controller
{
    /**
     * Process checkout and create order
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            // Cart items
            'items' => 'required|array|min:1',
            'items.*.id' => 'required|integer|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',

            // Shipping address
            'shipping.first_name' => 'required|string|max:255',
            'shipping.last_name' => 'required|string|max:255',
            'shipping.email' => 'required|email|max:255',
            'shipping.phone' => 'nullable|string|max:20',
            'shipping.address' => 'required|string|max:255',
            'shipping.address_2' => 'nullable|string|max:255',
            'shipping.city' => 'required|string|max:255',
            'shipping.state' => 'required|string|max:255',
            'shipping.zip' => 'required|string|max:20',
            'shipping.country' => 'required|string|max:2',

            // Billing (optional)
            'billing_same_as_shipping' => 'boolean',
            'billing.first_name' => 'nullable|string|max:255',
            'billing.last_name' => 'nullable|string|max:255',
            'billing.address' => 'nullable|string|max:255',
            'billing.address_2' => 'nullable|string|max:255',
            'billing.city' => 'nullable|string|max:255',
            'billing.state' => 'nullable|string|max:255',
            'billing.zip' => 'nullable|string|max:20',
            'billing.country' => 'nullable|string|max:2',

            // Payment
            'payment_method' => 'nullable|string|max:50',
            'notes' => 'nullable|string|max:1000',
        ]);

        try {
            DB::beginTransaction();

            // Calculate totals from actual product prices (security)
            $productIds = collect($validated['items'])->pluck('id');
            $products = Product::whereIn('id', $productIds)->get()->keyBy('id');

            $subtotal = 0;
            $orderItems = [];

            foreach ($validated['items'] as $item) {
                $product = $products->get($item['id']);

                if (!$product) {
                    throw ValidationException::withMessages([
                        'items' => ["Product not found: {$item['id']}"],
                    ]);
                }

                if (!$product->is_in_stock || $product->quantity < $item['quantity']) {
                    throw ValidationException::withMessages([
                        'items' => ["{$product->name} is out of stock or has insufficient quantity."],
                    ]);
                }

                $price = $product->current_price;
                $itemSubtotal = $price * $item['quantity'];
                $subtotal += $itemSubtotal;

                $orderItems[] = [
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'product_sku' => $product->sku,
                    'product_image' => $product->primary_image?->url,
                    'price' => $price,
                    'quantity' => $item['quantity'],
                    'subtotal' => $itemSubtotal,
                ];

                // Decrease stock
                $product->decrement('quantity', $item['quantity']);
            }

            // Calculate totals
            $shippingCost = 0; // Free shipping for now
            $tax = 0; // Can be calculated based on location
            $total = $subtotal + $shippingCost + $tax;

            // Create order
            $order = Order::create([
                'user_id' => $request->user()?->id,
                'order_number' => Order::generateOrderNumber(),
                'status' => 'pending',

                // Shipping
                'shipping_first_name' => $validated['shipping']['first_name'],
                'shipping_last_name' => $validated['shipping']['last_name'],
                'shipping_email' => $validated['shipping']['email'],
                'shipping_phone' => $validated['shipping']['phone'] ?? null,
                'shipping_address' => $validated['shipping']['address'],
                'shipping_address_2' => $validated['shipping']['address_2'] ?? null,
                'shipping_city' => $validated['shipping']['city'],
                'shipping_state' => $validated['shipping']['state'],
                'shipping_zip' => $validated['shipping']['zip'],
                'shipping_country' => $validated['shipping']['country'],

                // Billing (null if same as shipping)
                'billing_first_name' => $validated['billing']['first_name'] ?? null,
                'billing_last_name' => $validated['billing']['last_name'] ?? null,
                'billing_address' => $validated['billing']['address'] ?? null,
                'billing_address_2' => $validated['billing']['address_2'] ?? null,
                'billing_city' => $validated['billing']['city'] ?? null,
                'billing_state' => $validated['billing']['state'] ?? null,
                'billing_zip' => $validated['billing']['zip'] ?? null,
                'billing_country' => $validated['billing']['country'] ?? null,

                // Totals
                'subtotal' => $subtotal,
                'shipping_cost' => $shippingCost,
                'tax' => $tax,
                'total' => $total,

                // Payment
                'payment_method' => $validated['payment_method'] ?? 'pending',
                'payment_status' => 'pending',

                // Notes
                'notes' => $validated['notes'] ?? null,
            ]);

            // Create order items
            foreach ($orderItems as $item) {
                $order->items()->create($item);
            }

            DB::commit();

            return response()->json([
                'message' => 'Order placed successfully',
                'data' => new OrderResource($order->load('items')),
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Get user's order history
     */
    public function index(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'message' => 'Authentication required',
            ], 401);
        }

        $orders = Order::forUser($user->id)
            ->with('items')
            ->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 10));

        return OrderResource::collection($orders);
    }

    /**
     * Get order details
     */
    public function show(Request $request, $orderNumber)
    {
        $order = Order::where('order_number', $orderNumber)
            ->with('items')
            ->first();

        if (!$order) {
            return response()->json([
                'message' => 'Order not found',
            ], 404);
        }

        // Check if user owns this order (if authenticated)
        $user = $request->user();
        if ($user && $order->user_id && $order->user_id !== $user->id) {
            return response()->json([
                'message' => 'Order not found',
            ], 404);
        }

        return new OrderResource($order);
    }
}
