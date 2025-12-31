import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AdminLayout from '../../components/admin/AdminLayout';
import adminService from '../../services/adminService';

/**
 * Admin Product Form Page
 * Create or edit a product
 */
const AdminProductForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = Boolean(id);

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        short_description: '',
        category_id: '',
        brand: '',
        sku: '',
        price: '',
        sale_price: '',
        quantity: '',
        low_stock_threshold: '5',
        is_active: true,
        is_featured: false,
        meta_title: '',
        meta_description: '',
    });

    useEffect(() => {
        fetchCategories();
        if (isEditing) {
            fetchProduct();
        }
    }, [id]);

    const fetchCategories = async () => {
        try {
            const response = await adminService.getCategories();
            const data = response.data?.data || response.data || [];
            setCategories(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Failed to fetch categories:', err);
        }
    };

    const fetchProduct = async () => {
        setLoading(true);
        try {
            const response = await adminService.getProduct(id);
            const product = response.data?.data || response.data;
            setFormData({
                name: product.name || '',
                description: product.description || '',
                short_description: product.short_description || '',
                category_id: product.category_id || product.category?.id || '',
                brand: product.brand || '',
                sku: product.sku || '',
                price: product.price || '',
                sale_price: product.sale_price || '',
                quantity: product.quantity || '',
                low_stock_threshold: product.low_stock_threshold || '5',
                is_active: product.is_active ?? true,
                is_featured: product.is_featured ?? false,
                meta_title: product.meta_title || '',
                meta_description: product.meta_description || '',
            });
        } catch (err) {
            setError('Failed to load product');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        setSuccess('');

        // Prepare data
        const data = {
            ...formData,
            price: parseFloat(formData.price) || 0,
            sale_price: formData.sale_price ? parseFloat(formData.sale_price) : null,
            quantity: parseInt(formData.quantity) || 0,
            low_stock_threshold: parseInt(formData.low_stock_threshold) || 5,
            category_id: parseInt(formData.category_id),
        };

        try {
            if (isEditing) {
                await adminService.updateProduct(id, data);
                setSuccess('Product updated successfully!');
            } else {
                await adminService.createProduct(data);
                setSuccess('Product created successfully!');
                // Reset form after create
                if (!isEditing) {
                    setTimeout(() => {
                        navigate('/vl-control-panel/inventory');
                    }, 1500);
                }
            }
        } catch (err) {
            const message = err.response?.data?.message || err.response?.data?.errors;
            if (typeof message === 'object') {
                const errorMessages = Object.values(message).flat().join(', ');
                setError(errorMessages);
            } else {
                setError(message || 'Failed to save product');
            }
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="animate-pulse space-y-6">
                    <div className="h-8 bg-neutral-700 rounded w-48" />
                    <div className="bg-neutral-800 rounded-xl p-6 space-y-4">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="h-12 bg-neutral-700 rounded" />
                        ))}
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 text-sm text-neutral-400 mb-1">
                            <Link to="/vl-control-panel/inventory" className="hover:text-white">
                                Products
                            </Link>
                            <span>/</span>
                            <span>{isEditing ? 'Edit' : 'New'}</span>
                        </div>
                        <h1 className="text-2xl font-bold text-white">
                            {isEditing ? 'Edit Product' : 'Add New Product'}
                        </h1>
                    </div>
                    <Link
                        to="/vl-control-panel/inventory"
                        className="px-4 py-2 bg-neutral-700 text-white rounded-lg hover:bg-neutral-600 transition-colors"
                    >
                        Cancel
                    </Link>
                </div>

                {/* Messages */}
                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 text-green-400">
                        {success}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="grid lg:grid-cols-3 gap-6"
                    >
                        {/* Main Info */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-neutral-800 rounded-xl p-6 space-y-4">
                                <h2 className="text-lg font-semibold text-white">Product Information</h2>

                                {/* Name */}
                                <div>
                                    <label className="block text-sm font-medium text-neutral-300 mb-1">
                                        Product Name <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 bg-neutral-700 border border-neutral-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        placeholder="Enter product name"
                                    />
                                </div>

                                {/* Short Description */}
                                <div>
                                    <label className="block text-sm font-medium text-neutral-300 mb-1">
                                        Short Description
                                    </label>
                                    <input
                                        type="text"
                                        name="short_description"
                                        value={formData.short_description}
                                        onChange={handleChange}
                                        maxLength={500}
                                        className="w-full px-4 py-2 bg-neutral-700 border border-neutral-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        placeholder="Brief product description"
                                    />
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-medium text-neutral-300 mb-1">
                                        Description
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows={5}
                                        className="w-full px-4 py-2 bg-neutral-700 border border-neutral-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        placeholder="Full product description"
                                    />
                                </div>
                            </div>

                            {/* Pricing */}
                            <div className="bg-neutral-800 rounded-xl p-6 space-y-4">
                                <h2 className="text-lg font-semibold text-white">Pricing</h2>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-300 mb-1">
                                            Regular Price <span className="text-red-400">*</span>
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">$</span>
                                            <input
                                                type="number"
                                                name="price"
                                                value={formData.price}
                                                onChange={handleChange}
                                                required
                                                min="0"
                                                step="0.01"
                                                className="w-full pl-8 pr-4 py-2 bg-neutral-700 border border-neutral-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-300 mb-1">
                                            Sale Price
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">$</span>
                                            <input
                                                type="number"
                                                name="sale_price"
                                                value={formData.sale_price}
                                                onChange={handleChange}
                                                min="0"
                                                step="0.01"
                                                className="w-full pl-8 pr-4 py-2 bg-neutral-700 border border-neutral-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Inventory */}
                            <div className="bg-neutral-800 rounded-xl p-6 space-y-4">
                                <h2 className="text-lg font-semibold text-white">Inventory</h2>
                                <div className="grid sm:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-300 mb-1">
                                            SKU
                                        </label>
                                        <input
                                            type="text"
                                            name="sku"
                                            value={formData.sku}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 bg-neutral-700 border border-neutral-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                            placeholder="SKU-001"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-300 mb-1">
                                            Quantity <span className="text-red-400">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            name="quantity"
                                            value={formData.quantity}
                                            onChange={handleChange}
                                            required
                                            min="0"
                                            className="w-full px-4 py-2 bg-neutral-700 border border-neutral-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                            placeholder="0"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-300 mb-1">
                                            Low Stock Threshold
                                        </label>
                                        <input
                                            type="number"
                                            name="low_stock_threshold"
                                            value={formData.low_stock_threshold}
                                            onChange={handleChange}
                                            min="0"
                                            className="w-full px-4 py-2 bg-neutral-700 border border-neutral-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                            placeholder="5"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* SEO */}
                            <div className="bg-neutral-800 rounded-xl p-6 space-y-4">
                                <h2 className="text-lg font-semibold text-white">SEO</h2>
                                <div>
                                    <label className="block text-sm font-medium text-neutral-300 mb-1">
                                        Meta Title
                                    </label>
                                    <input
                                        type="text"
                                        name="meta_title"
                                        value={formData.meta_title}
                                        onChange={handleChange}
                                        maxLength={255}
                                        className="w-full px-4 py-2 bg-neutral-700 border border-neutral-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        placeholder="SEO title"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-neutral-300 mb-1">
                                        Meta Description
                                    </label>
                                    <textarea
                                        name="meta_description"
                                        value={formData.meta_description}
                                        onChange={handleChange}
                                        rows={2}
                                        maxLength={500}
                                        className="w-full px-4 py-2 bg-neutral-700 border border-neutral-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        placeholder="SEO description"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Status */}
                            <div className="bg-neutral-800 rounded-xl p-6 space-y-4">
                                <h2 className="text-lg font-semibold text-white">Status</h2>

                                <div className="flex items-center justify-between">
                                    <span className="text-neutral-300">Active</span>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="is_active"
                                            checked={formData.is_active}
                                            onChange={handleChange}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-neutral-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                                    </label>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-neutral-300">Featured</span>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="is_featured"
                                            checked={formData.is_featured}
                                            onChange={handleChange}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-neutral-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                                    </label>
                                </div>
                            </div>

                            {/* Category */}
                            <div className="bg-neutral-800 rounded-xl p-6 space-y-4">
                                <h2 className="text-lg font-semibold text-white">Category</h2>
                                <select
                                    name="category_id"
                                    value={formData.category_id}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 bg-neutral-700 border border-neutral-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                >
                                    <option value="">Select category</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Brand */}
                            <div className="bg-neutral-800 rounded-xl p-6 space-y-4">
                                <h2 className="text-lg font-semibold text-white">Brand</h2>
                                <input
                                    type="text"
                                    name="brand"
                                    value={formData.brand}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-neutral-700 border border-neutral-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    placeholder="Brand name"
                                />
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={saving}
                                className="w-full px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {saving ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        {isEditing ? 'Update Product' : 'Create Product'}
                                    </>
                                )}
                            </button>
                        </div>
                    </motion.div>
                </form>
            </div>
        </AdminLayout>
    );
};

export default AdminProductForm;
