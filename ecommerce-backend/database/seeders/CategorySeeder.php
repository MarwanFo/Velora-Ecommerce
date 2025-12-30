<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Ceramics',
                'description' => 'Handcrafted pottery and ceramic pieces for your home',
                'children' => [
                    ['name' => 'Vases', 'description' => 'Beautiful handmade vases'],
                    ['name' => 'Bowls', 'description' => 'Artisan ceramic bowls'],
                    ['name' => 'Plates', 'description' => 'Handcrafted dinner plates'],
                    ['name' => 'Mugs', 'description' => 'Unique ceramic mugs'],
                ],
            ],
            [
                'name' => 'Textiles',
                'description' => 'Woven and fabric artisan goods',
                'children' => [
                    ['name' => 'Blankets', 'description' => 'Cozy handwoven blankets'],
                    ['name' => 'Pillows', 'description' => 'Decorative throw pillows'],
                    ['name' => 'Rugs', 'description' => 'Handmade area rugs'],
                    ['name' => 'Tapestries', 'description' => 'Wall hanging tapestries'],
                ],
            ],
            [
                'name' => 'Jewelry',
                'description' => 'Handcrafted jewelry and accessories',
                'children' => [
                    ['name' => 'Necklaces', 'description' => 'Artisan necklaces'],
                    ['name' => 'Earrings', 'description' => 'Handmade earrings'],
                    ['name' => 'Bracelets', 'description' => 'Unique bracelets'],
                    ['name' => 'Rings', 'description' => 'Handcrafted rings'],
                ],
            ],
            [
                'name' => 'Home Decor',
                'description' => 'Decorative items for your living space',
                'children' => [
                    ['name' => 'Candles', 'description' => 'Handpoured scented candles'],
                    ['name' => 'Wall Art', 'description' => 'Original wall decorations'],
                    ['name' => 'Sculptures', 'description' => 'Small decorative sculptures'],
                    ['name' => 'Mirrors', 'description' => 'Handcrafted mirrors'],
                ],
            ],
            [
                'name' => 'Woodwork',
                'description' => 'Handcrafted wooden items',
                'children' => [
                    ['name' => 'Cutting Boards', 'description' => 'Artisan cutting boards'],
                    ['name' => 'Furniture', 'description' => 'Handmade furniture pieces'],
                    ['name' => 'Storage', 'description' => 'Wooden storage solutions'],
                ],
            ],
        ];

        foreach ($categories as $index => $categoryData) {
            $parent = Category::create([
                'name' => $categoryData['name'],
                'slug' => Str::slug($categoryData['name']),
                'description' => $categoryData['description'],
                'is_active' => true,
                'sort_order' => $index,
            ]);

            if (isset($categoryData['children'])) {
                foreach ($categoryData['children'] as $childIndex => $childData) {
                    Category::create([
                        'name' => $childData['name'],
                        'slug' => Str::slug($categoryData['name'] . '-' . $childData['name']),
                        'description' => $childData['description'],
                        'parent_id' => $parent->id,
                        'is_active' => true,
                        'sort_order' => $childIndex,
                    ]);
                }
            }
        }
    }
}
