import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AdminLayout from '../../components/admin/AdminLayout';
import adminService from '../../services/adminService';

/**
 * Admin Order Detail Page
 * View and manage a single order
 */
const AdminOrderDetail = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchOrder();
    }, [id]);

    const fetchOrder = async () => {
        setLoading(true);
        try {
            const response = await adminService.getOrder(id);
            setOrder(response.data?.data || response.data);
        } catch (err) {
            setError('Failed to load order');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (status) => {
        setUpdating(true);
        setError('');
        setSuccess('');
        try {
            await adminService.updateOrderStatus(id, status);
            setSuccess('Order status updated!');
            fetchOrder();
        } catch (err) {
            setError('Failed to update status');
        } finally {
            setUpdating(false);
        }
    };

    const formatPrice = (value) => {
        const num = parseFloat(value) || 0;
        return `$${num.toFixed(2)}`;
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
            processing: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
            shipped: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
            delivered: 'bg-green-500/20 text-green-400 border-green-500/30',
            cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
        };
        return colors[status] || 'bg-neutral-500/20 text-neutral-400 border-neutral-500/30';
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

    // Extract shipping info
    const getShippingInfo = () => {
        if (!order) return {};
        if (order.shipping_address) {
            return typeof order.shipping_address === 'string'
                ? JSON.parse(order.shipping_address)
                : order.shipping_address;
        }
        if (order.shipping) return order.shipping;
        return {};
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="animate-pulse space-y-6">
                    <div className="h-8 bg-neutral-700 rounded w-48" />
                    <div className="grid lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 bg-neutral-800 rounded-xl p-6 h-64" />
                        <div className="bg-neutral-800 rounded-xl p-6 h-64" />
                    </div>
                </div>
            </AdminLayout>
        );
    }

    if (error && !order) {
        return (
            <AdminLayout>
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
                    <p className="text-red-400">{error}</p>
                    <Link
                        to="/vl-control-panel/transactions"
                        className="mt-4 inline-block px-4 py-2 bg-neutral-700 text-white rounded-lg"
                    >
                        Back to Orders
                    </Link>
                </div>
            </AdminLayout>
        );
    }

    const shipping = getShippingInfo();
    const items = order?.items || [];

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-sm text-neutral-400 mb-1">
                            <Link to="/vl-control-panel/transactions" className="hover:text-white">
                                Orders
                            </Link>
                            <span>/</span>
                            <span>{order?.order_number || `#${id}`}</span>
                        </div>
                        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                            Order {order?.order_number || `#${id}`}
                            <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(order?.status)}`}>
                                {order?.status || 'Unknown'}
                            </span>
                        </h1>
                    </div>
                    <Link
                        to="/vl-control-panel/transactions"
                        className="px-4 py-2 bg-neutral-700 text-white rounded-lg hover:bg-neutral-600 transition-colors"
                    >
                        Back to Orders
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

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Order Items */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-neutral-800 rounded-xl overflow-hidden"
                        >
                            <div className="p-6 border-b border-neutral-700">
                                <h2 className="text-lg font-semibold text-white">Order Items</h2>
                            </div>
                            <div className="divide-y divide-neutral-700">
                                {items.length > 0 ? items.map((item, index) => (
                                    <div key={index} className="p-4 flex items-center gap-4">
                                        <div className="w-16 h-16 bg-neutral-700 rounded-lg overflow-hidden flex-shrink-0">
                                            <img
                                                src={item.product?.primary_image?.url || item.image || 'https://placehold.co/64x64/374151/9ca3af?text=?'}
                                                alt={item.name || item.product?.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-white font-medium truncate">
                                                {item.name || item.product?.name || 'Product'}
                                            </p>
                                            <p className="text-neutral-400 text-sm">
                                                Qty: {item.quantity} × {formatPrice(item.price)}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-white font-medium">
                                                {formatPrice((item.quantity || 1) * (item.price || 0))}
                                            </p>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="p-6 text-center text-neutral-400">
                                        No items in this order
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        {/* Order Summary */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-neutral-800 rounded-xl p-6"
                        >
                            <h2 className="text-lg font-semibold text-white mb-4">Order Summary</h2>
                            <div className="space-y-3">
                                <div className="flex justify-between text-neutral-300">
                                    <span>Subtotal</span>
                                    <span>{formatPrice(order?.subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-neutral-300">
                                    <span>Shipping</span>
                                    <span>{formatPrice(order?.shipping_cost)}</span>
                                </div>
                                {order?.tax > 0 && (
                                    <div className="flex justify-between text-neutral-300">
                                        <span>Tax</span>
                                        <span>{formatPrice(order?.tax)}</span>
                                    </div>
                                )}
                                {order?.discount > 0 && (
                                    <div className="flex justify-between text-green-400">
                                        <span>Discount</span>
                                        <span>-{formatPrice(order?.discount)}</span>
                                    </div>
                                )}
                                <div className="border-t border-neutral-700 pt-3 flex justify-between text-white font-semibold text-lg">
                                    <span>Total</span>
                                    <span>{formatPrice(order?.total)}</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Status Update */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-neutral-800 rounded-xl p-6"
                        >
                            <h2 className="text-lg font-semibold text-white mb-4">Update Status</h2>
                            <div className="space-y-3">
                                {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(status => (
                                    <button
                                        key={status}
                                        onClick={() => handleStatusChange(status)}
                                        disabled={updating || order?.status === status}
                                        className={`w-full px-4 py-2 rounded-lg capitalize transition-colors ${order?.status === status
                                                ? getStatusColor(status) + ' cursor-default'
                                                : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'
                                            } disabled:opacity-50`}
                                    >
                                        {status}
                                    </button>
                                ))}
                            </div>
                        </motion.div>

                        {/* Customer Info */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-neutral-800 rounded-xl p-6"
                        >
                            <h2 className="text-lg font-semibold text-white mb-4">Customer</h2>
                            <div className="space-y-2">
                                <p className="text-white font-medium">
                                    {shipping.name || shipping.first_name || 'Guest'}
                                </p>
                                {shipping.email && (
                                    <a href={`mailto:${shipping.email}`} className="text-primary-400 hover:text-primary-300 block">
                                        {shipping.email}
                                    </a>
                                )}
                                {shipping.phone && (
                                    <a href={`tel:${shipping.phone}`} className="text-neutral-400 block">
                                        {shipping.phone}
                                    </a>
                                )}
                            </div>
                        </motion.div>

                        {/* Shipping Address */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-neutral-800 rounded-xl p-6"
                        >
                            <h2 className="text-lg font-semibold text-white mb-4">Shipping Address</h2>
                            <div className="text-neutral-300 space-y-1">
                                <p>{shipping.address || shipping.street || 'N/A'}</p>
                                {shipping.address2 && <p>{shipping.address2}</p>}
                                <p>
                                    {[shipping.city, shipping.state, shipping.zip || shipping.postal_code]
                                        .filter(Boolean)
                                        .join(', ') || 'N/A'}
                                </p>
                                <p>{shipping.country || ''}</p>
                            </div>
                        </motion.div>

                        {/* Payment Info */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="bg-neutral-800 rounded-xl p-6"
                        >
                            <h2 className="text-lg font-semibold text-white mb-4">Payment</h2>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-neutral-400">Status</span>
                                    <span className={`capitalize font-medium ${getPaymentColor(order?.payment_status)}`}>
                                        {order?.payment_status || 'pending'}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-neutral-400">Method</span>
                                    <span className="text-white capitalize">
                                        {order?.payment_method || 'N/A'}
                                    </span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Order Info */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="bg-neutral-800 rounded-xl p-6"
                        >
                            <h2 className="text-lg font-semibold text-white mb-4">Order Info</h2>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-neutral-400">Created</span>
                                    <span className="text-white">{formatDate(order?.created_at)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-neutral-400">Updated</span>
                                    <span className="text-white">{formatDate(order?.updated_at)}</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminOrderDetail;
