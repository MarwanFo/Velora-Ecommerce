import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AdminLayout from '../../components/admin/AdminLayout';
import adminService from '../../services/adminService';

/**
 * Admin Products Page
 * List and manage all products
 */
const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchProducts();
    }, [filter]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const params = {};
            if (filter !== 'all') params.status = filter;
            const response = await adminService.getProducts(params);
            setProducts(response.data || []);
        } catch (error) {
            console.error('Failed to fetch products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (id) => {
        try {
            await adminService.toggleProductStatus(id);
            fetchProducts();
        } catch (error) {
            console.error('Failed to toggle status:', error);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this product?')) return;
        try {
            await adminService.deleteProduct(id);
            fetchProducts();
        } catch (error) {
            console.error('Failed to delete product:', error);
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Products</h1>
                        <p className="text-neutral-400">Manage your product inventory</p>
                    </div>
                    <Link
                        to="/admin/products/new"
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors inline-flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Product
                    </Link>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-neutral-800 border border-neutral-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                    </div>
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="px-4 py-2 bg-neutral-800 border border-neutral-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                        <option value="all">All Products</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="low_stock">Low Stock</option>
                        <option value="out_of_stock">Out of Stock</option>
                    </select>
                </div>

                {/* Products Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-neutral-800 rounded-xl overflow-hidden"
                >
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-neutral-700/50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Product</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase">SKU</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Price</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Stock</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Status</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-neutral-400 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-700">
                                {loading ? (
                                    [...Array(5)].map((_, i) => (
                                        <tr key={i} className="animate-pulse">
                                            <td className="px-6 py-4"><div className="h-4 bg-neutral-700 rounded w-32" /></td>
                                            <td className="px-6 py-4"><div className="h-4 bg-neutral-700 rounded w-20" /></td>
                                            <td className="px-6 py-4"><div className="h-4 bg-neutral-700 rounded w-16" /></td>
                                            <td className="px-6 py-4"><div className="h-4 bg-neutral-700 rounded w-12" /></td>
                                            <td className="px-6 py-4"><div className="h-4 bg-neutral-700 rounded w-16" /></td>
                                            <td className="px-6 py-4"><div className="h-4 bg-neutral-700 rounded w-20 ml-auto" /></td>
                                        </tr>
                                    ))
                                ) : filteredProducts.length > 0 ? (
                                    filteredProducts.map((product) => (
                                        <tr key={product.id} className="hover:bg-neutral-700/30">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-neutral-700 rounded-lg overflow-hidden">
                                                        <img
                                                            src={product.primary_image?.url || 'https://placehold.co/40x40/374151/9ca3af?text=?'}
                                                            alt={product.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div>
                                                        <p className="text-white font-medium">{product.name}</p>
                                                        <p className="text-neutral-400 text-sm">{product.category?.name}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-neutral-300 font-mono text-sm">{product.sku || '-'}</td>
                                            <td className="px-6 py-4">
                                                {product.is_on_sale ? (
                                                    <div>
                                                        <span className="text-primary-400">${product.current_price?.toFixed(2)}</span>
                                                        <span className="text-neutral-500 line-through text-sm ml-2">${product.price?.toFixed(2)}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-white">${product.price?.toFixed(2)}</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`${product.quantity <= 0 ? 'text-red-400' : product.quantity <= product.low_stock_threshold ? 'text-orange-400' : 'text-white'}`}>
                                                    {product.quantity}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => handleToggleStatus(product.id)}
                                                    className={`px-2 py-1 text-xs font-medium rounded ${product.is_active ? 'bg-green-500/20 text-green-400' : 'bg-neutral-500/20 text-neutral-400'}`}
                                                >
                                                    {product.is_active ? 'Active' : 'Inactive'}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        to={`/admin/products/${product.id}/edit`}
                                                        className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-700 rounded"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(product.id)}
                                                        className="p-2 text-neutral-400 hover:text-red-400 hover:bg-neutral-700 rounded"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-neutral-400">
                                            No products found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </div>
        </AdminLayout>
    );
};

export default AdminProducts;
