// ========================================
// GOOGLE PLACES API - COMPREHENSIVE FIX
// Version: 2.0 - New Google Places API
// ========================================

const GOOGLE_PLACES_CONFIG = {
  apiKey: 'AIzaSyCZ_hxyZW5iQI_Jhor_TCC6ImEJtB0_vHY',
  placeId: 'ChIJB9yevgdb4joRL-PLSzwW_dk',
  maxReviews: 8,
  minRating: 1,        // Allow all ratings
  maxTextLength: 350,  // Truncate to 350 characters
  language: 'en'
};

// ========================================
// FETCH REVIEWS (NEW GOOGLE PLACES API)
// ========================================
async function fetchGoogleReviews() {
  try {
    // Import the new Places library
    const { Place } = await google.maps.importLibrary("places");
    
    // Create Place instance
    const place = new Place({
      id: GOOGLE_PLACES_CONFIG.placeId,
      requestedLanguage: GOOGLE_PLACES_CONFIG.language
    });
    
    // Fetch fields
    await place.fetchFields({
      fields: ['reviews', 'rating', 'displayName']
    });
    
    return place;
    
  } catch (error) {
    console.error('❌ Failed to load reviews:', error.message);
    throw error;
  }
}

// ========================================
// PROCESS REVIEWS
// ========================================
function processReviews(place) {
  const reviews = place.reviews || [];
  
  console.log(`📊 Google returned ${reviews.length} total reviews`);
  
  if (reviews.length === 0) {
    return [];
  }
  
  const processed = reviews
    .slice(0, GOOGLE_PLACES_CONFIG.maxReviews)
    .map(review => {
      // Format date
      let formattedDate = 'Recently';
      if (review.publishTime) {
        try {
          const date = new Date(review.publishTime);
          const now = new Date();
          const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
          
          if (diffDays < 7) formattedDate = `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
          else if (diffDays < 30) formattedDate = `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) !== 1 ? 's' : ''} ago`;
          else if (diffDays < 365) formattedDate = `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) !== 1 ? 's' : ''} ago`;
          else formattedDate = date.toLocaleDateString();
        } catch (e) {
          formattedDate = 'Recently';
        }
      }
      
      // Extract author name from new API structure
      const authorName = review.authorAttribution?.displayName || 
                        review.author_name || 
                        review.authorName || 
                        'A Google User';
      
      // Extract review text from new API structure
      let reviewText = review.text?.text || review.text || '';
      
      // Truncate long reviews
      if (reviewText.length > GOOGLE_PLACES_CONFIG.maxTextLength) {
        reviewText = reviewText.substring(0, GOOGLE_PLACES_CONFIG.maxTextLength).trim() + '...';
      }
      
      return {
        text: reviewText,
        name: authorName,
        stars: review.rating || 5,
        date: formattedDate,
        platform: 'Google'
      };
    });
  
  console.log(`✅ Loaded ${processed.length} reviews (truncated to 350 chars)`);
  return processed;
}

// ========================================
// LOAD AND UPDATE UI
// ========================================
async function loadGooglePlacesReviews() {
  try {
    // Fetch place data
    const place = await fetchGoogleReviews();
    
    // Process reviews
    const reviews = processReviews(place);
    
    if (reviews.length === 0) {
      return;
    }
    
    // Update global reviews
    window.reviews = reviews;
    window.reviewIndex = 0;
    
    // Restart carousel
    if (typeof window.stopReviewAutoSlide === 'function') {
      window.stopReviewAutoSlide();
    }
    
    if (typeof window.renderReview === 'function') {
      setTimeout(() => {
        window.renderReview(0);
        
        if (typeof window.startReviewAutoSlide === 'function') {
          window.startReviewAutoSlide();
        }
      }, 100);
    }
    
  } catch (error) {
    console.error('❌ Failed to load reviews');
  }
}

// ========================================
// INITIALIZATION
// ========================================
async function initGooglePlaces() {
  // Wait for Google Maps API
  if (typeof google === 'undefined' || !google.maps) {
    setTimeout(initGooglePlaces, 500);
    return;
  }
  
  // Load reviews
  await loadGooglePlacesReviews();
}

// Start when ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initGooglePlaces, 1500);
  });
} else {
  setTimeout(initGooglePlaces, 1500);
}

// ========================================
// DEBUG COMMANDS
// ========================================
window.debugReviews = function() {
  console.log('=== REVIEW DEBUG INFO ===');
  console.log('Total reviews:', window.reviews?.length);
  console.log('Current index:', window.reviewIndex);
  console.log('Reviews:', window.reviews);
  console.log('Auto-slide active:', !!reviewInterval);
  console.log('========================');
};

window.reloadReviews = function() {
  console.log('🔄 Manually reloading reviews...');
  loadGooglePlacesReviews();
};
