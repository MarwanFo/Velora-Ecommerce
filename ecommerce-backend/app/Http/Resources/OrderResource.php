<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'order_number' => $this->order_number,
            'status' => $this->status,
            'status_label' => $this->status_label,

            'shipping' => [
                'name' => $this->shipping_name,
                'first_name' => $this->shipping_first_name,
                'last_name' => $this->shipping_last_name,
                'email' => $this->shipping_email,
                'phone' => $this->shipping_phone,
                'address' => $this->shipping_address,
                'address_2' => $this->shipping_address_2,
                'city' => $this->shipping_city,
                'state' => $this->shipping_state,
                'zip' => $this->shipping_zip,
                'country' => $this->shipping_country,
            ],

            'totals' => [
                'subtotal' => (float) $this->subtotal,
                'shipping' => (float) $this->shipping_cost,
                'tax' => (float) $this->tax,
                'discount' => (float) $this->discount,
                'total' => (float) $this->total,
            ],

            'item_count' => $this->item_count,
            'items' => OrderItemResource::collection($this->whenLoaded('items')),

            'payment' => [
                'method' => $this->payment_method,
                'status' => $this->payment_status,
            ],

            'notes' => $this->notes,
            'created_at' => $this->created_at->toIso8601String(),
            'updated_at' => $this->updated_at->toIso8601String(),
        ];
    }
}
