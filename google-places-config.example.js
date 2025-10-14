// =====================================================
// GOOGLE PLACES API - EXAMPLE CONFIGURATION
// =====================================================
// Copy this example and update google-places-reviews.js
// with your actual credentials

const GOOGLE_PLACES_CONFIG_EXAMPLE = {
  // Step 1: Get API Key from https://console.cloud.google.com/
  apiKey: 'AAIzaSyD-8ZgDQn4LGKWCiwn08VnUkNSfY-eluYM',
  
  // Step 2: Get Place ID - Search "Burley's Colombo" here:
  // https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder
  placeId: 'ChIJB9yevgdb4joRL-PLSzwW_dk',
  
  // Optional: Customize these settings
  maxReviews: 8,        // Number of reviews to display
  minRating: 4,         // Minimum stars (1-5)
  language: 'en',       // 'en', 'si', 'ta'
  sortBy: 'most_relevant' // or 'newest'
};

// =====================================================
// EXAMPLE FOR BURLEY'S (You need to get real IDs)
// =====================================================

// Your configuration should look like this:
const BURLEYS_EXAMPLE = {
  apiKey: 'AIzaSyB1a2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q',
  placeId: 'ChIJN1t_tDeuEmsRUsoyG83frY4',
  maxReviews: 8,
  minRating: 4,
  language: 'en',
  sortBy: 'most_relevant'
};

// =====================================================
// FIND YOUR PLACE ID - 3 EASY METHODS
// =====================================================

// Method 1: Place ID Finder Tool
// https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder
// Search: "Burley's, 32 Galle Road, Colombo"

// Method 2: Google Maps Share Link
// 1. Open Google Maps
// 2. Search for your business
// 3. Click "Share"
// 4. Copy link - Place ID is in the URL

// Method 3: Direct URL
// Your business Google Maps URL contains the Place ID
// Example: https://maps.google.com/?cid=12345678901234567890

// =====================================================
// WHAT TO DO NEXT
// =====================================================

/*
1. Get your API key: https://console.cloud.google.com/apis/credentials
2. Get your Place ID using one of the methods above
3. Open google-places-reviews.js
4. Replace YOUR_GOOGLE_PLACES_API_KEY_HERE with your API key
5. Replace YOUR_PLACE_ID_HERE with your Place ID
6. Open index.html
7. Uncomment the Google Maps script lines (near line 312)
8. Replace YOUR_API_KEY_HERE in index.html with your API key
9. Test in browser - check console for success messages
*/

// =====================================================
// SECURITY REMINDER
// =====================================================

/*
⚠️ IMPORTANT: Restrict your API key!

1. Go to: https://console.cloud.google.com/apis/credentials
2. Click on your API key
3. Under "Application restrictions":
   - Select "HTTP referrers (websites)"
   - Add: https://burleys.netlify.app/*
   - Add: http://127.0.0.1:5500/* (for testing)
   
4. Under "API restrictions":
   - Select "Restrict key"
   - Check only: "Places API"
   
5. Save changes

This prevents unauthorized use of your API key!
*/

