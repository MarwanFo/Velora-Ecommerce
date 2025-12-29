import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import { ROUTES } from '../constants/config';

/**
 * Home Page
 * Landing page with hero section, featured products, and categories
 * Designed with "human touch" - organic layout, warm colors, personality
 */
const Home = () => {
    // Mock featured products (will be replaced with API data)
    const featuredProducts = [
        {
            id: 1,
            name: 'Artisan Leather Bag',
            price: 189.00,
            image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80',
            badge: 'New',
        },
        {
            id: 2,
            name: 'Handwoven Scarf',
            price: 79.00,
            salePrice: 59.00,
            image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=400&q=80',
            badge: 'Sale',
        },
        {
            id: 3,
            name: 'Ceramic Vase Set',
            price: 124.00,
            image: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=400&q=80',
        },
        {
            id: 4,
            name: 'Organic Cotton Throw',
            price: 95.00,
            image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80',
            badge: 'Featured',
        },
    ];

    const categories = [
        { name: 'Home & Living', count: 128, image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400&q=80' },
        { name: 'Fashion', count: 256, image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&q=80' },
        { name: 'Art & Decor', count: 89, image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=400&q=80' },
        { name: 'Accessories', count: 167, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80' },
    ];

    return (
        <div className="bg-neutral-50">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-neutral-50 to-secondary-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Hero Text */}
                        <div className="text-center lg:text-left">
                            <span className="inline-block px-4 py-1.5 bg-primary-100 text-primary-700 text-sm font-medium rounded-full mb-6 transform -rotate-1">
                                New Season Collection
                            </span>
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-medium text-neutral-950 leading-tight mb-6">
                                Discover pieces that
                                <span className="text-primary-600 italic"> tell a story</span>
                            </h1>
                            <p className="text-lg text-neutral-600 mb-8 max-w-lg mx-auto lg:mx-0">
                                Welcome to Velora — where every piece tells a story. Discover handcrafted goods
                                from artisans around the world, made with love and care.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <Link to={ROUTES.products}>
                                    <Button variant="primary" size="lg">
                                        Shop Collection
                                        <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </Button>
                                </Link>
                                <Button variant="ghost" size="lg">
                                    Our Story
                                </Button>
                            </div>
                        </div>

                        {/* Hero Image Grid */}
                        <div className="relative hidden lg:block">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-4 pt-8">
                                    <div className="rounded-2xl overflow-hidden shadow-elevated transform rotate-1 hover:rotate-0 transition-transform duration-500">
                                        <img
                                            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&q=80"
                                            alt="Store interior"
                                            className="w-full h-48 object-cover"
                                        />
                                    </div>
                                    <div className="rounded-2xl overflow-hidden shadow-medium transform -rotate-2 hover:rotate-0 transition-transform duration-500">
                                        <img
                                            src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80"
                                            alt="Handcrafted products"
                                            className="w-full h-64 object-cover"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="rounded-2xl overflow-hidden shadow-medium transform -rotate-1 hover:rotate-0 transition-transform duration-500">
                                        <img
                                            src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&q=80"
                                            alt="Shopping experience"
                                            className="w-full h-64 object-cover"
                                        />
                                    </div>
                                    <div className="rounded-2xl overflow-hidden shadow-soft transform rotate-2 hover:rotate-0 transition-transform duration-500">
                                        <img
                                            src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=300&q=80"
                                            alt="Product details"
                                            className="w-full h-48 object-cover"
                                        />
                                    </div>
                                </div>
                            </div>
                            {/* Decorative elements */}
                            <div className="absolute -top-4 -right-4 w-24 h-24 bg-accent-200 rounded-full opacity-40 blur-xl" />
                            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-primary-200 rounded-full opacity-30 blur-2xl" />
                        </div>
                    </div>
                </div>

                {/* Decorative wave divider */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg className="w-full h-12 text-neutral-50" viewBox="0 0 1440 48" fill="currentColor" preserveAspectRatio="none">
                        <path d="M0,48 L60,42.7 C120,37,240,27,360,26.7 C480,27,600,37,720,40 C840,43,960,37,1080,32 C1200,27,1320,21,1380,18.7 L1440,16 L1440,48 L0,48 Z" />
                    </svg>
                </div>
            </section>

            {/* Trust Badges */}
            <section className="py-12 border-b border-neutral-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { icon: '🚚', title: 'Free Shipping', desc: 'On orders over $100' },
                            { icon: '↩️', title: 'Easy Returns', desc: '30-day return policy' },
                            { icon: '🔒', title: 'Secure Payment', desc: 'Your data is protected' },
                            { icon: '💬', title: '24/7 Support', desc: 'Here to help you' },
                        ].map((badge, index) => (
                            <div key={index} className="text-center">
                                <span className="text-3xl mb-2 block">{badge.icon}</span>
                                <h3 className="font-medium text-neutral-900">{badge.title}</h3>
                                <p className="text-sm text-neutral-500">{badge.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <span className="text-caption text-primary-600 mb-2 block">Curated For You</span>
                        <h2 className="text-headline text-neutral-950">Featured Products</h2>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {featuredProducts.map((product) => (
                            <Link
                                key={product.id}
                                to={`/products/${product.id}`}
                                className="group"
                            >
                                <div className="card relative overflow-hidden">
                                    {/* Badge */}
                                    {product.badge && (
                                        <span className={`badge absolute top-4 left-4 z-10 ${product.badge === 'Sale' ? 'badge-sale' :
                                            product.badge === 'New' ? 'badge-new' : 'badge-featured'
                                            }`}>
                                            {product.badge}
                                        </span>
                                    )}

                                    {/* Image */}
                                    <div className="aspect-square overflow-hidden rounded-xl mb-4">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>

                                    {/* Details */}
                                    <h3 className="font-medium text-neutral-900 group-hover:text-primary-600 transition-colors">
                                        {product.name}
                                    </h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        {product.salePrice ? (
                                            <>
                                                <span className="font-semibold text-primary-600">${product.salePrice}</span>
                                                <span className="text-sm text-neutral-400 line-through">${product.price}</span>
                                            </>
                                        ) : (
                                            <span className="font-semibold text-neutral-900">${product.price}</span>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <Link to={ROUTES.products}>
                            <Button variant="secondary" size="lg">
                                View All Products
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Categories Banner */}
            <section className="py-20 bg-neutral-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <span className="text-caption text-secondary-600 mb-2 block">Browse By</span>
                        <h2 className="text-headline text-neutral-950">Shop Categories</h2>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {categories.map((category, index) => (
                            <Link
                                key={index}
                                to={`/categories/${category.name.toLowerCase().replace(' ', '-')}`}
                                className="group relative overflow-hidden rounded-2xl aspect-[4/5]"
                            >
                                <img
                                    src={category.image}
                                    alt={category.name}
                                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-950/20 to-transparent" />
                                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                    <h3 className="text-xl font-serif font-medium mb-1">{category.name}</h3>
                                    <p className="text-neutral-300 text-sm">{category.count} products</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Banner */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary-600 to-primary-700 text-white">
                        <div className="relative z-10 px-8 py-16 md:py-20 md:px-16 text-center">
                            <h2 className="text-3xl md:text-4xl font-serif font-medium mb-4">
                                Join our community
                            </h2>
                            <p className="text-primary-100 text-lg mb-8 max-w-xl mx-auto">
                                Subscribe for exclusive access to new arrivals, special offers, and style inspiration.
                            </p>
                            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="flex-1 px-5 py-3 rounded-xl text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-white/50"
                                />
                                <Button variant="secondary" size="lg" className="bg-white text-primary-700 hover:bg-neutral-100">
                                    Subscribe
                                </Button>
                            </form>
                        </div>
                        {/* Decorative shapes */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500 rounded-full opacity-30 blur-3xl" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary-800 rounded-full opacity-40 blur-2xl" />
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
