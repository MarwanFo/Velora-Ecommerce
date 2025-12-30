import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

/**
 * Cart Context
 * Provides shopping cart state management with localStorage persistence
 */
const CartContext = createContext(null);

const CART_STORAGE_KEY = 'velora_cart';

export const CartProvider = ({ children }) => {
    // Load cart from localStorage or start empty
    const [items, setItems] = useState(() => {
        try {
            const stored = localStorage.getItem(CART_STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    });

    const [isOpen, setIsOpen] = useState(false);

    // Persist cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }, [items]);

    /**
     * Add item to cart
     * If item already exists, increase quantity
     */
    const addItem = useCallback((product, quantity = 1) => {
        setItems(currentItems => {
            const existingIndex = currentItems.findIndex(
                item => item.id === product.id
            );

            if (existingIndex > -1) {
                // Item exists, update quantity
                const updated = [...currentItems];
                updated[existingIndex] = {
                    ...updated[existingIndex],
                    quantity: updated[existingIndex].quantity + quantity,
                };
                return updated;
            }

            // New item
            return [...currentItems, {
                id: product.id,
                slug: product.slug,
                name: product.name,
                price: product.current_price || product.price,
                originalPrice: product.price,
                image: product.primary_image?.url || product.images?.[0]?.url,
                quantity,
            }];
        });

        // Open cart sidebar when adding
        setIsOpen(true);
    }, []);

    /**
     * Remove item from cart completely
     */
    const removeItem = useCallback((productId) => {
        setItems(currentItems =>
            currentItems.filter(item => item.id !== productId)
        );
    }, []);

    /**
     * Update item quantity
     */
    const updateQuantity = useCallback((productId, quantity) => {
        if (quantity <= 0) {
            removeItem(productId);
            return;
        }

        setItems(currentItems =>
            currentItems.map(item =>
                item.id === productId
                    ? { ...item, quantity }
                    : item
            )
        );
    }, [removeItem]);

    /**
     * Clear entire cart
     */
    const clearCart = useCallback(() => {
        setItems([]);
    }, []);

    /**
     * Open cart sidebar
     */
    const openCart = useCallback(() => {
        setIsOpen(true);
    }, []);

    /**
     * Close cart sidebar
     */
    const closeCart = useCallback(() => {
        setIsOpen(false);
    }, []);

    /**
     * Toggle cart sidebar
     */
    const toggleCart = useCallback(() => {
        setIsOpen(prev => !prev);
    }, []);

    // Computed values
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const value = {
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isOpen,
        openCart,
        closeCart,
        toggleCart,
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

CartProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

/**
 * Hook to access cart context
 */
export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export default CartContext;
