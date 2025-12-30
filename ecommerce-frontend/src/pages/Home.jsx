import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/common/Button';
import { ROUTES } from '../constants/config';
import productService from '../services/productService';
import categoryService from '../services/categoryService';

/**
 * Home Page
 * Landing page with hero section, featured products, and categories
 * Designed with "human touch" - organic layout, warm colors, personality
 */
const Home = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsRes, categoriesRes] = await Promise.all([
                    productService.getFeatured(),
                    categoryService.getAll()
                ]);
                setFeaturedProducts(productsRes.data?.slice(0, 4) || []);
                setCategories(categoriesRes.data?.slice(0, 4) || []);
            } catch (error) {
                console.error('Failed to fetch home data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Category images mapping
    const categoryImages = {
        'Home Decor': 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400&q=80',
        'Ceramics': 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=400&q=80',
        'Textiles': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
        'Accessories': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80',
        'default': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&q=80'
    };

    return (
        <div className="bg-neutral-50">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-neutral-50 to-secondary-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Hero Text */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-center lg:text-left"
                        >
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
                        </motion.div>

                        {/* Hero Image Grid */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="relative hidden lg:block"
                        >
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
                        </motion.div>
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
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="text-center"
                            >
                                <span className="text-3xl mb-2 block">{badge.icon}</span>
                                <h3 className="font-medium text-neutral-900">{badge.title}</h3>
                                <p className="text-sm text-neutral-500">{badge.desc}</p>
                            </motion.div>
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

                    {loading ? (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="animate-pulse">
                                    <div className="aspect-square bg-neutral-200 rounded-xl mb-4" />
                                    <div className="h-4 bg-neutral-200 rounded w-3/4 mb-2" />
                                    <div className="h-4 bg-neutral-200 rounded w-1/2" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {featuredProducts.map((product, index) => (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Link to={`/products/${product.slug}`} className="group">
                                        <div className="card relative overflow-hidden">
                                            {/* Badge */}
                                            {product.is_on_sale && (
                                                <span className="badge badge-sale absolute top-4 left-4 z-10">
                                                    Sale
                                                </span>
                                            )}
                                            {product.is_featured && !product.is_on_sale && (
                                                <span className="badge badge-featured absolute top-4 left-4 z-10">
                                                    Featured
                                                </span>
                                            )}

                                            {/* Image */}
                                            <div className="aspect-square overflow-hidden rounded-xl mb-4 bg-neutral-100">
                                                <img
                                                    src={product.primary_image?.url || 'https://placehold.co/400x400/f5f4f1/a8a39a?text=No+Image'}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            </div>

                                            {/* Details */}
                                            <h3 className="font-medium text-neutral-900 group-hover:text-primary-600 transition-colors">
                                                {product.name}
                                            </h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                {product.is_on_sale ? (
                                                    <>
                                                        <span className="font-semibold text-primary-600">${product.current_price?.toFixed(2)}</span>
                                                        <span className="text-sm text-neutral-400 line-through">${product.price?.toFixed(2)}</span>
                                                    </>
                                                ) : (
                                                    <span className="font-semibold text-neutral-900">${product.price?.toFixed(2)}</span>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    )}

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

                    {loading ? (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="animate-pulse aspect-[4/5] bg-neutral-200 rounded-2xl" />
                            ))}
                        </div>
                    ) : (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {categories.map((category, index) => (
                                <motion.div
                                    key={category.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Link
                                        to={`/products?category=${category.slug}`}
                                        className="group relative overflow-hidden rounded-2xl aspect-[4/5] block"
                                    >
                                        <img
                                            src={categoryImages[category.name] || categoryImages.default}
                                            alt={category.name}
                                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-950/20 to-transparent" />
                                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                            <h3 className="text-xl font-serif font-medium mb-1">{category.name}</h3>
                                            <p className="text-neutral-300 text-sm">{category.products_count || 0} products</p>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Banner */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary-600 to-primary-700 text-white"
                    >
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
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default Home;
