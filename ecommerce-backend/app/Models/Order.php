<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'order_number',
        'status',
        'shipping_first_name',
        'shipping_last_name',
        'shipping_email',
        'shipping_phone',
        'shipping_address',
        'shipping_address_2',
        'shipping_city',
        'shipping_state',
        'shipping_zip',
        'shipping_country',
        'billing_first_name',
        'billing_last_name',
        'billing_address',
        'billing_address_2',
        'billing_city',
        'billing_state',
        'billing_zip',
        'billing_country',
        'subtotal',
        'shipping_cost',
        'tax',
        'discount',
        'total',
        'payment_method',
        'payment_status',
        'transaction_id',
        'notes',
    ];

    protected $casts = [
        'subtotal' => 'decimal:2',
        'shipping_cost' => 'decimal:2',
        'tax' => 'decimal:2',
        'discount' => 'decimal:2',
        'total' => 'decimal:2',
    ];

    /**
     * Status labels for display
     */
    public const STATUS_LABELS = [
        'pending' => 'Pending',
        'processing' => 'Processing',
        'shipped' => 'Shipped',
        'delivered' => 'Delivered',
        'cancelled' => 'Cancelled',
    ];

    /**
     * Get the user that owns the order
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the order items
     */
    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * Generate a unique order number
     */
    public static function generateOrderNumber(): string
    {
        $prefix = 'VEL';
        $date = now()->format('ymd');
        $random = strtoupper(substr(uniqid(), -4));

        return "{$prefix}-{$date}-{$random}";
    }

    /**
     * Get status label
     */
    public function getStatusLabelAttribute(): string
    {
        return self::STATUS_LABELS[$this->status] ?? $this->status;
    }

    /**
     * Get full shipping name
     */
    public function getShippingNameAttribute(): string
    {
        return "{$this->shipping_first_name} {$this->shipping_last_name}";
    }

    /**
     * Get formatted shipping address
     */
    public function getFormattedShippingAddressAttribute(): string
    {
        $parts = [
            $this->shipping_address,
            $this->shipping_address_2,
            "{$this->shipping_city}, {$this->shipping_state} {$this->shipping_zip}",
            $this->shipping_country,
        ];

        return implode("\n", array_filter($parts));
    }

    /**
     * Get number of items
     */
    public function getItemCountAttribute(): int
    {
        return $this->items->sum('quantity');
    }

    /**
     * Scope for user's orders
     */
    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    /**
     * Scope for recent orders
     */
    public function scopeRecent($query, int $limit = 10)
    {
        return $query->orderBy('created_at', 'desc')->limit($limit);
    }
}
