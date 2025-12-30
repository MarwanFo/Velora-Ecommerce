import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AdminLayout from '../../components/admin/AdminLayout';
import adminService from '../../services/adminService';

/**
 * Admin Dashboard Page
 * Overview of store statistics and recent activity
 */
const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await adminService.getDashboard();
                setStats(response.data);
            } catch (error) {
                console.error('Failed to fetch dashboard stats:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const statCards = [
        {
            title: 'Total Revenue',
            value: stats?.revenue?.total ? `$${stats.revenue.total.toFixed(2)}` : '$0.00',
            icon: '💰',
            color: 'bg-green-500',
        },
        {
            title: 'Total Orders',
            value: stats?.orders?.total || 0,
            icon: '📦',
            color: 'bg-blue-500',
        },
        {
            title: 'Total Products',
            value: stats?.products?.total || 0,
            icon: '🛍️',
            color: 'bg-purple-500',
        },
        {
            title: 'Total Customers',
            value: stats?.users?.total || 0,
            icon: '👥',
            color: 'bg-orange-500',
        },
    ];

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-500/20 text-yellow-400',
            processing: 'bg-blue-500/20 text-blue-400',
            shipped: 'bg-purple-500/20 text-purple-400',
            delivered: 'bg-green-500/20 text-green-400',
            cancelled: 'bg-red-500/20 text-red-400',
        };
        return colors[status] || 'bg-neutral-500/20 text-neutral-400';
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-neutral-800 rounded-xl p-6 animate-pulse">
                                <div className="h-4 bg-neutral-700 rounded w-1/2 mb-4" />
                                <div className="h-8 bg-neutral-700 rounded w-3/4" />
                            </div>
                        ))}
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-white">Dashboard</h1>
                    <p className="text-neutral-400">Welcome back! Here&apos;s what&apos;s happening with your store.</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statCards.map((card, index) => (
                        <motion.div
                            key={card.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-neutral-800 rounded-xl p-6"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-2xl">{card.icon}</span>
                                <span className={`w-10 h-10 ${card.color} rounded-lg opacity-20`} />
                            </div>
                            <p className="text-neutral-400 text-sm">{card.title}</p>
                            <p className="text-2xl font-bold text-white mt-1">{card.value}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Quick Stats */}
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Order Status */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-neutral-800 rounded-xl p-6"
                    >
                        <h2 className="text-lg font-semibold text-white mb-4">Order Status</h2>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-neutral-400">Pending</span>
                                <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-sm rounded">
                                    {stats?.orders?.pending || 0}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-neutral-400">Processing</span>
                                <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-sm rounded">
                                    {stats?.orders?.processing || 0}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-neutral-400">Completed</span>
                                <span className="px-2 py-1 bg-green-500/20 text-green-400 text-sm rounded">
                                    {stats?.orders?.completed || 0}
                                </span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Product Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-neutral-800 rounded-xl p-6"
                    >
                        <h2 className="text-lg font-semibold text-white mb-4">Inventory</h2>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-neutral-400">Active Products</span>
                                <span className="text-white font-medium">{stats?.products?.active || 0}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-neutral-400">Low Stock</span>
                                <span className="px-2 py-1 bg-orange-500/20 text-orange-400 text-sm rounded">
                                    {stats?.products?.low_stock || 0}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-neutral-400">Out of Stock</span>
                                <span className="px-2 py-1 bg-red-500/20 text-red-400 text-sm rounded">
                                    {stats?.products?.out_of_stock || 0}
                                </span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Quick Actions */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="bg-neutral-800 rounded-xl p-6"
                    >
                        <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
                        <div className="space-y-3">
                            <Link
                                to="/admin/products/new"
                                className="block w-full px-4 py-2 bg-primary-600 text-white text-center rounded-lg hover:bg-primary-700 transition-colors"
                            >
                                Add New Product
                            </Link>
                            <Link
                                to="/admin/orders"
                                className="block w-full px-4 py-2 bg-neutral-700 text-white text-center rounded-lg hover:bg-neutral-600 transition-colors"
                            >
                                View All Orders
                            </Link>
                            <Link
                                to="/admin/categories"
                                className="block w-full px-4 py-2 bg-neutral-700 text-white text-center rounded-lg hover:bg-neutral-600 transition-colors"
                            >
                                Manage Categories
                            </Link>
                        </div>
                    </motion.div>
                </div>

                {/* Recent Orders */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="bg-neutral-800 rounded-xl overflow-hidden"
                >
                    <div className="p-6 border-b border-neutral-700 flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-white">Recent Orders</h2>
                        <Link to="/admin/orders" className="text-primary-400 hover:text-primary-300 text-sm">
                            View all →
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-neutral-700/50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Order</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Customer</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Total</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-700">
                                {stats?.recent_orders?.length > 0 ? (
                                    stats.recent_orders.map((order) => (
                                        <tr key={order.id} className="hover:bg-neutral-700/30">
                                            <td className="px-6 py-4">
                                                <Link to={`/admin/orders/${order.id}`} className="text-primary-400 hover:text-primary-300">
                                                    {order.order_number}
                                                </Link>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-white">{order.customer_name}</p>
                                                <p className="text-neutral-400 text-sm">{order.customer_email}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(order.status)}`}>
                                                    {order.status_label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-white">${order.total?.toFixed(2)}</td>
                                            <td className="px-6 py-4 text-neutral-400 text-sm">
                                                {new Date(order.created_at).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-neutral-400">
                                            No orders yet
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

export default AdminDashboard;
