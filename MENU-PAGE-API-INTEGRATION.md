# Menu Page API Integration Guide

## 🎉 What's New

Your `menu.html` page is now integrated with the **Delivergate POS API** and webshop!

### Key Features Added:
✅ **Live API Integration** - Menu items are fetched from Delivergate POS in real-time  
✅ **Webshop Links** - Direct "Order Online" buttons linking to your webshop  
✅ **Loading States** - Beautiful loading spinner while fetching data  
✅ **Error Handling** - Automatic fallback to cached menu if API fails  
✅ **Smart Category Mapping** - API categories automatically mapped to your menu categories  

---

## 📡 API Configuration

### API Endpoint
```
https://pos.delivergate.com/api/v1/webshop/main-menu/5/categories/webshop-brand/1/shop/1
```

### Current Settings (in menu.html)
```javascript
const DELIVERGATE_API = {
    baseURL: 'https://pos.delivergate.com/api/v1/webshop',
    categoryId: 5,              // Main menu category
    webshopBrand: 1,            // Your webshop brand ID
    shop: 1,                    // Your shop ID
    tenantCode: 'burleys',      // Important: Tenant code for authentication
    webshopURL: 'https://burleys-webshop.delivergate.com/',
    timeout: 10000              // 10 second timeout
};
```

### Required Headers
The API requires specific headers for proper authentication:
```javascript
headers: {
    'accept': 'application/json',
    'content-type': 'application/json',
    'origin': 'https://burleys-webshop.delivergate.com',
    'referer': 'https://burleys-webshop.delivergate.com/',
    'x-tenant-code': 'burleys'  // Critical for API access
}
```

### To Change Category
Edit line 493 in `menu.html`:
```javascript
categoryId: 5,  // Change to fetch different category
```

---

## 🔄 How It Works

### Data Flow
```
Page Load
    ↓
Show Loading Spinner
    ↓
Fetch from Delivergate API
    ↓ (Success)
Display Live Menu Items
    ↓ (API Fails)
Load Fallback Menu Items
    ↓
Show Warning Banner
```

### Automatic Category Mapping
The API automatically maps category names to your menu structure:

| API Category Name | Menu Category |
|-------------------|---------------|
| Contains "burger" | `burgers` |
| Contains "submarine" or "sub" | `submarines` |
| Contains "beverage", "drink", "coffee", "frappe", "gelato" | `beverages` |
| Everything else | `sides` |

---

## 🛍️ Webshop Integration

### Order Online Buttons
Two prominent "Order Online" buttons have been added:

1. **Hero Section** - Top of the page for immediate visibility
2. **Mid-Page CTA** - After menu items to capture interested users

Both link to: `https://burleys-webshop.delivergate.com/`

---

## 📊 API Response Processing

### Supported Field Names
The integration flexibly handles various API response formats:

```javascript
// Item ID
item.id || item.item_id || item.product_id

// Item Name  
item.name || item.item_name || item.product_name

// Description
item.description || item.item_description

// Price
item.price || item.item_price || item.selling_price

// Image
item.image || item.item_image || item.photo_url

// Category
item.category_name || item.category
```

### Expected API Response Format

The API returns a categorized structure:

```json
{
  "data": {
    "Burgers": [
      {
        "id": 1,
        "title": "Big Burley",
        "description": "Grilled Beef Patty...",
        "price": 2490,
        "image_url": "https://cdn.example.com/burger.jpg"
      }
    ],
    "Beverages": [
      {
        "id": 2,
        "title": "Cappuccino",
        "description": "Rich espresso...",
        "price": 590,
        "image_url": "https://cdn.example.com/coffee.jpg"
      }
    ]
  }
}
```

The system automatically processes this categorized structure and maps categories to your menu sections (burgers, submarines, beverages, sides).

---

## 🔧 Customization

### Change Timeout Duration
```javascript
timeout: 10000  // Milliseconds (10 seconds)
```

### Modify Price Formatting
The `formatPrice()` function formats prices for Sri Lanka (LKR):
```javascript
// Current: 2490 → "2,490"
// To show decimals: 2490 → "2,490.00"
return numPrice.toLocaleString('en-LK', { 
    minimumFractionDigits: 2,  // Change this
    maximumFractionDigits: 2 
});
```

### Update Webshop URL
Change line 496 in `menu.html`:
```javascript
webshopURL: 'https://your-new-webshop-url.com/',
```

---

## 🐛 Troubleshooting

### Menu Shows Loading Forever
**Possible Causes:**
- API endpoint is down
- CORS is blocking the request
- Network timeout

**Solution:**
1. Open browser console (F12)
2. Check for error messages
3. Verify API endpoint is accessible
4. The page should automatically fall back to cached menu

### CORS Error
**Error Message:** `Access to fetch has been blocked by CORS policy`

**Solution:**
Contact Delivergate support to enable CORS for your domain:
- `https://yourdomain.com`
- `https://www.yourdomain.com`

### Items Not Appearing in Correct Category
**Cause:** API category names don't match expected values

**Solution:**
Update category mapping in `processDelivergateData()` function (around line 1385):
```javascript
if (itemCategory.includes('burger')) category = 'burgers';
else if (itemCategory.includes('your-category-name')) category = 'submarines';
// Add more conditions as needed
```

### Images Not Loading
**Cause:** Image URLs from API are incorrect or relative paths

**Solution:**
Images are used as-is from API. If API returns:
- Full URL: `https://cdn.example.com/burger.jpg` → Used directly
- Relative path: `burger.jpg` → You may need to prepend base URL

Update line 1397 if needed:
```javascript
image: item.image ? `https://your-cdn.com/${item.image}` : '🍔',
```

---

## 🧪 Testing

### Test API Connection
1. Open `menu.html` in browser
2. Open Developer Tools (F12)
3. Go to Console tab
4. Look for messages:
   ```
   Fetching menu from Delivergate API...
   API URL: https://pos.delivergate.com/api/v1/webshop/main-menu/5/...
   Successfully loaded X items from API
   ```

### Test Fallback
1. Disconnect from internet or block the API URL
2. Refresh the page
3. Should see warning banner: "Showing cached menu items"
4. Menu should still display using fallback data

### Test Different Categories
Temporarily change category ID to test:
```javascript
categoryId: 10,  // Try different category IDs
```

---

## 📱 Features Breakdown

### 1. Loading State
- Animated spinner while fetching
- "Loading Menu..." message
- Automatically replaced when data loads

### 2. Error Handling
- Yellow warning banner if API fails
- Retry button to reload page
- Seamless fallback to cached data

### 3. Search & Filter
- Works with both API and fallback data
- Real-time filtering
- Searches name and description

### 4. Category Filtering
- All Items
- Burgers
- Submarines
- Beverages
- Sides

### 5. Order Online CTAs
- Prominent buttons in hero section
- Full CTA section mid-page
- Links to Delivergate webshop

---

## 🔐 Security Considerations

### API Authentication
Currently, the API is accessed without authentication. If Delivergate requires authentication:

```javascript
async fetchWithTimeout(url, options = {}) {
    // ... existing code ...
    const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer YOUR_API_TOKEN',  // Add this
            ...options.headers
        }
    });
    // ... rest of code ...
}
```

---

## 📈 Performance Optimization

### Current Optimizations:
- ✅ 10-second timeout prevents long waits
- ✅ Single API call on page load
- ✅ Cached fallback data for reliability
- ✅ Efficient filtering with native JavaScript

### Future Enhancements:
- Add caching with `localStorage` to reduce API calls
- Implement retry logic with exponential backoff
- Add refresh button to manually reload menu
- Cache API responses for 5-10 minutes

---

## 🚀 Going Live Checklist

Before deploying to production:

- [ ] Verify API endpoint returns correct data
- [ ] Test on multiple browsers (Chrome, Firefox, Safari, Edge)
- [ ] Test on mobile devices
- [ ] Ensure CORS is enabled for your domain
- [ ] Verify all "Order Online" buttons work
- [ ] Check that images load correctly
- [ ] Test error states (network failure)
- [ ] Verify search and filter functionality
- [ ] Check loading states appear correctly
- [ ] Test with different screen sizes (responsive design)

---

## 📞 Support & Contact

### Delivergate API Issues
Contact Delivergate support for:
- API access problems
- CORS configuration
- Authentication tokens
- Data format questions
- API endpoint changes

### Menu Page Issues
For integration issues:
1. Check browser console for errors
2. Review Network tab in DevTools
3. Verify API response format
4. Check console log messages

---

## 🔗 Related Files

- **menu.html** - Main menu page with API integration
- **delivergate-api-config.js** - Standalone API configuration (reference)
- **DELIVERGATE-API-INTEGRATION.md** - Homepage API integration guide
- **API-TESTING-GUIDE.md** - API testing documentation

---

## 📝 Quick Reference

### API URL Builder
```javascript
const url = DELIVERGATE_API.getMenuURL();
// Returns: https://pos.delivergate.com/api/v1/webshop/main-menu/5/categories/webshop-brand/1/shop/1
```

### Manual API Call
```javascript
loadMenuFromAPI();  // Fetch and render menu
```

### Reload Menu
```javascript
location.reload();  // Full page reload
```

---

## 🎨 UI Components Added

### Loading Spinner
Modern animated spinner with orange gradient

### Warning Banner
Yellow banner with retry button when API fails

### Order Online Buttons
- White background with orange text
- Shopping cart icon
- Hover animations (lift + scale)
- Arrow indicator

### CTA Section
- Orange gradient background
- Feature highlights (delivery, payment, quality)
- Large call-to-action button

---

## Version Information

**Integration Date:** 2025  
**API Version:** v1  
**Delivergate POS Endpoint:** Production  
**Last Updated:** October 2025

---

**Need Help?** Contact Delivergate support or your development team.

