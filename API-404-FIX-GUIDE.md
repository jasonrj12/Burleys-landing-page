# 🔧 How to Fix 404 API Error

## The Problem

You're getting this error:
```
Failed to load resource: the server responded with a status of 404
Delivergate API Error: Error: API Error: 404
```

**What it means:** The API endpoint doesn't exist or the URL parameters are incorrect.

## 🚀 Quick Fix Steps

### Step 1: Run API Diagnostic Test

1. Open your website
2. Press **F12** to open Developer Tools
3. Go to **Console** tab
4. Type this and press Enter:
   ```javascript
   testDelivergateAPI()
   ```

This will test your API configuration and show you:
- ✅ If the categories endpoint works
- ✅ Available category IDs
- ✅ If the menu endpoint works

### Step 2: Check the Console Output

You'll see something like:

**If Categories Work:**
```
✅ Categories Response: [
  { id: 1, name: "Burgers" },
  { id: 2, name: "Beverages" },
  { id: 3, name: "Sides" }
]
```

**If Categories Fail:**
```
❌ Categories Error: 404 Not Found
```

### Step 3: Fix Based on Results

#### Scenario A: Categories endpoint returns 404

**Problem:** Your shop ID or webshop brand ID is incorrect

**Solutions:**

1. **Contact Delivergate** to get correct IDs:
   - Shop ID
   - Webshop Brand ID

2. **Update Configuration** in `script.js` (line 410-411):
   ```javascript
   webshopBrand: 1,  // Change this
   shop: 2,          // Change this
   ```

#### Scenario B: Categories work but Menu endpoint fails

**Problem:** Category ID 65 doesn't exist

**Solution:** Use a valid category ID from the test results

1. Check console for available category IDs
2. Choose the correct one (e.g., category 1, 2, 3)
3. Load menu with that ID:
   ```javascript
   loadFeaturedMenu(1)  // Replace 1 with your category ID
   ```

Or set it permanently in `script.js` by calling with a specific ID.

#### Scenario C: Both endpoints fail

**Possible Issues:**

1. **Wrong API URL**
   - Verify: `https://pos-dev.delivergate.com/api/v1/webshop`
   - Is this the correct base URL?
   - Is it a staging/dev vs production URL issue?

2. **CORS Issues**
   - The API might block requests from your domain
   - Contact Delivergate to whitelist your domain

3. **Authentication Required**
   - The API might need an auth token
   - Get token from Delivergate
   - Add to configuration

## 🔍 Detailed Diagnostic

### Test URLs Directly in Browser

Open these URLs in a new tab:

**Categories:**
```
https://pos-dev.delivergate.com/api/v1/webshop/categories/webshop-brand/1/shop/2
```

**Menu (with category 1):**
```
https://pos-dev.delivergate.com/api/v1/webshop/main-menu/1/categories/webshop-brand/1/shop/2
```

**What to look for:**
- ✅ JSON response = Working
- ❌ 404 error page = Wrong parameters
- ❌ CORS error = Domain not whitelisted
- ❌ 401/403 error = Authentication needed

## 📝 Common Solutions

### Solution 1: Use Correct Shop/Brand IDs

```javascript
// In script.js, update lines 410-411
const DELIVERGATE_API = {
  baseURL: 'https://pos-dev.delivergate.com/api/v1/webshop',
  webshopBrand: YOUR_BRAND_ID,  // Get from Delivergate
  shop: YOUR_SHOP_ID,            // Get from Delivergate
  // ...
};
```

### Solution 2: Use Specific Category ID

Once you know the correct category ID:

```javascript
// Load menu with specific category
loadFeaturedMenu(10);  // Replace 10 with your category ID
```

### Solution 3: Update API Endpoint Structure

If Delivergate uses a different URL structure, update:

```javascript
getMenuURL(categoryId) {
  // Old (current):
  return `${this.baseURL}/main-menu/${categoryId}/categories/webshop-brand/${this.webshopBrand}/shop/${this.shop}`;
  
  // Example alternative structure:
  return `${this.baseURL}/shop/${this.shop}/categories/${categoryId}/items`;
}
```

### Solution 4: Enable Fallback (Temporary)

While fixing the API, use local data:

```javascript
// In script.js, ensure this is set:
useLocalFallback: true,  // Line 413
```

This will show your local menu while you fix the API.

### Solution 5: Add Authentication

If API requires auth:

```javascript
async fetchWithTimeout(url, options = {}) {
  // Add auth header
  const response = await fetch(url, {
    ...options,
    headers: {
      'Authorization': 'Bearer YOUR_TOKEN_HERE',
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers
    }
  });
  // ...
}
```

## 🧪 Testing Different Configurations

### Test with different shop ID:
```javascript
DELIVERGATE_API.shop = 1;
testDelivergateAPI();
```

### Test with different brand ID:
```javascript
DELIVERGATE_API.webshopBrand = 2;
testDelivergateAPI();
```

### Test with different category:
```javascript
loadFeaturedMenu(5);  // Try category 5
```

## 📞 Getting Help from Delivergate

Contact Delivergate support and ask for:

1. **Correct API Endpoints**
   - Categories endpoint URL
   - Menu items endpoint URL

2. **Your Account IDs**
   - Webshop Brand ID
   - Shop ID
   - Available Category IDs

3. **Authentication Details**
   - Is authentication required?
   - API token/key if needed

4. **API Documentation**
   - Request format
   - Response format
   - Example requests

## ✅ Success Checklist

After fixing, verify:

- [ ] `testDelivergateAPI()` shows no errors
- [ ] Categories are returned successfully
- [ ] Menu items are returned for at least one category
- [ ] Menu displays correctly on the page
- [ ] Images load properly
- [ ] Prices show correctly

## 🔄 Current Workaround

Your site will automatically fall back to local data (`menu-api.json`) if the API fails. This ensures your menu always displays, even while troubleshooting the API connection.

To update the local fallback menu, edit `menu-api.json`.

## 💡 Quick Commands

Run these in browser console:

```javascript
// Test API
testDelivergateAPI()

// Reload menu
loadFeaturedMenu()

// Load with specific category
loadFeaturedMenu(1)

// Check configuration
console.log(DELIVERGATE_API)

// Disable fallback to debug API only
DELIVERGATE_API.useLocalFallback = false
loadFeaturedMenu()
```

## 🎯 Most Likely Solution

Based on the 404 error, the most likely issues are:

1. **Category ID 65 doesn't exist** → Run `testDelivergateAPI()` to find valid IDs
2. **Wrong shop/brand IDs** → Verify with Delivergate
3. **API URL structure changed** → Check with Delivergate for current format

Start with running `testDelivergateAPI()` in the console - it will tell you exactly what's wrong!

