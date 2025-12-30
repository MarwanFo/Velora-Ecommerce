import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import orderService from '../services/orderService';
import PageTransition from '../components/common/PageTransition';
import Button from '../components/common/Button';

/**
 * Checkout Page
 * Multi-step checkout with shipping form and order summary
 */
const Checkout = () => {
    const navigate = useNavigate();
    const { items, totalPrice, clearCart } = useCart();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [step, setStep] = useState(1);

    const [formData, setFormData] = useState({
        shipping: {
            first_name: '',
            last_name: '',
            email: '',
            phone: '',
            address: '',
            address_2: '',
            city: '',
            state: '',
            zip: '',
            country: 'US',
        },
        billing_same_as_shipping: true,
        notes: '',
    });

    const handleChange = (section, field, value) => {
        setFormData(prev => ({
            ...prev,
            [section]: typeof prev[section] === 'object'
                ? { ...prev[section], [field]: value }
                : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const orderData = {
                items: items.map(item => ({
                    id: item.id,
                    quantity: item.quantity,
                })),
                shipping: formData.shipping,
                billing_same_as_shipping: formData.billing_same_as_shipping,
                notes: formData.notes,
            };

            const response = await orderService.checkout(orderData);
            clearCart();
            navigate(`/order-confirmation/${response.data.order_number}`);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to place order. Please try again.');
            console.error('Checkout error:', err);
        } finally {
            setLoading(false);
        }
    };

    // Redirect if cart is empty
    if (items.length === 0) {
        return (
            <PageTransition>
                <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
                    <div className="text-center">
                        <svg className="w-20 h-20 text-neutral-300 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <h2 className="text-2xl font-serif font-medium text-neutral-900 mb-4">
                            Your cart is empty
                        </h2>
                        <p className="text-neutral-600 mb-6">
                            Add some items to your cart before checking out.
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
            <div className="min-h-screen bg-neutral-50">
                {/* Header */}
                <div className="bg-white border-b border-neutral-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <h1 className="text-3xl md:text-4xl font-serif font-medium text-neutral-900">
                            Checkout
                        </h1>

                        {/* Progress Steps */}
                        <div className="flex items-center gap-4 mt-6">
                            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-primary-600' : 'text-neutral-400'}`}>
                                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= 1 ? 'bg-primary-600 text-white' : 'bg-neutral-200'}`}>1</span>
                                <span className="hidden sm:inline font-medium">Shipping</span>
                            </div>
                            <div className="flex-1 h-0.5 bg-neutral-200">
                                <div className={`h-full bg-primary-600 transition-all ${step >= 2 ? 'w-full' : 'w-0'}`} />
                            </div>
                            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-primary-600' : 'text-neutral-400'}`}>
                                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= 2 ? 'bg-primary-600 text-white' : 'bg-neutral-200'}`}>2</span>
                                <span className="hidden sm:inline font-medium">Review</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <form onSubmit={handleSubmit}>
                        <div className="grid lg:grid-cols-3 gap-8">
                            {/* Main Form */}
                            <div className="lg:col-span-2 space-y-8">
                                {/* Error Message */}
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-4 bg-error/10 border border-error/20 rounded-xl text-error"
                                    >
                                        {error}
                                    </motion.div>
                                )}

                                {/* Shipping Address */}
                                {step === 1 && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="bg-white rounded-2xl p-6 shadow-sm"
                                    >
                                        <h2 className="text-lg font-medium text-neutral-900 mb-6">
                                            Shipping Address
                                        </h2>

                                        <div className="grid sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-neutral-700 mb-2">
                                                    First Name *
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={formData.shipping.first_name}
                                                    onChange={(e) => handleChange('shipping', 'first_name', e.target.value)}
                                                    className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-neutral-700 mb-2">
                                                    Last Name *
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={formData.shipping.last_name}
                                                    onChange={(e) => handleChange('shipping', 'last_name', e.target.value)}
                                                    className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-neutral-700 mb-2">
                                                    Email *
                                                </label>
                                                <input
                                                    type="email"
                                                    required
                                                    value={formData.shipping.email}
                                                    onChange={(e) => handleChange('shipping', 'email', e.target.value)}
                                                    className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-neutral-700 mb-2">
                                                    Phone
                                                </label>
                                                <input
                                                    type="tel"
                                                    value={formData.shipping.phone}
                                                    onChange={(e) => handleChange('shipping', 'phone', e.target.value)}
                                                    className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                                                />
                                            </div>
                                            <div className="sm:col-span-2">
                                                <label className="block text-sm font-medium text-neutral-700 mb-2">
                                                    Address *
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={formData.shipping.address}
                                                    onChange={(e) => handleChange('shipping', 'address', e.target.value)}
                                                    className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                                                />
                                            </div>
                                            <div className="sm:col-span-2">
                                                <label className="block text-sm font-medium text-neutral-700 mb-2">
                                                    Apartment, suite, etc.
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.shipping.address_2}
                                                    onChange={(e) => handleChange('shipping', 'address_2', e.target.value)}
                                                    className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-neutral-700 mb-2">
                                                    City *
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={formData.shipping.city}
                                                    onChange={(e) => handleChange('shipping', 'city', e.target.value)}
                                                    className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-neutral-700 mb-2">
                                                    State/Province *
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={formData.shipping.state}
                                                    onChange={(e) => handleChange('shipping', 'state', e.target.value)}
                                                    className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-neutral-700 mb-2">
                                                    ZIP/Postal Code *
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={formData.shipping.zip}
                                                    onChange={(e) => handleChange('shipping', 'zip', e.target.value)}
                                                    className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-neutral-700 mb-2">
                                                    Country *
                                                </label>
                                                <select
                                                    required
                                                    value={formData.shipping.country}
                                                    onChange={(e) => handleChange('shipping', 'country', e.target.value)}
                                                    className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                                                >
                                                    <option value="US">United States</option>
                                                    <option value="CA">Canada</option>
                                                    <option value="GB">United Kingdom</option>
                                                    <option value="AU">Australia</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="mt-6">
                                            <Button
                                                type="button"
                                                variant="primary"
                                                size="lg"
                                                onClick={() => setStep(2)}
                                            >
                                                Continue to Review
                                            </Button>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Order Review */}
                                {step === 2 && (
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="bg-white rounded-2xl p-6 shadow-sm"
                                    >
                                        <h2 className="text-lg font-medium text-neutral-900 mb-6">
                                            Review Your Order
                                        </h2>

                                        {/* Shipping Summary */}
                                        <div className="mb-6 pb-6 border-b border-neutral-200">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-medium text-neutral-900">Shipping to:</h3>
                                                    <p className="text-neutral-600 mt-1">
                                                        {formData.shipping.first_name} {formData.shipping.last_name}<br />
                                                        {formData.shipping.address}<br />
                                                        {formData.shipping.address_2 && <>{formData.shipping.address_2}<br /></>}
                                                        {formData.shipping.city}, {formData.shipping.state} {formData.shipping.zip}<br />
                                                        {formData.shipping.country}
                                                    </p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => setStep(1)}
                                                    className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                                                >
                                                    Edit
                                                </button>
                                            </div>
                                        </div>

                                        {/* Order Items */}
                                        <div className="space-y-4">
                                            {items.map((item) => (
                                                <div key={item.id} className="flex gap-4">
                                                    <div className="w-16 h-16 bg-neutral-100 rounded-lg overflow-hidden">
                                                        <img
                                                            src={item.image || 'https://placehold.co/64x64/f5f4f1/a8a39a?text=No+Image'}
                                                            alt={item.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="font-medium text-neutral-900">{item.name}</h4>
                                                        <p className="text-sm text-neutral-600">Qty: {item.quantity}</p>
                                                    </div>
                                                    <p className="font-medium text-neutral-900">
                                                        ${(item.price * item.quantity).toFixed(2)}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Order Notes */}
                                        <div className="mt-6">
                                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                                                Order Notes (optional)
                                            </label>
                                            <textarea
                                                value={formData.notes}
                                                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                                                rows={3}
                                                className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                                                placeholder="Any special instructions..."
                                            />
                                        </div>

                                        <div className="mt-6 flex gap-4">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => setStep(1)}
                                            >
                                                Back
                                            </Button>
                                            <Button
                                                type="submit"
                                                variant="primary"
                                                size="lg"
                                                disabled={loading}
                                                className="flex-1"
                                            >
                                                {loading ? 'Processing...' : 'Place Order'}
                                            </Button>
                                        </div>
                                    </motion.div>
                                )}
                            </div>

                            {/* Order Summary Sidebar */}
                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
                                    <h2 className="text-lg font-medium text-neutral-900 mb-6">
                                        Order Summary
                                    </h2>

                                    <div className="space-y-4 mb-6">
                                        {items.map((item) => (
                                            <div key={item.id} className="flex justify-between text-sm">
                                                <span className="text-neutral-600">
                                                    {item.name} × {item.quantity}
                                                </span>
                                                <span className="font-medium">
                                                    ${(item.price * item.quantity).toFixed(2)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="border-t border-neutral-200 pt-4 space-y-2">
                                        <div className="flex justify-between text-neutral-600">
                                            <span>Subtotal</span>
                                            <span>${totalPrice.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-neutral-600">
                                            <span>Shipping</span>
                                            <span className="text-secondary-600">Free</span>
                                        </div>
                                        <div className="flex justify-between text-neutral-600">
                                            <span>Tax</span>
                                            <span>$0.00</span>
                                        </div>
                                    </div>

                                    <div className="border-t border-neutral-200 pt-4 mt-4">
                                        <div className="flex justify-between text-xl font-semibold text-neutral-900">
                                            <span>Total</span>
                                            <span>${totalPrice.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    {/* Trust Badges */}
                                    <div className="mt-6 pt-6 border-t border-neutral-200">
                                        <div className="flex flex-col gap-3 text-sm text-neutral-500">
                                            <div className="flex items-center gap-2">
                                                <svg className="w-5 h-5 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                </svg>
                                                <span>Secure checkout</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <svg className="w-5 h-5 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                                </svg>
                                                <span>Free shipping on all orders</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <svg className="w-5 h-5 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                </svg>
                                                <span>30-day easy returns</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </PageTransition>
    );
};

export default Checkout;
