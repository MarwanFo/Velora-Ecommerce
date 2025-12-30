import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import orderService from '../services/orderService';
import PageTransition from '../components/common/PageTransition';
import Button from '../components/common/Button';

/**
 * OrderConfirmation Page
 * Success page after placing an order
 */
const OrderConfirmation = () => {
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

    if (loading) {
        return (
            <PageTransition>
                <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-neutral-600">Loading order details...</p>
                    </div>
                </div>
            </PageTransition>
        );
    }

    if (error || !order) {
        return (
            <PageTransition>
                <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
                    <div className="text-center">
                        <h2 className="text-2xl font-serif font-medium text-neutral-900 mb-4">
                            Order Not Found
                        </h2>
                        <p className="text-neutral-600 mb-6">
                            We couldn't find the order you're looking for.
                        </p>
                        <Link to="/products">
                            <Button variant="primary">Continue Shopping</Button>
                        </Link>
                    </div>
                </div>
            </PageTransition>
        );
    }

    return (
        <PageTransition>
            <div className="min-h-screen bg-neutral-50 py-12">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Success Header */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center mb-12"
                    >
                        <div className="w-20 h-20 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-serif font-medium text-neutral-900 mb-4">
                            Thank You for Your Order!
                        </h1>
                        <p className="text-lg text-neutral-600">
                            Your order has been placed successfully.
                        </p>
                    </motion.div>

                    {/* Order Details Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-2xl p-8 shadow-sm"
                    >
                        {/* Order Number */}
                        <div className="text-center pb-6 border-b border-neutral-200 mb-6">
                            <p className="text-sm text-neutral-500 mb-1">Order Number</p>
                            <p className="text-2xl font-mono font-bold text-neutral-900">
                                {order.order_number}
                            </p>
                        </div>

                        {/* Order Info Grid */}
                        <div className="grid md:grid-cols-2 gap-6 mb-8">
                            {/* Shipping Address */}
                            <div>
                                <h3 className="font-medium text-neutral-900 mb-2">Shipping Address</h3>
                                <p className="text-neutral-600">
                                    {order.shipping.name}<br />
                                    {order.shipping.address}<br />
                                    {order.shipping.address_2 && <>{order.shipping.address_2}<br /></>}
                                    {order.shipping.city}, {order.shipping.state} {order.shipping.zip}<br />
                                    {order.shipping.country}
                                </p>
                            </div>

                            {/* Contact Info */}
                            <div>
                                <h3 className="font-medium text-neutral-900 mb-2">Contact Information</h3>
                                <p className="text-neutral-600">
                                    {order.shipping.email}<br />
                                    {order.shipping.phone && <>{order.shipping.phone}</>}
                                </p>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="mb-8">
                            <h3 className="font-medium text-neutral-900 mb-4">Order Items</h3>
                            <div className="space-y-4">
                                {order.items?.map((item) => (
                                    <div key={item.id} className="flex gap-4 py-3 border-b border-neutral-100 last:border-0">
                                        <div className="w-16 h-16 bg-neutral-100 rounded-lg overflow-hidden">
                                            <img
                                                src={item.product_image || 'https://placehold.co/64x64/f5f4f1/a8a39a?text=No+Image'}
                                                alt={item.product_name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-medium text-neutral-900">{item.product_name}</h4>
                                            <p className="text-sm text-neutral-500">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="font-medium text-neutral-900">
                                            ${item.subtotal?.toFixed(2)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Order Totals */}
                        <div className="border-t border-neutral-200 pt-6">
                            <div className="space-y-2 mb-4">
                                <div className="flex justify-between text-neutral-600">
                                    <span>Subtotal</span>
                                    <span>${order.totals.subtotal?.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-neutral-600">
                                    <span>Shipping</span>
                                    <span>{order.totals.shipping === 0 ? 'Free' : `$${order.totals.shipping?.toFixed(2)}`}</span>
                                </div>
                                {order.totals.tax > 0 && (
                                    <div className="flex justify-between text-neutral-600">
                                        <span>Tax</span>
                                        <span>${order.totals.tax?.toFixed(2)}</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex justify-between text-xl font-semibold text-neutral-900 pt-4 border-t border-neutral-200">
                                <span>Total</span>
                                <span>${order.totals.total?.toFixed(2)}</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Actions */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
                    >
                        <Link to="/products">
                            <Button variant="primary" size="lg">
                                Continue Shopping
                            </Button>
                        </Link>
                    </motion.div>

                    {/* Email Notice */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="text-center text-neutral-500 mt-8"
                    >
                        A confirmation email has been sent to <strong>{order.shipping.email}</strong>
                    </motion.p>
                </div>
            </div>
        </PageTransition>
    );
};

export default OrderConfirmation;
