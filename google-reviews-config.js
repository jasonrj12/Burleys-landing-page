// Google Reviews API Configuration
// Get your API key from: https://console.cloud.google.com/apis/credentials

const GOOGLE_REVIEWS_CONFIG = {
  // Replace with your actual Google API Key
  apiKey: 'AIzaSyC0_UIhj7Apap3O7lJX_rx-FpktVak7ig0',
  
  // Your Google Place ID (find it at: https://developers.google.com/maps/documentation/places/web-service/place-id)
  // You can also find it by searching your business on Google Maps and copying from the URL
  placeId: 'ChIJB9yevgdb4joRL-PLSzwW_dk',
  
  // Configuration options
  maxReviews: 10, // Maximum number of reviews to fetch
  minRating: 4, // Minimum star rating to display (1-5)
  sortBy: 'newest', // 'newest' or 'rating'
  language: 'en', // Language code (en, si, ta, etc.)
  
  // Fallback reviews (used when API is unavailable or during setup)
  useFallback: false, // Set to false once API is configured
  
  fallbackReviews: [
    {
      text: "Hands down the best burgers in Sri Lanka – juicy and packed with flavour!",
      author_name: "Kasun",
      rating: 5,
      profile_photo_url: null,
      time: Date.now() / 1000
    },
    {
      text: "Like Five Guys, but with a Sri Lankan twist. Absolutely worth it!",
      author_name: "Dilshan",
      rating: 5,
      profile_photo_url: null,
      time: Date.now() / 1000
    },
    {
      text: "Didn't expect such top-quality burgers here. Totally impressed!",
      author_name: "Ruwan",
      rating: 4,
      profile_photo_url: null,
      time: Date.now() / 1000
    },
    {
      text: "Fresh ingredients, amazing taste, and a proper local vibe.",
      author_name: "Shalini",
      rating: 5,
      profile_photo_url: null,
      time: Date.now() / 1000
    },
    {
      text: "Crispy fries, juicy patties, and the sauces are next level. Coming back for sure!",
      author_name: "Nadeesha",
      rating: 5,
      profile_photo_url: null,
      time: Date.now() / 1000
    },
    {
      text: "Great value for money and the friendliest staff in Burleys.",
      author_name: "Tharindu",
      rating: 4,
      profile_photo_url: null,
      time: Date.now() / 1000
    }
  ]
};

// Google Places API Helper Functions
class GoogleReviewsAPI {
  constructor(config) {
    this.config = config;
    this.reviews = [];
    this.lastFetch = null;
    this.cacheTimeout = 3600000; // 1 hour in milliseconds
  }

  // Check if we need to refresh the cache
  needsRefresh() {
    if (!this.lastFetch) return true;
    return (Date.now() - this.lastFetch) > this.cacheTimeout;
  }

  // Fetch reviews from Google Places API
  async fetchReviews() {
    // Check cache first
    if (!this.needsRefresh() && this.reviews.length > 0) {
      console.log('📦 Using cached Google reviews');
      return this.reviews;
    }

    // Use fallback if API not configured
    if (this.config.useFallback || !this.config.apiKey || this.config.apiKey === 'YOUR_GOOGLE_API_KEY_HERE') {
      console.log('⚠️ Google API not configured, using fallback reviews');
      return this.config.fallbackReviews;
    }

    try {
      console.log('🔄 Fetching fresh Google reviews...');
      
      // Use Netlify Function to avoid CORS issues
      const url = `/.netlify/functions/google-reviews?placeId=${this.config.placeId}&apiKey=${this.config.apiKey}&language=${this.config.language}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();

      if (data.status !== 'success') {
        throw new Error(`API returned status: ${data.status}`);
      }

      if (!data.reviews || data.reviews.length === 0) {
        throw new Error('No reviews found in API response');
      }

      // Process and filter reviews
      let reviews = data.reviews;

      // Filter by minimum rating
      reviews = reviews.filter(review => review.rating >= this.config.minRating);

      // Sort reviews
      if (this.config.sortBy === 'newest') {
        reviews.sort((a, b) => b.time - a.time);
      } else if (this.config.sortBy === 'rating') {
        reviews.sort((a, b) => b.rating - a.rating);
      }

      // Limit number of reviews
      reviews = reviews.slice(0, this.config.maxReviews);

      // Cache the reviews
      this.reviews = reviews;
      this.lastFetch = Date.now();

      // Store in localStorage for persistence
      try {
        localStorage.setItem('burleys_google_reviews', JSON.stringify({
          reviews: this.reviews,
          timestamp: this.lastFetch
        }));
      } catch (e) {
        console.warn('Could not cache reviews in localStorage:', e);
      }

      console.log(`✅ Fetched ${reviews.length} Google reviews`);
      return reviews;

    } catch (error) {
      console.error('❌ Error fetching Google reviews:', error);
      
      // Try to load from localStorage cache
      try {
        const cached = localStorage.getItem('burleys_google_reviews');
        if (cached) {
          const { reviews, timestamp } = JSON.parse(cached);
          console.log('📦 Using localStorage cached reviews');
          return reviews;
        }
      } catch (e) {
        console.warn('Could not load cached reviews:', e);
      }

      // Ultimate fallback
      console.log('⚠️ Using fallback reviews due to API error');
      return this.config.fallbackReviews;
    }
  }

  // Format review for display
  formatReview(review) {
    return {
      text: review.text || review.comment || '',
      name: review.author_name || 'Anonymous',
      stars: review.rating || 5,
      profilePhoto: review.profile_photo_url || null,
      time: review.time || Date.now() / 1000,
      verified: true // Google reviews are verified
    };
  }

  // Get reviews formatted for carousel
  async getFormattedReviews() {
    const reviews = await this.fetchReviews();
    return reviews.map(review => this.formatReview(review));
  }
}

// Export for use in script.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { GOOGLE_REVIEWS_CONFIG, GoogleReviewsAPI };
}
