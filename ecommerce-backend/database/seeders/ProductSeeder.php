<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = [
            // Ceramics - Vases
            [
                'name' => 'Terracotta Floor Vase',
                'short_description' => 'Large handcrafted terracotta vase with rustic finish',
                'description' => 'This stunning floor vase is handcrafted by local artisans using traditional techniques. Each piece is unique with its own natural variations in color and texture. Perfect for dried flowers or as a standalone statement piece.',
                'category' => 'ceramics-vases',
                'brand' => 'Artisan Clay Co.',
                'price' => 189.00,
                'sale_price' => null,
                'quantity' => 15,
                'is_featured' => true,
            ],
            [
                'name' => 'Minimalist White Bud Vase Set',
                'short_description' => 'Set of 3 elegant white ceramic bud vases',
                'description' => 'This beautiful set of three bud vases features a clean, minimalist design that complements any decor style. Each vase is hand-glazed with a smooth matte finish. Perfect for single stems or small arrangements.',
                'category' => 'ceramics-vases',
                'brand' => 'Pure Home',
                'price' => 65.00,
                'sale_price' => 52.00,
                'quantity' => 28,
                'is_featured' => true,
            ],
            // Ceramics - Mugs
            [
                'name' => 'Handthrown Ceramic Mug',
                'short_description' => 'Artisan coffee mug with unique glaze pattern',
                'description' => 'Start your morning right with this handthrown ceramic mug. The reactive glaze creates a one-of-a-kind pattern on each piece. Dishwasher and microwave safe. Holds 12oz.',
                'category' => 'ceramics-mugs',
                'brand' => 'Morning Potter',
                'price' => 38.00,
                'sale_price' => null,
                'quantity' => 45,
                'is_featured' => false,
            ],
            // Textiles - Blankets
            [
                'name' => 'Alpaca Wool Throw Blanket',
                'short_description' => 'Luxuriously soft alpaca wool blanket in natural tones',
                'description' => 'Handwoven by skilled artisans in Peru, this alpaca wool throw blanket is incredibly soft and warm. The natural color palette fits seamlessly into any home decor. Dimensions: 50" x 70".',
                'category' => 'textiles-blankets',
                'brand' => 'Andean Weaves',
                'price' => 245.00,
                'sale_price' => 199.00,
                'quantity' => 12,
                'is_featured' => true,
            ],
            // Textiles - Pillows
            [
                'name' => 'Hand-Embroidered Linen Pillow',
                'short_description' => 'Natural linen pillow with delicate floral embroidery',
                'description' => 'This gorgeous pillow features intricate hand embroidery on premium Belgian linen. The natural, earthy tones add warmth to any space. Includes pillow insert. Size: 18" x 18".',
                'category' => 'textiles-pillows',
                'brand' => 'Flora Stitch',
                'price' => 85.00,
                'sale_price' => null,
                'quantity' => 20,
                'is_featured' => false,
            ],
            // Jewelry - Necklaces
            [
                'name' => 'Hammered Gold Pendant Necklace',
                'short_description' => 'Delicate gold-filled pendant on fine chain',
                'description' => 'This elegant pendant necklace features a hand-hammered gold-filled disc on a delicate 18" chain. The textured surface catches the light beautifully. Hypoallergenic and tarnish-resistant.',
                'category' => 'jewelry-necklaces',
                'brand' => 'Golden Hour Studio',
                'price' => 125.00,
                'sale_price' => null,
                'quantity' => 35,
                'is_featured' => true,
            ],
            // Jewelry - Earrings
            [
                'name' => 'Ceramic Dangle Earrings',
                'short_description' => 'Lightweight ceramic earrings with abstract design',
                'description' => 'These unique earrings are handcrafted from polymer clay and feature a stunning abstract pattern. Lightweight and comfortable for all-day wear. Sterling silver ear wires.',
                'category' => 'jewelry-earrings',
                'brand' => 'Clay Dreams',
                'price' => 48.00,
                'sale_price' => 38.00,
                'quantity' => 42,
                'is_featured' => false,
            ],
            // Home Decor - Candles
            [
                'name' => 'Soy Wax Candle Trio',
                'short_description' => 'Set of 3 hand-poured soy candles in ceramic vessels',
                'description' => 'This trio of hand-poured soy candles comes in beautiful handmade ceramic vessels that can be repurposed after use. Scents include Lavender Fields, Coastal Breeze, and Warm Vanilla. 40-hour burn time each.',
                'category' => 'home-decor-candles',
                'brand' => 'Luminary Craft',
                'price' => 78.00,
                'sale_price' => null,
                'quantity' => 50,
                'is_featured' => true,
            ],
            // Woodwork - Cutting Boards
            [
                'name' => 'Live Edge Walnut Cutting Board',
                'short_description' => 'Rustic walnut cutting board with natural edge',
                'description' => 'This stunning cutting board is crafted from a single piece of black walnut, preserving the natural live edge for a rustic yet refined look. Food-safe mineral oil finish. Approximately 16" x 10".',
                'category' => 'woodwork-cutting-boards',
                'brand' => 'Forest & Grain',
                'price' => 145.00,
                'sale_price' => null,
                'quantity' => 8,
                'is_featured' => true,
            ],
            // More products
            [
                'name' => 'Woven Seagrass Basket Set',
                'short_description' => 'Set of 3 handwoven seagrass storage baskets',
                'description' => 'These beautiful baskets are handwoven by artisans using sustainably harvested seagrass. Perfect for storing blankets, toys, or plants. Set includes small, medium, and large sizes.',
                'category' => 'home-decor-sculptures',
                'brand' => 'Coastal Living',
                'price' => 95.00,
                'sale_price' => 79.00,
                'quantity' => 25,
                'is_featured' => false,
            ],
            [
                'name' => 'Hand-Painted Ceramic Bowl',
                'short_description' => 'Decorative bowl with traditional Mediterranean patterns',
                'description' => 'This stunning bowl features hand-painted designs inspired by traditional Mediterranean ceramics. Made in Portugal by master craftsmen. Perfect for fruit or as a centerpiece. 12" diameter.',
                'category' => 'ceramics-bowls',
                'brand' => 'Azul Studios',
                'price' => 68.00,
                'sale_price' => null,
                'quantity' => 18,
                'is_featured' => true,
            ],
            [
                'name' => 'Macrame Wall Hanging',
                'short_description' => 'Large bohemian macrame wall art',
                'description' => 'This stunning macrame wall hanging is hand-knotted using premium cotton cord. The intricate design adds texture and warmth to any wall. Includes wooden dowel for hanging. Dimensions: 24" wide x 36" long.',
                'category' => 'textiles-tapestries',
                'brand' => 'Knot & Weave',
                'price' => 135.00,
                'sale_price' => null,
                'quantity' => 10,
                'is_featured' => false,
            ],
        ];

        foreach ($products as $index => $productData) {
            $category = Category::where('slug', $productData['category'])->first();

            Product::create([
                'name' => $productData['name'],
                'slug' => Str::slug($productData['name']),
                'short_description' => $productData['short_description'],
                'description' => $productData['description'],
                'category_id' => $category?->id,
                'brand' => $productData['brand'],
                'sku' => 'VEL-' . str_pad($index + 1, 4, '0', STR_PAD_LEFT),
                'price' => $productData['price'],
                'sale_price' => $productData['sale_price'],
                'quantity' => $productData['quantity'],
                'low_stock_threshold' => 5,
                'is_active' => true,
                'is_featured' => $productData['is_featured'],
                'meta_title' => $productData['name'] . ' | Velora',
                'meta_description' => $productData['short_description'],
            ]);
        }
    }
}
