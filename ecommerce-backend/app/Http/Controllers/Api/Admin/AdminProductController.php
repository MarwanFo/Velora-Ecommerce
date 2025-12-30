<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AdminProductController extends Controller
{
    /**
     * List all products with pagination
     */
    public function index(Request $request)
    {
        $query = Product::with(['category', 'images']);

        // Search
        if ($request->has('search')) {
            $query->search($request->search);
        }

        // Filter by category
        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        // Filter by status
        if ($request->has('status')) {
            if ($request->status === 'active') {
                $query->where('is_active', true);
            } elseif ($request->status === 'inactive') {
                $query->where('is_active', false);
            } elseif ($request->status === 'low_stock') {
                $query->whereColumn('quantity', '<=', 'low_stock_threshold')
                    ->where('quantity', '>', 0);
            } elseif ($request->status === 'out_of_stock') {
                $query->where('quantity', '<=', 0);
            }
        }

        // Sort
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $products = $query->paginate($request->get('per_page', 15));

        return ProductResource::collection($products);
    }

    /**
     * Store a new product
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'short_description' => 'nullable|string|max:500',
            'category_id' => 'required|exists:categories,id',
            'brand' => 'nullable|string|max:255',
            'sku' => 'nullable|string|max:100|unique:products,sku',
            'price' => 'required|numeric|min:0',
            'sale_price' => 'nullable|numeric|min:0|lt:price',
            'quantity' => 'required|integer|min:0',
            'low_stock_threshold' => 'nullable|integer|min:0',
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:500',
        ]);

        // Generate slug
        $validated['slug'] = Str::slug($validated['name']);

        // Ensure unique slug
        $slugCount = Product::where('slug', 'like', $validated['slug'] . '%')->count();
        if ($slugCount > 0) {
            $validated['slug'] .= '-' . ($slugCount + 1);
        }

        $product = Product::create($validated);

        return new ProductResource($product->load(['category', 'images']));
    }

    /**
     * Show a single product
     */
    public function show(Product $product)
    {
        return new ProductResource($product->load(['category', 'images']));
    }

    /**
     * Update a product
     */
    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'short_description' => 'nullable|string|max:500',
            'category_id' => 'sometimes|required|exists:categories,id',
            'brand' => 'nullable|string|max:255',
            'sku' => 'nullable|string|max:100|unique:products,sku,' . $product->id,
            'price' => 'sometimes|required|numeric|min:0',
            'sale_price' => 'nullable|numeric|min:0',
            'quantity' => 'sometimes|required|integer|min:0',
            'low_stock_threshold' => 'nullable|integer|min:0',
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:500',
        ]);

        // Update slug if name changed
        if (isset($validated['name']) && $validated['name'] !== $product->name) {
            $validated['slug'] = Str::slug($validated['name']);
            $slugCount = Product::where('slug', 'like', $validated['slug'] . '%')
                ->where('id', '!=', $product->id)
                ->count();
            if ($slugCount > 0) {
                $validated['slug'] .= '-' . ($slugCount + 1);
            }
        }

        $product->update($validated);

        return new ProductResource($product->load(['category', 'images']));
    }

    /**
     * Delete a product
     */
    public function destroy(Product $product)
    {
        $product->delete();

        return response()->json([
            'message' => 'Product deleted successfully',
        ]);
    }

    /**
     * Toggle product active status
     */
    public function toggleStatus(Product $product)
    {
        $product->update([
            'is_active' => !$product->is_active,
        ]);

        return new ProductResource($product);
    }
}
