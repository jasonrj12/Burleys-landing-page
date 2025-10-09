# 🚀 Quick Setup - Google Reviews Integration

## Just 3 Steps to Go Live!

### Step 1: Get Google API Key (2 minutes)
1. Go to: https://console.cloud.google.com/
2. Create/Select Project
3. Enable "Places API"
4. Create API Key under Credentials
5. Copy the key

### Step 2: Find Your Place ID (1 minute)
1. Go to: https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder
2. Search for "Burley's Colombo"
3. Click your business
4. Copy the Place ID

### Step 3: Update Configuration (30 seconds)
Open `google-reviews-config.js` and replace:

```javascript
apiKey: 'YOUR_ACTUAL_API_KEY_HERE',
placeId: 'YOUR_ACTUAL_PLACE_ID_HERE',
useFallback: false  // Change to false after configuration
```

That's it! Refresh your page and you'll see real Google reviews! ✨

---

## Testing

Open your website and check the browser console (F12):
- ✅ Should see: `✅ Loaded X Google reviews`
- ❌ If you see fallback reviews, check your API key and Place ID

---

## Need More Help?
Read the full guide: `GOOGLE-REVIEWS-SETUP-GUIDE.md`

## Features You'll Get:
- ✅ Real Google Reviews
- ✅ Auto-rotating carousel
- ✅ Verified badges
- ✅ Profile photos
- ✅ Timestamps ("2 days ago")
- ✅ Smart caching (1 hour)
- ✅ Mobile responsive

---

**Current Status:** Using fallback reviews until API is configured

**Cost:** FREE (within Google's free tier with smart caching)
