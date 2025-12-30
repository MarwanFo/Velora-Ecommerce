import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

/**
 * ProductCard Component
 * Displays a product in a card format for grid/list views
 */
const ProductCard = ({ product, view = 'grid' }) => {
    const {
        slug,
        name,
        price,
        sale_price,
        current_price,
        is_on_sale,
        discount_percent,
        is_in_stock,
        brand,
        primary_image,
        category,
    } = product;

    // Placeholder image if no product image
    const imageUrl = primary_image?.url || 'https://placehold.co/400x400/f5f4f1/a8a39a?text=No+Image';

    if (view === 'list') {
        return (
            <motion.article
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="group flex gap-6 bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow"
            >
                {/* Image */}
                <Link to={`/products/${slug}`} className="flex-shrink-0 w-48 h-48">
                    <div className="relative w-full h-full rounded-xl overflow-hidden bg-neutral-100">
                        <img
                            src={imageUrl}
                            alt={name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {is_on_sale && (
                            <span className="absolute top-2 left-2 px-2 py-1 bg-error text-white text-xs font-medium rounded-full">
                                -{discount_percent}%
                            </span>
                        )}
                    </div>
                </Link>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-between py-2">
                    <div>
                        {category && (
                            <span className="text-xs text-primary-600 font-medium uppercase tracking-wide">
                                {category.name}
                            </span>
                        )}
                        <Link to={`/products/${slug}`}>
                            <h3 className="text-lg font-medium text-neutral-900 hover:text-primary-600 transition-colors mt-1">
                                {name}
                            </h3>
                        </Link>
                        {brand && (
                            <p className="text-sm text-neutral-500 mt-1">by {brand}</p>
                        )}
                    </div>

                    <div className="flex items-center justify-between mt-4">
                        <div className="flex items-baseline gap-2">
                            <span className="text-xl font-semibold text-neutral-900">
                                ${current_price?.toFixed(2)}
                            </span>
                            {is_on_sale && (
                                <span className="text-sm text-neutral-400 line-through">
                                    ${price?.toFixed(2)}
                                </span>
                            )}
                        </div>

                        {!is_in_stock && (
                            <span className="text-sm text-error font-medium">Out of Stock</span>
                        )}
                    </div>
                </div>
            </motion.article>
        );
    }

    // Grid view (default)
    return (
        <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group"
        >
            {/* Image Container */}
            <Link to={`/products/${slug}`} className="block relative aspect-square rounded-2xl overflow-hidden bg-neutral-100 mb-4">
                <img
                    src={imageUrl}
                    alt={name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Sale Badge */}
                {is_on_sale && (
                    <span className="absolute top-3 left-3 px-3 py-1 bg-error text-white text-xs font-medium rounded-full">
                        -{discount_percent}%
                    </span>
                )}

                {/* Quick Actions (on hover) */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                        className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-primary-600 hover:text-white transition-colors"
                        aria-label="Add to wishlist"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </button>
                    <button
                        className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-primary-600 hover:text-white transition-colors"
                        aria-label="Quick view"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                    </button>
                </div>

                {/* Out of Stock Overlay */}
                {!is_in_stock && (
                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                        <span className="px-4 py-2 bg-neutral-900 text-white text-sm font-medium rounded-full">
                            Out of Stock
                        </span>
                    </div>
                )}
            </Link>

            {/* Product Info */}
            <div className="space-y-2">
                {category && (
                    <span className="text-xs text-primary-600 font-medium uppercase tracking-wide">
                        {category.name}
                    </span>
                )}

                <Link to={`/products/${slug}`}>
                    <h3 className="font-medium text-neutral-900 hover:text-primary-600 transition-colors line-clamp-2">
                        {name}
                    </h3>
                </Link>

                {brand && (
                    <p className="text-sm text-neutral-500">by {brand}</p>
                )}

                <div className="flex items-baseline gap-2 pt-1">
                    <span className="text-lg font-semibold text-neutral-900">
                        ${current_price?.toFixed(2)}
                    </span>
                    {is_on_sale && (
                        <span className="text-sm text-neutral-400 line-through">
                            ${price?.toFixed(2)}
                        </span>
                    )}
                </div>
            </div>
        </motion.article>
    );
};

ProductCard.propTypes = {
    product: PropTypes.shape({
        slug: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        price: PropTypes.number,
        sale_price: PropTypes.number,
        current_price: PropTypes.number,
        is_on_sale: PropTypes.bool,
        discount_percent: PropTypes.number,
        is_in_stock: PropTypes.bool,
        brand: PropTypes.string,
        primary_image: PropTypes.shape({
            url: PropTypes.string,
        }),
        category: PropTypes.shape({
            name: PropTypes.string,
        }),
    }).isRequired,
    view: PropTypes.oneOf(['grid', 'list']),
};

export default ProductCard;
