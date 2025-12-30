import api from './api';

/**
 * Category Service
 * Handles all category-related API calls
 */

const categoryService = {
    /**
     * Get all categories (nested tree structure)
     */
    async getCategories() {
        const response = await api.get('/categories');
        return response.data;
    },

    /**
     * Get a single category by slug
     */
    async getCategory(slug) {
        const response = await api.get(`/categories/${slug}`);
        return response.data;
    },
};

export default categoryService;
