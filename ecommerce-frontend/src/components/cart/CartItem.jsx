import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { useCart } from '../../context/CartContext';

/**
 * CartItem Component
 * Individual item row in cart sidebar/page
 */
const CartItem = ({ item, compact = false }) => {
    const { updateQuantity, removeItem } = useCart();
    const { id, slug, name, price, image, quantity } = item;

    const handleQuantityChange = (newQuantity) => {
        if (newQuantity >= 1) {
            updateQuantity(id, newQuantity);
        }
    };

    if (compact) {
        // Compact view for sidebar
        return (
            <motion.div
                layout
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex gap-4 py-4 border-b border-neutral-100 last:border-0"
            >
                {/* Image */}
                <Link to={`/products/${slug}`} className="flex-shrink-0">
                    <div className="w-20 h-20 bg-neutral-100 rounded-xl overflow-hidden">
                        <img
                            src={image || 'https://placehold.co/80x80/f5f4f1/a8a39a?text=No+Image'}
                            alt={name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </Link>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <Link to={`/products/${slug}`}>
                        <h4 className="text-sm font-medium text-neutral-900 truncate hover:text-primary-600">
                            {name}
                        </h4>
                    </Link>
                    <p className="text-sm text-neutral-600 mt-1">${price?.toFixed(2)}</p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 mt-2">
                        <button
                            onClick={() => handleQuantityChange(quantity - 1)}
                            className="w-6 h-6 flex items-center justify-center rounded bg-neutral-100 hover:bg-neutral-200 text-neutral-600"
                        >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                        </button>
                        <span className="text-sm font-medium w-6 text-center">{quantity}</span>
                        <button
                            onClick={() => handleQuantityChange(quantity + 1)}
                            className="w-6 h-6 flex items-center justify-center rounded bg-neutral-100 hover:bg-neutral-200 text-neutral-600"
                        >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Remove Button */}
                <button
                    onClick={() => removeItem(id)}
                    className="self-start p-1 text-neutral-400 hover:text-error transition-colors"
                    aria-label="Remove item"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </motion.div>
        );
    }

    // Full view for cart page
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex gap-6 py-6 border-b border-neutral-200 last:border-0"
        >
            {/* Image */}
            <Link to={`/products/${slug}`} className="flex-shrink-0">
                <div className="w-28 h-28 bg-neutral-100 rounded-xl overflow-hidden">
                    <img
                        src={image || 'https://placehold.co/112x112/f5f4f1/a8a39a?text=No+Image'}
                        alt={name}
                        className="w-full h-full object-cover"
                    />
                </div>
            </Link>

            {/* Info */}
            <div className="flex-1">
                <Link to={`/products/${slug}`}>
                    <h3 className="text-lg font-medium text-neutral-900 hover:text-primary-600">
                        {name}
                    </h3>
                </Link>
                <p className="text-neutral-600 mt-1">${price?.toFixed(2)} each</p>

                {/* Quantity Controls */}
                <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center border border-neutral-200 rounded-lg">
                        <button
                            onClick={() => handleQuantityChange(quantity - 1)}
                            className="w-10 h-10 flex items-center justify-center hover:bg-neutral-50 text-neutral-600"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                        </button>
                        <span className="w-12 text-center font-medium">{quantity}</span>
                        <button
                            onClick={() => handleQuantityChange(quantity + 1)}
                            className="w-10 h-10 flex items-center justify-center hover:bg-neutral-50 text-neutral-600"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </button>
                    </div>

                    <button
                        onClick={() => removeItem(id)}
                        className="text-sm text-neutral-500 hover:text-error transition-colors"
                    >
                        Remove
                    </button>
                </div>
            </div>

            {/* Subtotal */}
            <div className="text-right">
                <p className="text-lg font-semibold text-neutral-900">
                    ${(price * quantity).toFixed(2)}
                </p>
            </div>
        </motion.div>
    );
};

CartItem.propTypes = {
    item: PropTypes.shape({
        id: PropTypes.number.isRequired,
        slug: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
        image: PropTypes.string,
        quantity: PropTypes.number.isRequired,
    }).isRequired,
    compact: PropTypes.bool,
};

export default CartItem;
