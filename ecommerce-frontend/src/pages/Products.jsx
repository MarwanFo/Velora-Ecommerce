import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '../components/products/ProductCard';
import productService from '../services/productService';
import categoryService from '../services/categoryService';
import PageTransition from '../components/common/PageTransition';

/**
 * Products Page
 * Product listing with filtering, sorting, and view options
 */
const Products = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    // State
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState(null);
    const [view, setView] = useState('grid');
    const [filtersOpen, setFiltersOpen] = useState(false);

    // Get current filters from URL
    const currentCategory = searchParams.get('category') || '';
    const currentSort = searchParams.get('sort') || 'created_at';
    const currentOrder = searchParams.get('order') || 'desc';
    const currentSearch = searchParams.get('search') || '';
    const currentPage = parseInt(searchParams.get('page') || '1');

    // Fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await categoryService.getCategories();
                setCategories(response.data || []);
            } catch (err) {
                console.error('Failed to fetch categories:', err);
            }
        };
        fetchCategories();
    }, []);

    // Fetch products
    const fetchProducts = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const params = {
                page: currentPage,
                per_page: 12,
                sort: currentSort,
                order: currentOrder,
            };

            if (currentCategory) params.category = currentCategory;
            if (currentSearch) params.search = currentSearch;

            const response = await productService.getProducts(params);
            setProducts(response.data || []);
            setPagination(response.meta || null);
        } catch (err) {
            setError('Failed to load products. Please try again.');
            console.error('Failed to fetch products:', err);
        } finally {
            setLoading(false);
        }
    }, [currentCategory, currentSort, currentOrder, currentSearch, currentPage]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    // Update URL params
    const updateFilters = (key, value) => {
        const newParams = new URLSearchParams(searchParams);
        if (value) {
            newParams.set(key, value);
        } else {
            newParams.delete(key);
        }
        // Reset to page 1 when filters change
        if (key !== 'page') {
            newParams.set('page', '1');
        }
        setSearchParams(newParams);
    };

    // Flatten categories for filter dropdown
    const flattenCategories = (cats, depth = 0) => {
        return cats.reduce((acc, cat) => {
            acc.push({ ...cat, depth });
            if (cat.children?.length) {
                acc.push(...flattenCategories(cat.children, depth + 1));
            }
            return acc;
        }, []);
    };

    const flatCategories = flattenCategories(categories);

    return (
        <PageTransition>
            <div className="min-h-screen bg-neutral-50">
                {/* Header */}
                <div className="bg-white border-b border-neutral-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <h1 className="text-3xl md:text-4xl font-serif font-medium text-neutral-900">
                            Our Collection
                        </h1>
                        <p className="mt-2 text-neutral-600">
                            Discover unique handcrafted treasures from talented artisans
                        </p>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Sidebar Filters - Desktop */}
                        <aside className="hidden lg:block w-64 flex-shrink-0">
                            <div className="sticky top-24 space-y-6">
                                {/* Category Filter */}
                                <div>
                                    <h3 className="font-medium text-neutral-900 mb-3">Category</h3>
                                    <ul className="space-y-2">
                                        <li>
                                            <button
                                                onClick={() => updateFilters('category', '')}
                                                className={`text-sm transition-colors ${!currentCategory ? 'text-primary-600 font-medium' : 'text-neutral-600 hover:text-primary-600'}`}
                                            >
                                                All Categories
                                            </button>
                                        </li>
                                        {flatCategories.map((cat) => (
                                            <li key={cat.id} style={{ paddingLeft: cat.depth * 16 }}>
                                                <button
                                                    onClick={() => updateFilters('category', cat.slug)}
                                                    className={`text-sm transition-colors ${currentCategory === cat.slug ? 'text-primary-600 font-medium' : 'text-neutral-600 hover:text-primary-600'}`}
                                                >
                                                    {cat.name}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </aside>

                        {/* Main Content */}
                        <div className="flex-1">
                            {/* Toolbar */}
                            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                                {/* Mobile Filter Toggle */}
                                <button
                                    onClick={() => setFiltersOpen(true)}
                                    className="lg:hidden flex items-center gap-2 px-4 py-2 border border-neutral-200 rounded-lg text-sm font-medium hover:bg-neutral-50"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                    </svg>
                                    Filters
                                </button>

                                {/* Results Count */}
                                <p className="text-sm text-neutral-600">
                                    {pagination?.total ? `${pagination.total} products` : 'Loading...'}
                                </p>

                                <div className="flex items-center gap-4 ml-auto">
                                    {/* Sort Dropdown */}
                                    <select
                                        value={`${currentSort}-${currentOrder}`}
                                        onChange={(e) => {
                                            const [sort, order] = e.target.value.split('-');
                                            updateFilters('sort', sort);
                                            setTimeout(() => updateFilters('order', order), 0);
                                        }}
                                        className="px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    >
                                        <option value="created_at-desc">Newest First</option>
                                        <option value="created_at-asc">Oldest First</option>
                                        <option value="price-asc">Price: Low to High</option>
                                        <option value="price-desc">Price: High to Low</option>
                                        <option value="name-asc">Name: A-Z</option>
                                        <option value="name-desc">Name: Z-A</option>
                                    </select>

                                    {/* View Toggle */}
                                    <div className="hidden sm:flex items-center border border-neutral-200 rounded-lg overflow-hidden">
                                        <button
                                            onClick={() => setView('grid')}
                                            className={`p-2 ${view === 'grid' ? 'bg-primary-600 text-white' : 'text-neutral-600 hover:bg-neutral-50'}`}
                                            aria-label="Grid view"
                                        >
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => setView('list')}
                                            className={`p-2 ${view === 'list' ? 'bg-primary-600 text-white' : 'text-neutral-600 hover:bg-neutral-50'}`}
                                            aria-label="List view"
                                        >
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Loading State */}
                            {loading && (
                                <div className={`grid gap-6 ${view === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : ''}`}>
                                    {[...Array(6)].map((_, i) => (
                                        <div key={i} className="animate-pulse">
                                            <div className="aspect-square bg-neutral-200 rounded-2xl mb-4" />
                                            <div className="h-4 bg-neutral-200 rounded w-1/4 mb-2" />
                                            <div className="h-5 bg-neutral-200 rounded w-3/4 mb-2" />
                                            <div className="h-4 bg-neutral-200 rounded w-1/2" />
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Error State */}
                            {error && !loading && (
                                <div className="text-center py-12">
                                    <p className="text-error mb-4">{error}</p>
                                    <button
                                        onClick={fetchProducts}
                                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                                    >
                                        Try Again
                                    </button>
                                </div>
                            )}

                            {/* Empty State */}
                            {!loading && !error && products.length === 0 && (
                                <div className="text-center py-12">
                                    <svg className="w-16 h-16 text-neutral-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                    <h3 className="text-lg font-medium text-neutral-900 mb-2">No products found</h3>
                                    <p className="text-neutral-600">Try adjusting your filters or search terms</p>
                                </div>
                            )}

                            {/* Products Grid/List */}
                            {!loading && !error && products.length > 0 && (
                                <motion.div
                                    layout
                                    className={view === 'grid'
                                        ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                                        : 'space-y-4'
                                    }
                                >
                                    <AnimatePresence mode="popLayout">
                                        {products.map((product) => (
                                            <ProductCard key={product.id} product={product} view={view} />
                                        ))}
                                    </AnimatePresence>
                                </motion.div>
                            )}

                            {/* Pagination */}
                            {pagination && pagination.last_page > 1 && (
                                <div className="flex justify-center gap-2 mt-8">
                                    {/* Previous */}
                                    <button
                                        onClick={() => updateFilters('page', String(currentPage - 1))}
                                        disabled={currentPage === 1}
                                        className="px-4 py-2 border border-neutral-200 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-50"
                                    >
                                        Previous
                                    </button>

                                    {/* Page Numbers */}
                                    <div className="flex gap-1">
                                        {[...Array(pagination.last_page)].map((_, i) => {
                                            const page = i + 1;
                                            // Show first, last, current, and neighbors
                                            if (page === 1 || page === pagination.last_page || Math.abs(page - currentPage) <= 1) {
                                                return (
                                                    <button
                                                        key={page}
                                                        onClick={() => updateFilters('page', String(page))}
                                                        className={`w-10 h-10 rounded-lg text-sm font-medium ${page === currentPage
                                                                ? 'bg-primary-600 text-white'
                                                                : 'border border-neutral-200 hover:bg-neutral-50'
                                                            }`}
                                                    >
                                                        {page}
                                                    </button>
                                                );
                                            }
                                            // Show ellipsis
                                            if (page === 2 && currentPage > 3) {
                                                return <span key={page} className="w-10 h-10 flex items-center justify-center">...</span>;
                                            }
                                            if (page === pagination.last_page - 1 && currentPage < pagination.last_page - 2) {
                                                return <span key={page} className="w-10 h-10 flex items-center justify-center">...</span>;
                                            }
                                            return null;
                                        })}
                                    </div>

                                    {/* Next */}
                                    <button
                                        onClick={() => updateFilters('page', String(currentPage + 1))}
                                        disabled={currentPage === pagination.last_page}
                                        className="px-4 py-2 border border-neutral-200 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-50"
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Mobile Filters Overlay */}
                <AnimatePresence>
                    {filtersOpen && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                                onClick={() => setFiltersOpen(false)}
                            />
                            <motion.div
                                initial={{ x: '-100%' }}
                                animate={{ x: 0 }}
                                exit={{ x: '-100%' }}
                                transition={{ type: 'spring', damping: 25 }}
                                className="fixed inset-y-0 left-0 w-80 bg-white z-50 p-6 overflow-y-auto lg:hidden"
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-lg font-medium">Filters</h2>
                                    <button onClick={() => setFiltersOpen(false)}>
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Category Filter */}
                                <div>
                                    <h3 className="font-medium text-neutral-900 mb-3">Category</h3>
                                    <ul className="space-y-2">
                                        <li>
                                            <button
                                                onClick={() => { updateFilters('category', ''); setFiltersOpen(false); }}
                                                className={`text-sm transition-colors ${!currentCategory ? 'text-primary-600 font-medium' : 'text-neutral-600'}`}
                                            >
                                                All Categories
                                            </button>
                                        </li>
                                        {flatCategories.map((cat) => (
                                            <li key={cat.id} style={{ paddingLeft: cat.depth * 16 }}>
                                                <button
                                                    onClick={() => { updateFilters('category', cat.slug); setFiltersOpen(false); }}
                                                    className={`text-sm transition-colors ${currentCategory === cat.slug ? 'text-primary-600 font-medium' : 'text-neutral-600'}`}
                                                >
                                                    {cat.name}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>
        </PageTransition>
    );
};

export default Products;
