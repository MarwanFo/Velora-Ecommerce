import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import orderService from '../services/orderService';
import DashboardLayout from '../components/layout/DashboardLayout';
import PageTransition from '../components/common/PageTransition';

/**
 * Orders Page - User order history
 */
const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await orderService.getOrders();
                setOrders(response.data || []);
            } catch (err) {
                setError('Failed to load orders');
                console.error('Failed to fetch orders:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800',
            processing: 'bg-blue-100 text-blue-800',
            shipped: 'bg-purple-100 text-purple-800',
            delivered: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800',
        };
        return colors[status] || 'bg-neutral-100 text-neutral-800';
    };

    return (
        <PageTransition>
            <DashboardLayout>
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    <div className="px-6 py-5 border-b border-neutral-200">
                        <h1 className="text-2xl font-serif font-medium text-neutral-900">Order History</h1>
                        <p className="text-neutral-500 mt-1">View and track your orders</p>
                    </div>

                    <div className="p-6">
                        {loading ? (
                            <div className="space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="animate-pulse">
                                        <div className="h-24 bg-neutral-100 rounded-xl" />
                                    </div>
                                ))}
                            </div>
                        ) : error ? (
                            <div className="text-center py-12">
                                <p className="text-error">{error}</p>
                            </div>
                        ) : orders.length === 0 ? (
                            <div className="text-center py-12">
                                <svg className="w-16 h-16 text-neutral-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                                <h3 className="text-lg font-medium text-neutral-900 mb-2">No orders yet</h3>
                                <p className="text-neutral-500 mb-6">Start shopping to see your orders here.</p>
                                <Link to="/products" className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors">
                                    Browse Products
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {orders.map((order, index) => (
                                    <motion.div key={order.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                                        <Link to={`/dashboard/orders/${order.order_number}`} className="block p-5 border border-neutral-200 rounded-xl hover:border-primary-300 hover:shadow-md transition-all duration-200">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                <div>
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <span className="font-mono font-medium text-neutral-900">{order.order_number}</span>
                                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>{order.status_label}</span>
                                                    </div>
                                                    <p className="text-sm text-neutral-500">
                                                        {new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                                        <span className="mx-2">•</span>
                                                        {order.item_count} item{order.item_count !== 1 ? 's' : ''}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <span className="text-lg font-semibold text-neutral-900">${order.totals?.total?.toFixed(2)}</span>
                                                    <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </DashboardLayout>
        </PageTransition>
    );
};

export default Orders;
