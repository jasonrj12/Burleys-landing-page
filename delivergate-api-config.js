// Delivergate API Configuration
const DELIVERGATE_API = {
  baseURL: 'https://pos-dev.delivergate.com/api/v1/webshop',
  endpoints: {
    categories: '/categories/webshop-brand/1/shop/2',
    mainMenu: '/main-menu/{categoryId}/categories/webshop-brand/1/shop/2'
  },
  
  // Configuration
  config: {
    webshopBrand: 1,
    shop: 2,
    featuredCategoryId: 65, // Main featured category ID
    timeout: 10000, // 10 seconds timeout
    retryAttempts: 3
  },

  // Helper to build full URL
  getURL(endpoint, params = {}) {
    let url = this.baseURL + endpoint;
    Object.keys(params).forEach(key => {
      url = url.replace(`{${key}}`, params[key]);
    });
    return url;
  },

  // Fetch with timeout and retry logic
  async fetchWithRetry(url, options = {}, attempt = 1) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        }
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);

      if (attempt < this.config.retryAttempts) {
        console.log(`Retry attempt ${attempt} for ${url}`);
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt)); // Exponential backoff
        return this.fetchWithRetry(url, options, attempt + 1);
      }

      throw error;
    }
  },

  // Get all categories
  async getCategories() {
    const url = this.getURL(this.endpoints.categories);
    return this.fetchWithRetry(url);
  },

  // Get menu items for a specific category
  async getMenuItems(categoryId = this.config.featuredCategoryId) {
    const url = this.getURL(this.endpoints.mainMenu, { categoryId });
    return this.fetchWithRetry(url);
  }
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DELIVERGATE_API;
}

