# 🧪 Testing Google Reviews Integration

## Quick Test Guide

### ✅ Pre-Deployment Test (Local)

#### Test 1: Configuration Check
Open `google-reviews-config.js` and verify:
- [x] `apiKey` is set to: `AIzaSyC0_UIhj7Apap3O7lJX_rx-FpktVak7ig0`
- [x] `placeId` is set to: `ChIJB9yevgdb4joRL-PLSzwW_dk`
- [x] `useFallback` is set to: `false`

#### Test 2: Files Present
Check these files exist:
- [x] `google-reviews-config.js`
- [x] `netlify/functions/google-reviews.js`
- [x] `netlify/functions/package.json`
- [x] `netlify.toml`

---

### 🚀 Post-Deployment Tests

#### Test 1: Function Endpoint Test
Visit this URL (replace with your domain):
```
https://burleys.netlify.app/.netlify/functions/google-reviews?placeId=ChIJB9yevgdb4joRL-PLSzwW_dk&apiKey=AIzaSyC0_UIhj7Apap3O7lJX_rx-FpktVak7ig0&language=en
```

**Expected Response:**
```json
{
  "status": "success",
  "data": {
    "name": "Burley's",
    "rating": 4.5,
    "reviews": [...]
  },
  "reviews": [
    {
      "author_name": "John Doe",
      "rating": 5,
      "text": "Amazing burgers!",
      ...
    }
  ]
}
```

**If you get an error:**
- Check Netlify deploy logs
- Verify function deployed correctly
- Check API key is valid

#### Test 2: Website Console Check
1. Visit your website: `https://burleys.netlify.app/`
2. Press **F12** to open Developer Tools
3. Go to **Console** tab
4. Scroll to Reviews section

**Expected Console Output:**
```
🔄 Fetching fresh Google reviews...
✅ Loaded 10 Google reviews
```

**If you see:**
```
⚠️ Google API not configured, using fallback reviews
```
Then:
- Check `useFallback` is set to `false`
- Clear browser cache
- Hard reload (Ctrl+Shift+R)

#### Test 3: Visual Check
Scroll to the reviews section and verify:
- [ ] Reviews are displaying
- [ ] Shows verified badge (🔵 Verified)
- [ ] Shows profile photos (if available)
- [ ] Shows timestamps ("2 days ago")
- [ ] Auto-rotates every 5 seconds
- [ ] Navigation arrows work

#### Test 4: Network Tab Check
1. Open Developer Tools (F12)
2. Go to **Network** tab
3. Refresh page
4. Look for request to: `google-reviews?placeId=...`

**Expected:**
- Status: **200 OK**
- Response: JSON with reviews
- Time: < 2 seconds

---

### 🔍 Troubleshooting Tests

#### If Reviews Show "Loading..." Forever:

**Test A: Check Network Request**
1. F12 → Network tab
2. Look for `google-reviews` request
3. Check status code

**Possible Issues:**
- **404**: Function not deployed → Redeploy
- **500**: Function error → Check logs
- **CORS**: Should be fixed by Netlify Function

**Test B: Check Console Errors**
1. F12 → Console tab
2. Look for red error messages

**Common Errors:**
```
❌ Error fetching Google reviews: API Error: 404
→ Solution: Function not deployed, commit and push

❌ Error: API returned status: REQUEST_DENIED
→ Solution: Check API key or enable Places API

❌ Error: Failed to fetch
→ Solution: Network issue, check internet connection
```

#### If Shows Fallback Reviews:

**Check 1: useFallback Setting**
```javascript
// In google-reviews-config.js
useFallback: false  // MUST be false
```

**Check 2: API Key Check**
Look at line 91 in `google-reviews-config.js`:
```javascript
// Should NOT include your actual API key
this.config.apiKey === 'YOUR_GOOGLE_API_KEY_HERE'
```

**Check 3: Clear Cache**
```javascript
// In console, run:
localStorage.removeItem('burleys_google_reviews');
location.reload();
```

---

### 📱 Mobile Testing

#### iOS Safari Test:
1. Open site on iPhone
2. Check reviews display correctly
3. Verify auto-rotation works
4. Test navigation arrows
5. Check profile photos load

#### Android Chrome Test:
1. Open site on Android
2. Repeat above checks
3. Verify touch interactions work

---

### 🎯 Success Criteria

Your integration is working if:
- ✅ Reviews load within 2 seconds
- ✅ Shows verified Google badge
- ✅ Displays profile photos (when available)
- ✅ Shows relative timestamps
- ✅ Auto-rotates every 5 seconds
- ✅ Navigation arrows work
- ✅ Console shows "✅ Loaded X Google reviews"
- ✅ No console errors
- ✅ Works on mobile and desktop

---

### 🧪 Manual API Test

You can test the Google API directly using curl:

```bash
curl "https://maps.googleapis.com/maps/api/place/details/json?place_id=ChIJB9yevgdb4joRL-PLSzwW_dk&fields=name,rating,reviews&key=AIzaSyC0_UIhj7Apap3O7lJX_rx-FpktVak7ig0"
```

**Expected Response:**
```json
{
  "result": {
    "name": "Burley's",
    "rating": 4.5,
    "reviews": [...]
  },
  "status": "OK"
}
```

**If this fails:**
- API key is invalid
- Places API not enabled
- API key restrictions too strict

---

### 📊 Performance Test

#### Check Load Time:
1. F12 → Network tab
2. Refresh page
3. Look at timeline

**Expected:**
- Initial page load: < 2s
- Google reviews fetch: < 1s
- Total time to reviews: < 3s

#### Check Caching:
1. Load page (reviews fetch from API)
2. Refresh page (should use cache)
3. Console should show: "📦 Using cached Google reviews"

---

### 🔄 Cache Test

#### Test 1: Verify Caching Works
```javascript
// In browser console:
const cached = localStorage.getItem('burleys_google_reviews');
console.log('Cached reviews:', JSON.parse(cached));
```

**Expected:**
```json
{
  "reviews": [...],
  "timestamp": 1696867200000
}
```

#### Test 2: Test Cache Expiry
```javascript
// Clear cache
localStorage.removeItem('burleys_google_reviews');

// Reload page
location.reload();

// Should fetch fresh reviews
// Console: "🔄 Fetching fresh Google reviews..."
```

---

### ✅ Final Checklist

Before marking as complete:
- [ ] Function endpoint returns reviews
- [ ] Website displays reviews correctly
- [ ] Verified badges appear
- [ ] Profile photos load
- [ ] Timestamps display
- [ ] Auto-rotation works (5s interval)
- [ ] Navigation arrows functional
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Cache working (localStorage)
- [ ] Fallback disabled
- [ ] API key restricted in Google Console

---

### 🎉 All Tests Passed?

**Congratulations!** 🎊

Your Google Reviews integration is fully operational!

**What to Monitor:**
1. **Weekly**: Check reviews are updating
2. **Monthly**: Monitor API usage in Google Console
3. **Quarterly**: Review and update fallback reviews

**Maintenance:**
- No regular maintenance needed
- Reviews update automatically every hour
- API calls are cached efficiently
- Costs remain $0 with current traffic

---

### 📞 Support

**If tests fail:**
1. Check `DEPLOYMENT-GUIDE.md`
2. Review `GOOGLE-REVIEWS-SETUP-GUIDE.md`
3. Check Netlify deploy logs
4. Verify Google Cloud Console settings

**Common Solutions:**
- Clear browser cache
- Hard reload (Ctrl+Shift+R)
- Check API key restrictions
- Redeploy to Netlify
- Verify Places API enabled

---

**Test Status**: Ready to test after deployment  
**Last Updated**: October 10, 2025  
**Estimated Test Time**: 10 minutes
