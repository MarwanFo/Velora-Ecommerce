<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    /**
     * Get paginated list of products with filtering and sorting.
     */
    public function index(Request $request)
    {
        $query = Product::query()
            ->active()
            ->with(['category', 'primaryImage']);

        // Search
        if ($request->has('search')) {
            $query->search($request->search);
        }

        // Filter by category
        if ($request->has('category')) {
            $query->whereHas('category', function ($q) use ($request) {
                $q->where('slug', $request->category);
            });
        }

        // Filter by price range
        if ($request->has('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }
        if ($request->has('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }

        // Filter by stock
        if ($request->boolean('in_stock')) {
            $query->inStock();
        }

        // Filter by featured
        if ($request->boolean('featured')) {
            $query->featured();
        }

        // Filter by brand
        if ($request->has('brand')) {
            $query->where('brand', $request->brand);
        }

        // Sorting
        $sortBy = $request->get('sort', 'created_at');
        $sortOrder = $request->get('order', 'desc');

        $allowedSorts = ['name', 'price', 'created_at'];
        if (in_array($sortBy, $allowedSorts)) {
            $query->orderBy($sortBy, $sortOrder === 'asc' ? 'asc' : 'desc');
        }

        // Pagination
        $perPage = min($request->get('per_page', 12), 48);
        $products = $query->paginate($perPage);

        return ProductResource::collection($products);
    }

    /**
     * Get featured products.
     */
    public function featured()
    {
        $products = Product::query()
            ->active()
            ->featured()
            ->with(['category', 'primaryImage'])
            ->limit(8)
            ->get();

        return ProductResource::collection($products);
    }

    /**
     * Get a single product by slug.
     */
    public function show(string $slug)
    {
        $product = Product::where('slug', $slug)
            ->with(['category', 'images'])
            ->firstOrFail();

        return new ProductResource($product);
    }

    /**
     * Create a new product (admin only).
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'short_description' => 'nullable|string|max:500',
            'category_id' => 'nullable|exists:categories,id',
            'brand' => 'nullable|string|max:255',
            'sku' => 'required|string|unique:products',
            'price' => 'required|numeric|min:0',
            'sale_price' => 'nullable|numeric|min:0|lt:price',
            'quantity' => 'required|integer|min:0',
            'low_stock_threshold' => 'integer|min:0',
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
        ]);

        $validated['slug'] = Str::slug($validated['name']);

        // Ensure unique slug
        $count = 0;
        $originalSlug = $validated['slug'];
        while (Product::where('slug', $validated['slug'])->exists()) {
            $count++;
            $validated['slug'] = $originalSlug . '-' . $count;
        }

        $product = Product::create($validated);

        return new ProductResource($product->load(['category', 'images']));
    }

    /**
     * Update a product (admin only).
     */
    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'short_description' => 'nullable|string|max:500',
            'category_id' => 'nullable|exists:categories,id',
            'brand' => 'nullable|string|max:255',
            'sku' => 'sometimes|string|unique:products,sku,' . $product->id,
            'price' => 'sometimes|numeric|min:0',
            'sale_price' => 'nullable|numeric|min:0',
            'quantity' => 'sometimes|integer|min:0',
            'low_stock_threshold' => 'integer|min:0',
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
        ]);

        if (isset($validated['name']) && $validated['name'] !== $product->name) {
            $validated['slug'] = Str::slug($validated['name']);

            // Ensure unique slug
            $count = 0;
            $originalSlug = $validated['slug'];
            while (Product::where('slug', $validated['slug'])->where('id', '!=', $product->id)->exists()) {
                $count++;
                $validated['slug'] = $originalSlug . '-' . $count;
            }
        }

        $product->update($validated);

        return new ProductResource($product->load(['category', 'images']));
    }

    /**
     * Delete a product (admin only).
     */
    public function destroy(Product $product)
    {
        // Delete associated images from storage
        foreach ($product->images as $image) {
            Storage::disk('public')->delete($image->image_path);
        }

        $product->delete();

        return response()->json(['message' => 'Product deleted successfully']);
    }

    /**
     * Upload product images.
     */
    public function uploadImages(Request $request, Product $product)
    {
        $request->validate([
            'images' => 'required|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        $uploadedImages = [];

        foreach ($request->file('images') as $index => $image) {
            $path = $image->store('products/' . $product->id, 'public');

            $productImage = $product->images()->create([
                'image_path' => $path,
                'alt_text' => $product->name,
                'is_primary' => $product->images()->count() === 0 && $index === 0,
                'sort_order' => $product->images()->count(),
            ]);

            $uploadedImages[] = $productImage;
        }

        return response()->json([
            'message' => count($uploadedImages) . ' images uploaded successfully',
            'images' => $uploadedImages,
        ]);
    }

    /**
     * Set primary image.
     */
    public function setPrimaryImage(Product $product, int $imageId)
    {
        // Reset all images to non-primary
        $product->images()->update(['is_primary' => false]);

        // Set the selected image as primary
        $product->images()->where('id', $imageId)->update(['is_primary' => true]);

        return response()->json(['message' => 'Primary image updated']);
    }

    /**
     * Delete a product image.
     */
    public function deleteImage(Product $product, int $imageId)
    {
        $image = $product->images()->findOrFail($imageId);

        Storage::disk('public')->delete($image->image_path);
        $image->delete();

        return response()->json(['message' => 'Image deleted successfully']);
    }
}
