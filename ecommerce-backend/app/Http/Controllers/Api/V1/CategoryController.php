<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    /**
     * Get all categories (nested tree structure).
     */
    public function index(Request $request)
    {
        $categories = Category::query()
            ->active()
            ->root()
            ->with([
                'children' => function ($query) {
                    $query->active()->orderBy('sort_order');
                }
            ])
            ->withCount('products')
            ->orderBy('sort_order')
            ->get();

        return CategoryResource::collection($categories);
    }

    /**
     * Get a single category by slug.
     */
    public function show(string $slug)
    {
        $category = Category::where('slug', $slug)
            ->with(['parent', 'children.children'])
            ->withCount('products')
            ->firstOrFail();

        return new CategoryResource($category);
    }

    /**
     * Create a new category (admin only).
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'parent_id' => 'nullable|exists:categories,id',
            'image' => 'nullable|string',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ]);

        $validated['slug'] = Str::slug($validated['name']);

        // Ensure unique slug
        $count = 0;
        $originalSlug = $validated['slug'];
        while (Category::where('slug', $validated['slug'])->exists()) {
            $count++;
            $validated['slug'] = $originalSlug . '-' . $count;
        }

        $category = Category::create($validated);

        return new CategoryResource($category);
    }

    /**
     * Update a category (admin only).
     */
    public function update(Request $request, Category $category)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'parent_id' => 'nullable|exists:categories,id',
            'image' => 'nullable|string',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ]);

        if (isset($validated['name']) && $validated['name'] !== $category->name) {
            $validated['slug'] = Str::slug($validated['name']);

            // Ensure unique slug
            $count = 0;
            $originalSlug = $validated['slug'];
            while (Category::where('slug', $validated['slug'])->where('id', '!=', $category->id)->exists()) {
                $count++;
                $validated['slug'] = $originalSlug . '-' . $count;
            }
        }

        $category->update($validated);

        return new CategoryResource($category);
    }

    /**
     * Delete a category (admin only).
     */
    public function destroy(Category $category)
    {
        // Move child categories to parent
        Category::where('parent_id', $category->id)
            ->update(['parent_id' => $category->parent_id]);

        $category->delete();

        return response()->json(['message' => 'Category deleted successfully']);
    }
}
