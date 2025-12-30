import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AdminLayout from '../../components/admin/AdminLayout';
import adminService from '../../services/adminService';

/**
 * Admin Categories Page
 * List and manage all categories
 */
const AdminCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({ name: '', description: '' });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const response = await adminService.getCategories();
            setCategories(response.data || []);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCategory) {
                await adminService.updateCategory(editingCategory.id, formData);
            } else {
                await adminService.createCategory(formData);
            }
            setShowModal(false);
            setEditingCategory(null);
            setFormData({ name: '', description: '' });
            fetchCategories();
        } catch (error) {
            console.error('Failed to save category:', error);
        }
    };

    const handleEdit = (category) => {
        setEditingCategory(category);
        setFormData({ name: category.name, description: category.description || '' });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this category?')) return;
        try {
            await adminService.deleteCategory(id);
            fetchCategories();
        } catch (error) {
            console.error('Failed to delete category:', error);
            alert('Cannot delete category with products. Reassign products first.');
        }
    };

    const openNewModal = () => {
        setEditingCategory(null);
        setFormData({ name: '', description: '' });
        setShowModal(true);
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Categories</h1>
                        <p className="text-neutral-400">Manage product categories</p>
                    </div>
                    <button
                        onClick={openNewModal}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors inline-flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Category
                    </button>
                </div>

                {/* Categories Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        [...Array(6)].map((_, i) => (
                            <div key={i} className="bg-neutral-800 rounded-xl p-6 animate-pulse">
                                <div className="h-6 bg-neutral-700 rounded w-1/2 mb-3" />
                                <div className="h-4 bg-neutral-700 rounded w-3/4 mb-4" />
                                <div className="h-4 bg-neutral-700 rounded w-1/4" />
                            </div>
                        ))
                    ) : categories.length > 0 ? (
                        categories.map((category, index) => (
                            <motion.div
                                key={category.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-neutral-800 rounded-xl p-6"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <h3 className="text-lg font-semibold text-white">{category.name}</h3>
                                    <div className="flex gap-1">
                                        <button
                                            onClick={() => handleEdit(category)}
                                            className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-700 rounded"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(category.id)}
                                            className="p-1.5 text-neutral-400 hover:text-red-400 hover:bg-neutral-700 rounded"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                <p className="text-neutral-400 text-sm mb-4 line-clamp-2">
                                    {category.description || 'No description'}
                                </p>
                                <span className="text-xs text-neutral-500">
                                    {category.products_count || 0} products
                                </span>
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12 text-neutral-400">
                            No categories yet. Create your first category!
                        </div>
                    )}
                </div>

                {/* Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-neutral-800 rounded-xl p-6 w-full max-w-md"
                        >
                            <h2 className="text-xl font-bold text-white mb-4">
                                {editingCategory ? 'Edit Category' : 'New Category'}
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-neutral-300 mb-1">Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-2 bg-neutral-700 border border-neutral-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-neutral-300 mb-1">Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        rows={3}
                                        className="w-full px-4 py-2 bg-neutral-700 border border-neutral-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    />
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="flex-1 px-4 py-2 bg-neutral-700 text-white rounded-lg hover:bg-neutral-600"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                                    >
                                        {editingCategory ? 'Save Changes' : 'Create'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default AdminCategories;
