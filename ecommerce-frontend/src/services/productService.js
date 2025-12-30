import api from './api';

/**
 * Product Service
 * Handles all product-related API calls
 */

const productService = {
    /**
     * Get paginated list of products with optional filters
     */
    async getProducts(params = {}) {
        const response = await api.get('/products', { params });
        return response.data;
    },

    /**
     * Get featured products
     */
    async getFeatured() {
        const response = await api.get('/products/featured');
        return response.data;
    },

    /**
     * Get a single product by slug
     */
    async getProduct(slug) {
        const response = await api.get(`/products/${slug}`);
        return response.data;
    },

    /**
     * Search products
     */
    async search(query, params = {}) {
        const response = await api.get('/products', {
            params: { search: query, ...params }
        });
        return response.data;
    },
};

export default productService;