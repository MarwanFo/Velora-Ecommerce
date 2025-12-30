import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import CartItem from '../components/cart/CartItem';
import Button from '../components/common/Button';
import PageTransition from '../components/common/PageTransition';

/**
 * Cart Page
 * Full cart view with items, totals, and checkout
 */
const Cart = () => {
    const { items, totalItems, totalPrice, clearCart } = useCart();

    return (
        <PageTransition>
            <div className="min-h-screen bg-neutral-50">
                {/* Header */}
                <div className="bg-white border-b border-neutral-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <h1 className="text-3xl md:text-4xl font-serif font-medium text-neutral-900">
                            Shopping Cart
                        </h1>
                        <p className="mt-2 text-neutral-600">
                            {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
                        </p>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {items.length === 0 ? (
                        /* Empty Cart */
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center py-16"
                        >
                            <svg className="w-24 h-24 text-neutral-300 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <h2 className="text-2xl font-serif font-medium text-neutral-900 mb-3">
                                Your cart is empty
                            </h2>
                            <p className="text-neutral-600 mb-8 max-w-md mx-auto">
                                Looks like you haven't added any handcrafted treasures to your cart yet.
                            </p>
                            <Link to="/products">
                                <Button variant="primary" size="lg">
                                    Continue Shopping
                                </Button>
                            </Link>
                        </motion.div>
                    ) : (
                        <div className="grid lg:grid-cols-3 gap-8">
                            {/* Cart Items */}
                            <div className="lg:col-span-2">
                                <div className="bg-white rounded-2xl p-6 shadow-sm">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-lg font-medium text-neutral-900">Items</h2>
                                        <button
                                            onClick={clearCart}
                                            className="text-sm text-neutral-500 hover:text-error transition-colors"
                                        >
                                            Clear All
                                        </button>
                                    </div>

                                    <AnimatePresence mode="popLayout">
                                        {items.map((item) => (
                                            <CartItem key={item.id} item={item} />
                                        ))}
                                    </AnimatePresence>
                                </div>

                                {/* Continue Shopping */}
                                <Link
                                    to="/products"
                                    className="inline-flex items-center gap-2 mt-6 text-primary-600 hover:text-primary-700 font-medium"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                    Continue Shopping
                                </Link>
                            </div>

                            {/* Order Summary */}
                            <div className="lg:col-span-1">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="bg-white rounded-2xl p-6 shadow-sm sticky top-24"
                                >
                                    <h2 className="text-lg font-medium text-neutral-900 mb-6">
                                        Order Summary
                                    </h2>

                                    <div className="space-y-3 mb-6">
                                        <div className="flex justify-between text-neutral-600">
                                            <span>Subtotal ({totalItems} items)</span>
                                            <span>${totalPrice.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-neutral-600">
                                            <span>Shipping</span>
                                            <span className="text-secondary-600">Free</span>
                                        </div>
                                        <div className="flex justify-between text-neutral-600">
                                            <span>Tax</span>
                                            <span>Calculated at checkout</span>
                                        </div>
                                    </div>

                                    <div className="border-t border-neutral-200 pt-4 mb-6">
                                        <div className="flex justify-between text-xl font-semibold text-neutral-900">
                                            <span>Total</span>
                                            <span>${totalPrice.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    <Link to="/checkout">
                                        <Button variant="primary" size="lg" fullWidth>
                                            Proceed to Checkout
                                        </Button>
                                    </Link>

                                    {/* Trust Badges */}
                                    <div className="mt-6 pt-6 border-t border-neutral-200">
                                        <div className="flex items-center gap-4 justify-center text-neutral-500">
                                            <div className="flex items-center gap-1">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                </svg>
                                                <span className="text-xs">Secure</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                                </svg>
                                                <span className="text-xs">Protected</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                </svg>
                                                <span className="text-xs">Easy Returns</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </PageTransition>
    );
};

export default Cart;
