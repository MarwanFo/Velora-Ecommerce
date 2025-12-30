<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AdminCategoryController extends Controller
{
    /**
     * List all categories
     */
    public function index(Request $request)
    {
        $query = Category::withCount('products');

        // Search
        if ($request->has('search')) {
            $query->where('name', 'like', "%{$request->search}%");
        }

        // Sort
        $sortBy = $request->get('sort_by', 'name');
        $sortOrder = $request->get('sort_order', 'asc');
        $query->orderBy($sortBy, $sortOrder);

        if ($request->has('per_page')) {
            $categories = $query->paginate($request->per_page);
            return CategoryResource::collection($categories);
        }

        return CategoryResource::collection($query->get());
    }

    /**
     * Store a new category
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name',
            'description' => 'nullable|string',
            'image_url' => 'nullable|url',
            'is_active' => 'boolean',
            'sort_order' => 'nullable|integer|min:0',
        ]);

        $validated['slug'] = Str::slug($validated['name']);

        $category = Category::create($validated);

        return new CategoryResource($category);
    }

    /**
     * Show a single category
     */
    public function show(Category $category)
    {
        return new CategoryResource($category->loadCount('products'));
    }

    /**
     * Update a category
     */
    public function update(Request $request, Category $category)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255|unique:categories,name,' . $category->id,
            'description' => 'nullable|string',
            'image_url' => 'nullable|url',
            'is_active' => 'boolean',
            'sort_order' => 'nullable|integer|min:0',
        ]);

        if (isset($validated['name']) && $validated['name'] !== $category->name) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        $category->update($validated);

        return new CategoryResource($category);
    }

    /**
     * Delete a category
     */
    public function destroy(Category $category)
    {
        // Check if category has products
        if ($category->products()->count() > 0) {
            return response()->json([
                'message' => 'Cannot delete category with products. Please reassign or delete products first.',
            ], 422);
        }

        $category->delete();

        return response()->json([
            'message' => 'Category deleted successfully',
        ]);
    }
}
