# Google Reviews Integration Setup Guide

## Overview
Your Burley's landing page now features dynamic Google Reviews integration! Reviews are fetched from Google Places API and displayed in an auto-rotating carousel with verified badges, profile photos, and relative timestamps.

---

## 🚀 Quick Start

### Step 1: Get Your Google API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Places API**:
   - Navigate to "APIs & Services" → "Library"
   - Search for "Places API"
   - Click "Enable"
4. Create credentials:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "API Key"
   - Copy your API key

### Step 2: Find Your Place ID

#### Method 1: Using Google Place ID Finder
1. Go to [Place ID Finder](https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder)
2. Search for "Burley's Colombo"
3. Click on your business
4. Copy the Place ID shown

#### Method 2: From Google Maps URL
1. Search for your business on [Google Maps](https://www.google.com/maps)
2. Look at the URL - it contains your Place ID
3. Example: `https://www.google.com/maps/place/?q=place_id:ChIJN1t_tDeuEmsRUsoyG83frY4`
4. Copy the ID after `place_id:`

### Step 3: Configure the Integration

Open `google-reviews-config.js` and update:

```javascript
const GOOGLE_REVIEWS_CONFIG = {
  // Replace with your actual Google API Key
  apiKey: 'YOUR_GOOGLE_API_KEY_HERE',
  
  // Replace with your Google Place ID
  placeId: 'YOUR_PLACE_ID_HERE',
  
  // Set to false once API is configured
  useFallback: false,
  
  // Customize other options as needed
  maxReviews: 10,
  minRating: 4,
  sortBy: 'newest', // 'newest' or 'rating'
  language: 'en'
};
```

### Step 4: Test the Integration

1. Open your website in a browser
2. Navigate to the reviews section
3. Open browser console (F12)
4. You should see: `✅ Loaded X Google reviews`

---

## 🎨 Features

### What's Included:

✅ **Real-time Google Reviews** - Fetches actual reviews from Google  
✅ **Auto-rotating Carousel** - Reviews change every 5 seconds  
✅ **Verified Badges** - Shows Google verification badge  
✅ **Profile Photos** - Displays reviewer profile pictures  
✅ **Relative Timestamps** - Shows "2 days ago", "1 week ago", etc.  
✅ **Smart Caching** - Caches reviews for 1 hour to reduce API calls  
✅ **Fallback System** - Uses static reviews if API fails  
✅ **Mobile Responsive** - Looks great on all devices  
✅ **Manual Navigation** - Users can click arrows to browse reviews  

---

## ⚙️ Configuration Options

### In `google-reviews-config.js`:

| Option | Description | Default |
|--------|-------------|---------|
| `apiKey` | Your Google API Key | Required |
| `placeId` | Your Google Place ID | Required |
| `maxReviews` | Maximum reviews to fetch | 10 |
| `minRating` | Minimum star rating (1-5) | 4 |
| `sortBy` | Sort order: 'newest' or 'rating' | 'newest' |
| `language` | Language code (en, si, ta) | 'en' |
| `useFallback` | Use fallback reviews if API unavailable | true |

---

## 🔧 How It Works

### 1. Review Fetching Process
```
Page Load → Check Cache → Fetch from Google API → Process Reviews → Display
```

### 2. Caching Strategy
- Reviews are cached in `localStorage` for 1 hour
- Reduces API calls and improves performance
- Automatic refresh after cache expires

### 3. Fallback System
The system has three levels of fallback:
1. **Primary**: Google Places API
2. **Secondary**: localStorage cache
3. **Tertiary**: Hardcoded fallback reviews

---

## 📊 API Usage & Costs

### Google Places API Pricing
- Free tier: 0-100,000 requests per month
- After free tier: $17 per 1,000 requests

### Optimization Tips
1. **Caching**: Reviews are cached for 1 hour (reduces API calls by ~95%)
2. **Single Endpoint**: Only uses Place Details endpoint
3. **Minimal Fields**: Only requests necessary data

### Expected Usage
- Average visits per month: 10,000
- API calls per month: ~240 (with 1-hour cache)
- Cost: **FREE** (well within free tier)

---

## 🐛 Troubleshooting

### Reviews Not Loading?

#### Issue: Shows fallback reviews instead of Google reviews

**Solution 1: Check API Key**
```javascript
// In google-reviews-config.js
console.log('API Key:', GOOGLE_REVIEWS_CONFIG.apiKey);
// Should NOT be 'YOUR_GOOGLE_API_KEY_HERE'
```

**Solution 2: Check Place ID**
```javascript
console.log('Place ID:', GOOGLE_REVIEWS_CONFIG.placeId);
// Should start with 'ChIJ' or similar
```

**Solution 3: Enable Places API**
- Go to Google Cloud Console
- Navigate to "APIs & Services" → "Library"
- Search for "Places API"
- Ensure it's enabled

**Solution 4: Check API Restrictions**
- In Google Cloud Console → Credentials
- Click on your API key
- Under "Application restrictions" → Set to "None" for testing
- Under "API restrictions" → Ensure "Places API" is allowed

#### Issue: CORS Errors in Console

**Solution: Use Server-Side Proxy**

Due to CORS restrictions, you may need a server-side proxy:

1. **Option A: Use Netlify Functions**
```javascript
// netlify/functions/google-reviews.js
const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  const { placeId, apiKey } = event.queryStringParameters;
  
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,reviews&key=${apiKey}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
```

2. **Option B: Use Cloud Functions**
- Deploy a serverless function to handle API requests
- Update `fetchReviews()` to call your function endpoint

3. **Option C: Use Backend API**
- If you have a backend server, create an endpoint there
- Fetch reviews server-side and send to frontend

#### Issue: API Quota Exceeded

**Solution:**
- Check usage in Google Cloud Console
- Increase cache timeout in `google-reviews-config.js`:
```javascript
this.cacheTimeout = 7200000; // 2 hours instead of 1
```

---

## 🔒 Security Best Practices

### 1. API Key Security

⚠️ **Important**: Never expose API keys in public repositories!

**For Development:**
- It's okay to have the API key in `google-reviews-config.js`

**For Production:**
- Use environment variables
- Implement server-side proxy
- Restrict API key to your domain

### 2. Restrict Your API Key

In Google Cloud Console:
1. Go to Credentials → Your API Key
2. Set "Application restrictions":
   - **HTTP referrers**: Add your domains
   - Example: `burleys.netlify.app/*`, `www.burleys.com/*`
3. Set "API restrictions":
   - Select "Restrict key"
   - Check only "Places API"

---

## 📱 Mobile Optimization

The reviews section is fully responsive:

- **Desktop**: Large profile photos, full verified badge
- **Tablet**: Medium sizing, optimized spacing
- **Mobile**: Compact layout, smaller elements

Reviews auto-rotate every 5 seconds for optimal engagement.

---

## 🎨 Customization

### Change Review Display Time
```javascript
// In script.js, line ~382
reviewInterval = setInterval(() => {
  reviewIndex = (reviewIndex + 1) % reviews.length;
  renderReview(reviewIndex);
}, 5000); // Change 5000 to desired milliseconds
```

### Modify Minimum Rating
```javascript
// In google-reviews-config.js
minRating: 5, // Only show 5-star reviews
```

### Change Number of Reviews
```javascript
// In google-reviews-config.js
maxReviews: 5, // Show only 5 best reviews
```

### Customize Styling
All styles are in `style.css` starting at line 1336:
- `.review-author` - Author section layout
- `.review-profile-photo` - Profile picture styling
- `.review-verified-badge` - Google badge design
- `.review-time` - Timestamp styling

---

## 📈 Testing Checklist

Before going live, verify:

- [ ] API key is configured correctly
- [ ] Place ID is correct
- [ ] Reviews load successfully (check console)
- [ ] Verified badge shows for Google reviews
- [ ] Profile photos display correctly
- [ ] Carousel auto-rotates every 5 seconds
- [ ] Navigation arrows work
- [ ] Fallback reviews work when API is disabled
- [ ] Mobile responsive on all devices
- [ ] No CORS errors in console
- [ ] API key restrictions are set

---

## 🚨 Important Notes

### API Limitations
- Google Places API has rate limits
- Reviews may take a few seconds to load
- Some reviews might not have profile photos
- Review text length varies

### Review Filtering
- Only displays reviews with rating ≥ `minRating`
- Sorted by newest or highest rating
- Limited to `maxReviews` count

### Fallback Behavior
- If API fails, shows static reviews
- Static reviews don't have verified badges
- Ensures site always displays reviews

---

## 📞 Support

### Need Help?

1. **Check Browser Console** (F12) for error messages
2. **Review Configuration** - Ensure API key and Place ID are correct
3. **Test API Directly** - Use [Google Places API Tester](https://developers.google.com/maps/documentation/places/web-service/details)
4. **Check API Status** - [Google Cloud Status Dashboard](https://status.cloud.google.com/)

### Common Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| `REQUEST_DENIED` | API key invalid or Places API not enabled | Check API key and enable Places API |
| `INVALID_REQUEST` | Wrong Place ID | Verify Place ID is correct |
| `OVER_QUERY_LIMIT` | Too many requests | Enable billing or wait for quota reset |
| `ZERO_RESULTS` | No reviews found | Check if business has Google reviews |

---

## ✅ You're All Set!

Your Google Reviews integration is now complete! 🎉

Once configured, your site will:
- ✨ Display real Google reviews
- 🔄 Auto-update every hour
- 📱 Work perfectly on mobile
- 🚀 Load fast with smart caching
- 🛡️ Fallback gracefully if API fails

**Next Steps:**
1. Configure your API key and Place ID
2. Test the integration
3. Set up API key restrictions
4. Monitor API usage in Google Cloud Console

---

## 📚 Additional Resources

- [Google Places API Documentation](https://developers.google.com/maps/documentation/places/web-service/overview)
- [Place Details API](https://developers.google.com/maps/documentation/places/web-service/details)
- [API Key Best Practices](https://cloud.google.com/docs/authentication/api-keys)
- [Places API Pricing](https://cloud.google.com/maps-platform/pricing)

---

**Developed by [Delivergate LK](https://delivergate.lk)**  
*Every bite, a burst of flavour* 🍔
