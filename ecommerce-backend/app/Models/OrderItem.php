<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'product_id',
        'product_name',
        'product_sku',
        'product_image',
        'price',
        'quantity',
        'subtotal',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'subtotal' => 'decimal:2',
        'quantity' => 'integer',
    ];

    /**
     * Get the order this item belongs to
     */
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    /**
     * Get the product (may be null if deleted)
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Create from cart item data
     */
    public static function fromCartItem(array $cartItem): array
    {
        return [
            'product_id' => $cartItem['id'] ?? null,
            'product_name' => $cartItem['name'],
            'product_sku' => $cartItem['sku'] ?? null,
            'product_image' => $cartItem['image'] ?? null,
            'price' => $cartItem['price'],
            'quantity' => $cartItem['quantity'],
            'subtotal' => $cartItem['price'] * $cartItem['quantity'],
        ];
    }
}
