import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import CartItem from './CartItem';
import Button from '../common/Button';

/**
 * CartSidebar Component
 * Slide-out cart panel from the right side
 */
const CartSidebar = () => {
    const { items, totalItems, totalPrice, isOpen, closeCart, clearCart } = useCart();

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-40"
                        onClick={closeCart}
                    />

                    {/* Sidebar */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="fixed inset-y-0 right-0 w-full max-w-md bg-white z-50 flex flex-col shadow-2xl"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
                            <h2 className="text-lg font-medium text-neutral-900">
                                Your Cart ({totalItems})
                            </h2>
                            <button
                                onClick={closeCart}
                                className="p-2 text-neutral-500 hover:text-neutral-700 transition-colors"
                                aria-label="Close cart"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Items */}
                        <div className="flex-1 overflow-y-auto px-6">
                            {items.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                                    <svg className="w-16 h-16 text-neutral-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    <h3 className="text-lg font-medium text-neutral-900 mb-2">Your cart is empty</h3>
                                    <p className="text-neutral-600 mb-6">Looks like you haven't added anything yet</p>
                                    <Button onClick={closeCart} variant="primary">
                                        Start Shopping
                                    </Button>
                                </div>
                            ) : (
                                <AnimatePresence mode="popLayout">
                                    {items.map((item) => (
                                        <CartItem key={item.id} item={item} compact />
                                    ))}
                                </AnimatePresence>
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="border-t border-neutral-200 px-6 py-6 space-y-4">
                                {/* Totals */}
                                <div className="space-y-2">
                                    <div className="flex justify-between text-neutral-600">
                                        <span>Subtotal</span>
                                        <span>${totalPrice.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-neutral-600">
                                        <span>Shipping</span>
                                        <span className="text-secondary-600">Free</span>
                                    </div>
                                    <div className="flex justify-between text-lg font-semibold text-neutral-900 pt-2 border-t border-neutral-100">
                                        <span>Total</span>
                                        <span>${totalPrice.toFixed(2)}</span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="space-y-3">
                                    <Link to="/checkout" onClick={closeCart}>
                                        <Button variant="primary" size="lg" fullWidth>
                                            Checkout
                                        </Button>
                                    </Link>
                                    <Link to="/cart" onClick={closeCart}>
                                        <Button variant="outline" size="lg" fullWidth>
                                            View Cart
                                        </Button>
                                    </Link>
                                </div>

                                {/* Clear Cart */}
                                <button
                                    onClick={clearCart}
                                    className="w-full text-center text-sm text-neutral-500 hover:text-error transition-colors"
                                >
                                    Clear Cart
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CartSidebar;
