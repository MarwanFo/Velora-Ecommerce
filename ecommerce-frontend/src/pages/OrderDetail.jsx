import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import orderService from '../services/orderService';
import DashboardLayout from '../components/layout/DashboardLayout';
import PageTransition from '../components/common/PageTransition';

/**
 * OrderDetail Page
 * Displays detailed information about a specific order
 */
const OrderDetail = () => {
    const { orderNumber } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await orderService.getOrder(orderNumber);
                setOrder(response.data);
            } catch (err) {
                setError('Order not found');
                console.error('Failed to fetch order:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [orderNumber]);

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

    if (loading) {
        return (
            <PageTransition>
                <DashboardLayout>
                    <div className="bg-white rounded-2xl shadow-sm p-8">
                        <div className="animate-pulse space-y-6">
                            <div className="h-8 bg-neutral-100 rounded w-1/3" />
                            <div className="h-4 bg-neutral-100 rounded w-1/4" />
                            <div className="h-32 bg-neutral-100 rounded" />
                        </div>
                    </div>
                </DashboardLayout>
            </PageTransition>
        );
    }

    if (error || !order) {
        return (
            <PageTransition>
                <DashboardLayout>
                    <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
                        <h2 className="text-xl font-medium text-neutral-900 mb-4">Order Not Found</h2>
                        <Link to="/dashboard/orders" className="text-primary-600 hover:text-primary-700">
                            ← Back to orders
                        </Link>
                    </div>
                </DashboardLayout>
            </PageTransition>
        );
    }

    return (
        <PageTransition>
            <DashboardLayout>
                <div className="space-y-6">
                    {/* Back Link */}
                    <Link
                        to="/dashboard/orders"
                        className="inline-flex items-center text-neutral-600 hover:text-neutral-900 transition-colors"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to orders
                    </Link>

                    {/* Order Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl shadow-sm p-6"
                    >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                            <div>
                                <h1 className="text-2xl font-serif font-medium text-neutral-900">
                                    Order {order.order_number}
                                </h1>
                                <p className="text-neutral-500 mt-1">
                                    Placed on {new Date(order.created_at).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                            </div>
                            <span className={`px-4 py-2 text-sm font-medium rounded-full ${getStatusColor(order.status)}`}>
                                {order.status_label}
                            </span>
                        </div>

                        {/* Order Progress */}
                        <div className="flex items-center justify-between mb-8">
                            {['pending', 'processing', 'shipped', 'delivered'].map((step, index) => {
                                const steps = ['pending', 'processing', 'shipped', 'delivered'];
                                const currentIndex = steps.indexOf(order.status);
                                const isCompleted = index <= currentIndex;
                                const isCurrent = index === currentIndex;

                                return (
                                    <div key={step} className="flex-1 flex items-center">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${isCompleted ? 'bg-secondary-600 text-white' : 'bg-neutral-200 text-neutral-500'
                                            } ${isCurrent ? 'ring-2 ring-secondary-200' : ''}`}>
                                            {isCompleted && index < currentIndex ? (
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            ) : (
                                                index + 1
                                            )}
                                        </div>
                                        {index < 3 && (
                                            <div className={`flex-1 h-1 mx-2 ${index < currentIndex ? 'bg-secondary-600' : 'bg-neutral-200'
                                                }`} />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                        <div className="flex justify-between text-xs text-neutral-500">
                            <span>Pending</span>
                            <span>Processing</span>
                            <span>Shipped</span>
                            <span>Delivered</span>
                        </div>
                    </motion.div>

                    <div className="grid lg:grid-cols-3 gap-6">
                        {/* Order Items */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6"
                        >
                            <h2 className="text-lg font-medium text-neutral-900 mb-4">Order Items</h2>
                            <div className="divide-y divide-neutral-100">
                                {order.items?.map((item) => (
                                    <div key={item.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                                        <div className="w-16 h-16 bg-neutral-100 rounded-lg overflow-hidden flex-shrink-0">
                                            <img
                                                src={item.product_image || 'https://placehold.co/64x64/f5f4f1/a8a39a?text=No+Image'}
                                                alt={item.product_name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-medium text-neutral-900 truncate">{item.product_name}</h3>
                                            <p className="text-sm text-neutral-500">Qty: {item.quantity}</p>
                                            <p className="text-sm text-neutral-500">${item.price?.toFixed(2)} each</p>
                                        </div>
                                        <p className="font-medium text-neutral-900">
                                            ${item.subtotal?.toFixed(2)}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {/* Totals */}
                            <div className="border-t border-neutral-200 mt-4 pt-4 space-y-2">
                                <div className="flex justify-between text-neutral-600">
                                    <span>Subtotal</span>
                                    <span>${order.totals?.subtotal?.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-neutral-600">
                                    <span>Shipping</span>
                                    <span>{order.totals?.shipping === 0 ? 'Free' : `$${order.totals?.shipping?.toFixed(2)}`}</span>
                                </div>
                                {order.totals?.tax > 0 && (
                                    <div className="flex justify-between text-neutral-600">
                                        <span>Tax</span>
                                        <span>${order.totals?.tax?.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-lg font-semibold text-neutral-900 pt-2 border-t border-neutral-100">
                                    <span>Total</span>
                                    <span>${order.totals?.total?.toFixed(2)}</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Shipping Info */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-2xl shadow-sm p-6"
                        >
                            <h2 className="text-lg font-medium text-neutral-900 mb-4">Shipping Address</h2>
                            <div className="text-neutral-600">
                                <p className="font-medium text-neutral-900">{order.shipping?.name}</p>
                                <p>{order.shipping?.address}</p>
                                {order.shipping?.address_2 && <p>{order.shipping?.address_2}</p>}
                                <p>{order.shipping?.city}, {order.shipping?.state} {order.shipping?.zip}</p>
                                <p>{order.shipping?.country}</p>
                                {order.shipping?.phone && (
                                    <p className="mt-2">{order.shipping?.phone}</p>
                                )}
                                <p className="mt-2">{order.shipping?.email}</p>
                            </div>

                            {order.notes && (
                                <div className="mt-6 pt-6 border-t border-neutral-200">
                                    <h3 className="font-medium text-neutral-900 mb-2">Order Notes</h3>
                                    <p className="text-neutral-600 text-sm">{order.notes}</p>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </DashboardLayout>
        </PageTransition>
    );
};

export default OrderDetail;
