import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import productService from '../services/productService';
import PageTransition from '../components/common/PageTransition';
import Button from '../components/common/Button';

/**
 * ProductDetail Page
 * Single product page with image gallery and details
 */
const ProductDetail = () => {
    const { slug } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await productService.getProduct(slug);
                setProduct(response.data);
            } catch (err) {
                setError('Product not found');
                console.error('Failed to fetch product:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [slug]);

    if (loading) {
        return (
            <PageTransition>
                <div className="min-h-screen bg-neutral-50 py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid lg:grid-cols-2 gap-12">
                            {/* Image Skeleton */}
                            <div className="aspect-square bg-neutral-200 rounded-2xl animate-pulse" />
                            {/* Info Skeleton */}
                            <div className="space-y-4">
                                <div className="h-6 bg-neutral-200 rounded w-1/4 animate-pulse" />
                                <div className="h-10 bg-neutral-200 rounded w-3/4 animate-pulse" />
                                <div className="h-8 bg-neutral-200 rounded w-1/3 animate-pulse" />
                                <div className="h-32 bg-neutral-200 rounded animate-pulse" />
                            </div>
                        </div>
                    </div>
                </div>
            </PageTransition>
        );
    }

    if (error || !product) {
        return (
            <PageTransition>
                <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
                    <div className="text-center">
                        <h2 className="text-2xl font-serif font-medium text-neutral-900 mb-4">
                            Product Not Found
                        </h2>
                        <p className="text-neutral-600 mb-6">
                            The product you're looking for doesn't exist or has been removed.
                        </p>
                        <Link
                            to="/products"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Products
                        </Link>
                    </div>
                </div>
            </PageTransition>
        );
    }

    const {
        name,
        description,
        short_description,
        price,
        current_price,
        is_on_sale,
        discount_percent,
        is_in_stock,
        quantity: stock,
        brand,
        sku,
        category,
        images = [],
    } = product;

    // Use images array or create placeholder
    const productImages = images.length > 0
        ? images
        : [{ url: 'https://placehold.co/600x600/f5f4f1/a8a39a?text=No+Image', alt_text: name }];

    return (
        <PageTransition>
            <div className="min-h-screen bg-neutral-50">
                {/* Breadcrumb */}
                <div className="bg-white border-b border-neutral-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <nav className="flex items-center gap-2 text-sm">
                            <Link to="/" className="text-neutral-500 hover:text-neutral-700">Home</Link>
                            <span className="text-neutral-300">/</span>
                            <Link to="/products" className="text-neutral-500 hover:text-neutral-700">Products</Link>
                            {category && (
                                <>
                                    <span className="text-neutral-300">/</span>
                                    <Link to={`/products?category=${category.slug}`} className="text-neutral-500 hover:text-neutral-700">
                                        {category.name}
                                    </Link>
                                </>
                            )}
                            <span className="text-neutral-300">/</span>
                            <span className="text-neutral-900 font-medium truncate">{name}</span>
                        </nav>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Image Gallery */}
                        <div className="space-y-4">
                            {/* Main Image */}
                            <motion.div
                                className="aspect-square bg-white rounded-2xl overflow-hidden shadow-sm"
                                layoutId={`product-image-${slug}`}
                            >
                                <AnimatePresence mode="wait">
                                    <motion.img
                                        key={selectedImage}
                                        src={productImages[selectedImage]?.url}
                                        alt={productImages[selectedImage]?.alt_text || name}
                                        className="w-full h-full object-cover"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    />
                                </AnimatePresence>

                                {/* Sale Badge */}
                                {is_on_sale && (
                                    <div className="absolute top-4 left-4 px-3 py-1 bg-error text-white text-sm font-medium rounded-full">
                                        -{discount_percent}% OFF
                                    </div>
                                )}
                            </motion.div>

                            {/* Thumbnails */}
                            {productImages.length > 1 && (
                                <div className="flex gap-3 overflow-x-auto pb-2">
                                    {productImages.map((img, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedImage(index)}
                                            className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${selectedImage === index
                                                    ? 'border-primary-600'
                                                    : 'border-transparent hover:border-neutral-300'
                                                }`}
                                        >
                                            <img
                                                src={img.url}
                                                alt={img.alt_text || `${name} ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product Info */}
                        <div>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                {/* Category */}
                                {category && (
                                    <Link
                                        to={`/products?category=${category.slug}`}
                                        className="text-sm text-primary-600 font-medium uppercase tracking-wide hover:text-primary-700"
                                    >
                                        {category.name}
                                    </Link>
                                )}

                                {/* Name */}
                                <h1 className="text-3xl md:text-4xl font-serif font-medium text-neutral-900 mt-2">
                                    {name}
                                </h1>

                                {/* Brand */}
                                {brand && (
                                    <p className="text-neutral-600 mt-2">by <span className="font-medium">{brand}</span></p>
                                )}

                                {/* Price */}
                                <div className="flex items-baseline gap-3 mt-6">
                                    <span className="text-3xl font-semibold text-neutral-900">
                                        ${current_price?.toFixed(2)}
                                    </span>
                                    {is_on_sale && (
                                        <>
                                            <span className="text-xl text-neutral-400 line-through">
                                                ${price?.toFixed(2)}
                                            </span>
                                            <span className="px-2 py-1 bg-error/10 text-error text-sm font-medium rounded">
                                                Save ${(price - current_price).toFixed(2)}
                                            </span>
                                        </>
                                    )}
                                </div>

                                {/* Short Description */}
                                {short_description && (
                                    <p className="text-neutral-600 mt-6 text-lg leading-relaxed">
                                        {short_description}
                                    </p>
                                )}

                                {/* Stock Status */}
                                <div className="mt-6">
                                    {is_in_stock ? (
                                        <div className="flex items-center gap-2 text-secondary-600">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            <span className="font-medium">In Stock</span>
                                            <span className="text-neutral-400">({stock} available)</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 text-error">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                            </svg>
                                            <span className="font-medium">Out of Stock</span>
                                        </div>
                                    )}
                                </div>

                                {/* Quantity & Add to Cart */}
                                {is_in_stock && (
                                    <div className="mt-8 space-y-4">
                                        {/* Quantity Selector */}
                                        <div className="flex items-center gap-4">
                                            <label className="text-neutral-700 font-medium">Quantity:</label>
                                            <div className="flex items-center border border-neutral-200 rounded-xl">
                                                <button
                                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                    className="w-10 h-10 flex items-center justify-center text-neutral-600 hover:bg-neutral-50 rounded-l-xl"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                                    </svg>
                                                </button>
                                                <input
                                                    type="number"
                                                    value={quantity}
                                                    onChange={(e) => setQuantity(Math.max(1, Math.min(stock, parseInt(e.target.value) || 1)))}
                                                    className="w-16 h-10 text-center border-x border-neutral-200 focus:outline-none"
                                                    min="1"
                                                    max={stock}
                                                />
                                                <button
                                                    onClick={() => setQuantity(Math.min(stock, quantity + 1))}
                                                    className="w-10 h-10 flex items-center justify-center text-neutral-600 hover:bg-neutral-50 rounded-r-xl"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>

                                        {/* Add to Cart Button */}
                                        <div className="flex gap-4">
                                            <Button variant="primary" size="lg" className="flex-1">
                                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                                </svg>
                                                Add to Cart
                                            </Button>
                                            <button className="w-14 h-14 flex items-center justify-center border border-neutral-200 rounded-xl hover:bg-neutral-50 text-neutral-600 hover:text-primary-600 transition-colors">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* SKU */}
                                {sku && (
                                    <p className="text-sm text-neutral-500 mt-8">
                                        SKU: <span className="font-mono">{sku}</span>
                                    </p>
                                )}

                                {/* Full Description */}
                                {description && (
                                    <div className="mt-8 pt-8 border-t border-neutral-200">
                                        <h3 className="text-lg font-medium text-neutral-900 mb-4">Description</h3>
                                        <div className="prose prose-neutral max-w-none">
                                            <p className="text-neutral-600 leading-relaxed whitespace-pre-line">
                                                {description}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
};

export default ProductDetail;
