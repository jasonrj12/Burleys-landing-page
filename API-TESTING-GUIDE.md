# API Testing & Troubleshooting Guide

## 🧪 Quick Test Steps

### 1. Test API Endpoints Directly

Open these URLs in your browser to see raw API responses:

**Categories API:**
```
https://pos-dev.delivergate.com/api/v1/webshop/categories/webshop-brand/1/shop/2
```

**Menu Items API (Category 65):**
```
https://pos-dev.delivergate.com/api/v1/webshop/main-menu/65/categories/webshop-brand/1/shop/2
```

### 2. Test in Browser Console

Open your website, press F12, go to Console tab, and run:

```javascript
// Test fetch directly
fetch('https://pos-dev.delivergate.com/api/v1/webshop/main-menu/65/categories/webshop-brand/1/shop/2')
  .then(res => res.json())
  .then(data => console.log('API Response:', data))
  .catch(err => console.error('API Error:', err));
```

### 3. Check Network Requests

1. Open DevTools (F12)
2. Go to **Network** tab
3. Reload the page
4. Look for request to Delivergate API
5. Check:
   - Status code (should be 200)
   - Response data
   - Headers
   - Timing

## 🔍 Common API Response Formats

### Format 1: Direct Array
```json
[
  {
    "id": 1,
    "name": "Burger",
    "price": 1500
  }
]
```

### Format 2: Wrapped in Data Object
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "name": "Burger"
    }
  ]
}
```

### Format 3: Nested Structure
```json
{
  "success": true,
  "result": {
    "items": [...]
  }
}
```

## ⚠️ Error Messages & Solutions

### Error: "CORS policy blocked"
**Symptom:** Red error in console mentioning CORS

**Solution 1:** Contact Delivergate to whitelist your domain
```
Your domain: https://burleys.netlify.app
```

**Solution 2:** Use backend proxy
```javascript
// Instead of calling API directly:
const response = await fetch('/api/menu'); // Your backend proxies to Delivergate
```

### Error: "Failed to fetch"
**Possible Causes:**
1. No internet connection
2. API server is down
3. Firewall blocking request
4. Invalid URL

**Solution:** Check browser console for specific error

### Error: "Request timeout"
**Symptom:** Request takes >10 seconds

**Solution:** Increase timeout
```javascript
// In script.js line 412
timeout: 20000  // 20 seconds
```

### Error: "Invalid API response format"
**Symptom:** API returns data but rendering fails

**Solution:** Check actual API structure
```javascript
// Add logging to see actual structure
console.log('Raw API data:', apiData);
console.log('Data type:', typeof apiData);
console.log('Is array?', Array.isArray(apiData));
```

## 🔧 API Configuration Testing

### Test Different Categories

```javascript
// In browser console or temporarily in script.js

// Test category 1
loadFeaturedMenu(1);

// Test category 65
loadFeaturedMenu(65);

// Test category 100
loadFeaturedMenu(100);
```

### Test Different Shops

```javascript
// Temporarily modify DELIVERGATE_API config
DELIVERGATE_API.shop = 3;  // Test shop 3
DELIVERGATE_API.webshopBrand = 2;  // Test brand 2
loadFeaturedMenu();
```

## 📊 Response Data Validation

### Check Required Fields

Add this validation function:

```javascript
function validateMenuItem(item) {
  const required = ['id', 'name', 'price'];
  const missing = required.filter(field => !item[field]);
  
  if (missing.length > 0) {
    console.warn('Missing fields:', missing, 'in item:', item);
    return false;
  }
  return true;
}

// Use in processDelivergateData
function processDelivergateData(apiData) {
  return apiData
    .filter(validateMenuItem)
    .map(item => ({...}));
}
```

## 🐛 Debug Mode

### Enable Detailed Logging

Add this at the top of loadFeaturedMenu():

```javascript
const DEBUG = true;

if (DEBUG) {
  console.log('=== MENU LOAD START ===');
  console.log('API URL:', menuURL);
}

// After fetch
if (DEBUG) {
  console.log('API Response:', apiData);
  console.log('Response type:', typeof apiData);
  console.log('Is array?', Array.isArray(apiData));
  if (apiData) {
    console.log('Keys:', Object.keys(apiData));
    console.log('First item:', apiData[0] || apiData.data?.[0]);
  }
}
```

## 🔄 Testing Fallback Mechanism

### Force Fallback to Local Data

```javascript
// Option 1: Temporarily break API URL
const menuURL = 'https://invalid-url.com/api';

// Option 2: Throw error before API call
throw new Error('Testing fallback');

// Option 3: Mock network error
window.fetch = () => Promise.reject(new Error('Network error'));
```

## 📈 Performance Testing

### Measure API Response Time

```javascript
async function loadFeaturedMenu() {
  const startTime = performance.now();
  
  try {
    const apiData = await DELIVERGATE_API.fetchWithTimeout(menuURL);
    const endTime = performance.now();
    
    console.log(`API Response Time: ${(endTime - startTime).toFixed(2)}ms`);
    
    // Rest of code...
  }
}
```

### Expected Response Times
- ✅ Good: < 500ms
- ⚠️ Acceptable: 500ms - 2000ms
- ❌ Slow: > 2000ms

## 🧪 Sample API Responses for Testing

### Create Mock Data for Testing

```javascript
// Add this before trying real API
const mockData = [
  {
    id: 1,
    name: "Test Burger",
    description: "Test description",
    price: 1500,
    image: "images/burger.webp",
    featured: true
  },
  {
    id: 2,
    name: "Test Pizza",
    description: "Another test",
    price: 2000,
    image: "images/pizza.webp",
    featured: true
  }
];

// Use mock data instead of API
renderFeaturedMenu(processDelivergateData(mockData));
```

## 🔐 Testing with Authentication

### If API Requires Auth Token

```javascript
// Test with token
DELIVERGATE_API.fetchWithTimeout(menuURL, {
  headers: {
    'Authorization': 'Bearer YOUR_TEST_TOKEN'
  }
})
.then(data => console.log('Auth test successful:', data))
.catch(err => console.error('Auth test failed:', err));
```

## 📱 Mobile Testing

### Test on Different Devices

1. **Chrome DevTools Device Emulation:**
   - F12 → Click device icon
   - Test iPhone, iPad, Android

2. **Real Device Testing:**
   - Get local network IP
   - Access from phone: `http://192.168.1.x:3000`

3. **Check Mobile-Specific Issues:**
   - Slower network
   - Touch interactions
   - Smaller images

## 🚀 Production Readiness Checklist

- [ ] API endpoints return correct data
- [ ] All images load properly
- [ ] Error states display correctly
- [ ] Fallback works as expected
- [ ] Loading states are smooth
- [ ] No console errors
- [ ] CORS is configured
- [ ] API response time is acceptable
- [ ] Mobile display is correct
- [ ] Authentication is secure (if used)

## 📞 Getting Help

### Information to Provide

When reporting issues, include:

1. **Console Errors:**
   ```
   Copy full error from browser console
   ```

2. **Network Request:**
   - Request URL
   - Response status
   - Response body

3. **Browser Info:**
   - Browser name & version
   - Operating system

4. **Steps to Reproduce:**
   - What you clicked
   - What you expected
   - What actually happened

### Useful Commands

```javascript
// Get current configuration
console.log('API Config:', DELIVERGATE_API);

// Test menu reload
loadFeaturedMenu();

// Check menu container state
console.log('Menu container:', document.getElementById('menuContainer').innerHTML);
```

## 🔗 Resources

- [Fetch API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [CORS Explained](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Chrome DevTools Network](https://developer.chrome.com/docs/devtools/network/)
- [JSON Validator](https://jsonlint.com/)

