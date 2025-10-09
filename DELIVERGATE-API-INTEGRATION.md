# Delivergate API Integration Guide

## 🚀 Overview
Your featured menu is now connected to the **Delivergate POS API**, fetching real-time menu data directly from your webshop system.

## 📡 API Endpoints

### 1. Categories Endpoint
```
GET https://pos-dev.delivergate.com/api/v1/webshop/categories/webshop-brand/1/shop/2
```
Returns all available categories for your webshop.

### 2. Main Menu Endpoint
```
GET https://pos-dev.delivergate.com/api/v1/webshop/main-menu/65/categories/webshop-brand/1/shop/2
```
Returns menu items for category ID 65 (your featured items).

## ⚙️ Configuration

### Current Settings (in `script.js`)
```javascript
const DELIVERGATE_API = {
  baseURL: 'https://pos-dev.delivergate.com/api/v1/webshop',
  categoryId: 65,        // Featured category ID
  webshopBrand: 1,       // Your webshop brand ID
  shop: 2,               // Your shop ID
  timeout: 10000         // 10 second timeout
};
```

### To Change Category ID
Edit line 409 in `script.js`:
```javascript
categoryId: 65,  // Change this number to display different category
```

## 🔄 How It Works

1. **Primary Source**: Fetches from Delivergate API
2. **Fallback**: If API fails, loads from local `menu-api.json`
3. **Error Handling**: Shows error message with retry button if both fail

### Data Flow
```
Page Load → Delivergate API → Process Data → Render Menu
              ↓ (if fails)
          Local JSON → Render Menu
              ↓ (if fails)
          Show Error Message
```

## 📊 API Response Processing

The system handles multiple API response formats:

### Supported Field Names
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
```

### Expected API Response Format
```json
[
  {
    "id": 1,
    "name": "Item Name",
    "description": "Item description",
    "price": 1500,
    "image": "https://example.com/image.jpg",
    "category": "burgers",
    "featured": true
  }
]
```

OR with wrapper:
```json
{
  "data": [
    // array of items
  ]
}
```

## 🖼️ Image Handling

### Automatic Image URL Processing
1. **Full URLs**: Used as-is
   ```
   https://cdn.delivergate.com/images/burger.jpg
   ```

2. **Relative Paths**: Prepended with `images/`
   ```
   burger.jpg → images/burger.jpg
   ```

3. **Error Fallback**: Shows placeholder if image fails
   ```javascript
   onerror="this.src='images/placeholder.webp'"
   ```

## 🔐 Authentication (If Required)

If the API requires authentication, update the fetch headers:

```javascript
// In DELIVERGATE_API.fetchWithTimeout() function
headers: {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Authorization': 'Bearer YOUR_API_TOKEN', // Add this
  ...options.headers
}
```

## 🛠️ Customization

### Change Timeout Duration
```javascript
timeout: 10000  // Change to desired milliseconds
```

### Limit Number of Items
Currently shows 8 items. To change:
```javascript
// Line 568 in script.js
const featuredItems = items.filter(item => item.featured !== false).slice(0, 8);
//                                                                         ↑ Change this
```

### Filter by Category
```javascript
const featuredItems = items
  .filter(item => item.category === 'burgers') // Add category filter
  .slice(0, 8);
```

## 🐛 Debugging

### Enable Console Logs
Open browser console (F12) to see:
```
Fetching from Delivergate API: https://...
Delivergate API Error: ... (if error occurs)
Falling back to local menu data... (if fallback triggered)
```

### Common Issues & Solutions

#### 1. CORS Error
**Problem**: Browser blocks cross-origin requests
**Solution**: 
- Contact Delivergate to enable CORS for your domain
- OR use a backend proxy to fetch the data

#### 2. Timeout Errors
**Problem**: API takes too long to respond
**Solution**: Increase timeout value
```javascript
timeout: 20000  // Increase to 20 seconds
```

#### 3. Data Format Issues
**Problem**: API returns unexpected format
**Solution**: Check the actual API response and update field mappings in `processDelivergateData()`

#### 4. Images Not Loading
**Problem**: Image URLs are incorrect
**Solution**: Verify image paths in API response match your image folder structure

## 🔄 Updating Menu Data

### Real-time Updates
Menu data is fetched fresh on every page load. To manually refresh:
```javascript
loadFeaturedMenu(); // Call this function
```

### Auto-refresh Every X Minutes
Add this to script.js:
```javascript
// Refresh menu every 5 minutes
setInterval(() => {
  loadFeaturedMenu();
}, 5 * 60 * 1000);
```

## 📝 Testing

### Test with Different Categories
```javascript
// Temporarily change category ID for testing
const menuURL = DELIVERGATE_API.getMenuURL(70); // Test category 70
```

### Test Fallback
```javascript
// Temporarily disable API to test fallback
throw new Error('Testing fallback');
```

## 🚨 Production Checklist

Before going live:
- [ ] Verify API endpoints are correct
- [ ] Test with actual Delivergate API data
- [ ] Ensure CORS is enabled for your domain
- [ ] Add authentication if required
- [ ] Test error states (network failure, timeout)
- [ ] Verify all images load correctly
- [ ] Test on multiple browsers
- [ ] Check mobile responsiveness
- [ ] Monitor API response times
- [ ] Set up error tracking/logging

## 📞 Support

### Delivergate API Support
Contact Delivergate support for:
- API documentation
- Authentication keys
- CORS configuration
- API rate limits
- Endpoint changes

### Development Team
For integration issues, contact your development team with:
- Browser console errors
- Network request details (from DevTools)
- Steps to reproduce the issue

## 🔗 Related Files

- `script.js` - Main integration code
- `delivergate-api-config.js` - Standalone API configuration
- `menu-api.json` - Fallback local data
- `index.html` - Menu container markup
- `MENU-API-README.md` - General API integration guide

