<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'short_description' => $this->short_description,
            'brand' => $this->brand,
            'sku' => $this->sku,

            // Pricing
            'price' => (float) $this->price,
            'sale_price' => $this->sale_price ? (float) $this->sale_price : null,
            'current_price' => (float) $this->current_price,
            'is_on_sale' => $this->is_on_sale,
            'discount_percent' => $this->discount_percent,

            // Inventory
            'quantity' => $this->quantity,
            'is_in_stock' => !$this->is_out_of_stock,
            'is_low_stock' => $this->is_low_stock,

            // Status
            'is_active' => $this->is_active,
            'is_featured' => $this->is_featured,

            // SEO
            'meta_title' => $this->meta_title,
            'meta_description' => $this->meta_description,

            // Relationships
            'category' => new CategoryResource($this->whenLoaded('category')),
            'images' => ProductImageResource::collection($this->whenLoaded('images')),
            'primary_image' => new ProductImageResource($this->whenLoaded('primaryImage')),

            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
