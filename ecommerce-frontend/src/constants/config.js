/**
 * Application Configuration Constants
 */

export const APP_CONFIG = {
    name: 'Velora',
    tagline: 'Handcrafted goods, curated with care',
    currency: 'USD',
    currencySymbol: '$',
    locale: 'en-US',
};

export const API_ENDPOINTS = {
    // Auth
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    user: '/auth/user',

    // Products
    products: '/products',
    product: (slug) => `/products/${slug}`,
    categories: '/categories',

    // Cart
    cart: '/cart',
    cartItems: '/cart/items',
    cartItem: (id) => `/cart/items/${id}`,
    applyCoupon: '/cart/apply-coupon',

    // Checkout
    checkout: '/checkout',

    // Orders
    orders: '/orders',
    order: (id) => `/orders/${id}`,

    // User
    profile: '/user/profile',
    addresses: '/user/addresses',
    wishlist: '/user/wishlist',
};

export const ROUTES = {
    // Public
    home: '/',
    products: '/products',
    product: (slug) => `/products/${slug}`,
    cart: '/cart',
    checkout: '/checkout',

    // Auth
    login: '/login',
    register: '/register',
    forgotPassword: '/forgot-password',

    // Account
    account: '/account',
    orders: '/account/orders',
    orderDetail: (id) => `/account/orders/${id}`,
    wishlist: '/account/wishlist',
    addresses: '/account/addresses',

    // Admin
    adminDashboard: '/admin',
    adminProducts: '/admin/products',
    adminOrders: '/admin/orders',
    adminCustomers: '/admin/customers',
};

export const PAGINATION = {
    defaultPerPage: 12,
    options: [12, 24, 48],
};

export const PRODUCT_BADGES = {
    new: { label: 'New', color: 'primary' },
    sale: { label: 'Sale', color: 'error' },
    featured: { label: 'Featured', color: 'accent' },
    lowStock: { label: 'Low Stock', color: 'warning' },
    soldOut: { label: 'Sold Out', color: 'neutral' },
};
