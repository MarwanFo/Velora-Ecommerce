import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AdminLayout from '../../components/admin/AdminLayout';
import adminService from '../../services/adminService';

/**
 * Admin Orders Page
 * List and manage all orders
 */
const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        fetchOrders();
    }, [statusFilter]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const params = {};
            if (statusFilter !== 'all') params.status = statusFilter;
            const response = await adminService.getOrders(params);
            // Handle both array and paginated response
            const data = response.data?.data || response.data || [];
            setOrders(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (orderId, status) => {
        try {
            await adminService.updateOrderStatus(orderId, status);
            fetchOrders();
        } catch (error) {
            console.error('Failed to update status:', error);
        }
    };

    const formatPrice = (value) => {
        const num = parseFloat(value) || 0;
        return `$${num.toFixed(2)}`;
    };

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

    const getPaymentColor = (status) => {
        const colors = {
            pending: 'text-yellow-400',
            paid: 'text-green-400',
            failed: 'text-red-400',
            refunded: 'text-purple-400',
        };
        return colors[status] || 'text-neutral-400';
    };

    // Get customer info from order
    const getCustomerInfo = (order) => {
        // Try different possible structures
        if (order.shipping_address) {
            const shipping = typeof order.shipping_address === 'string'
                ? JSON.parse(order.shipping_address)
                : order.shipping_address;
            return { name: shipping.name || 'N/A', email: shipping.email || '' };
        }
        if (order.shipping) {
            return { name: order.shipping.name || 'N/A', email: order.shipping.email || '' };
        }
        if (order.user) {
            return { name: order.user.name || 'N/A', email: order.user.email || '' };
        }
        return { name: 'Guest', email: '' };
    };

    const filteredOrders = orders.filter(o => {
        const customer = getCustomerInfo(o);
        return o.order_number?.toLowerCase().includes(search.toLowerCase()) ||
            customer.email?.toLowerCase().includes(search.toLowerCase()) ||
            customer.name?.toLowerCase().includes(search.toLowerCase());
    });

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-white">Orders</h1>
                    <p className="text-neutral-400">Manage customer orders</p>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search by order number, email, or name..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-neutral-800 border border-neutral-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 bg-neutral-800 border border-neutral-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>

                {/* Orders Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-neutral-800 rounded-xl overflow-hidden"
                >
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-neutral-700/50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Order</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Customer</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Total</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Payment</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-700">
                                {loading ? (
                                    [...Array(5)].map((_, i) => (
                                        <tr key={i} className="animate-pulse">
                                            <td className="px-6 py-4"><div className="h-4 bg-neutral-700 rounded w-24" /></td>
                                            <td className="px-6 py-4"><div className="h-4 bg-neutral-700 rounded w-32" /></td>
                                            <td className="px-6 py-4"><div className="h-4 bg-neutral-700 rounded w-16" /></td>
                                            <td className="px-6 py-4"><div className="h-4 bg-neutral-700 rounded w-16" /></td>
                                            <td className="px-6 py-4"><div className="h-4 bg-neutral-700 rounded w-20" /></td>
                                            <td className="px-6 py-4"><div className="h-4 bg-neutral-700 rounded w-20" /></td>
                                        </tr>
                                    ))
                                ) : filteredOrders.length > 0 ? (
                                    filteredOrders.map((order) => {
                                        const customer = getCustomerInfo(order);
                                        return (
                                            <tr key={order.id} className="hover:bg-neutral-700/30">
                                                <td className="px-6 py-4">
                                                    <Link
                                                        to={`/vl-control-panel/transactions/${order.id}`}
                                                        className="text-primary-400 hover:text-primary-300 font-mono"
                                                    >
                                                        {order.order_number || `#${order.id}`}
                                                    </Link>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="text-white">{customer.name}</p>
                                                    <p className="text-neutral-400 text-sm">{customer.email}</p>
                                                </td>
                                                <td className="px-6 py-4 text-white font-medium">
                                                    {formatPrice(order.total)}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`capitalize ${getPaymentColor(order.payment_status)}`}>
                                                        {order.payment_status || 'pending'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <select
                                                        value={order.status || 'pending'}
                                                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                        className={`px-2 py-1 text-xs font-medium rounded bg-transparent cursor-pointer ${getStatusColor(order.status)}`}
                                                    >
                                                        <option value="pending" className="bg-neutral-800">Pending</option>
                                                        <option value="processing" className="bg-neutral-800">Processing</option>
                                                        <option value="shipped" className="bg-neutral-800">Shipped</option>
                                                        <option value="delivered" className="bg-neutral-800">Delivered</option>
                                                        <option value="cancelled" className="bg-neutral-800">Cancelled</option>
                                                    </select>
                                                </td>
                                                <td className="px-6 py-4 text-neutral-400 text-sm">
                                                    {order.created_at ? new Date(order.created_at).toLocaleDateString() : 'N/A'}
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-neutral-400">
                                            No orders found
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

export default AdminOrders;
