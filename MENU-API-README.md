# Menu API Integration Guide

## Overview
The featured menu on the homepage is now connected to an API, allowing you to dynamically update menu items without modifying the HTML code.

## Files Created/Modified

### 1. `menu-api.json` (NEW)
This JSON file acts as your API endpoint containing all featured menu items.

**Structure:**
```json
{
  "status": "success",
  "data": {
    "featured_items": [
      {
        "id": 1,
        "name": "Item Name",
        "description": "Item description",
        "price": "2,490.00",
        "image": "images/item.webp",
        "category": "burgers",
        "featured": true
      }
    ]
  }
}
```

### 2. `index.html` (MODIFIED)
- Replaced static menu HTML with dynamic containers
- Added loading state indicator
- Added error handling with retry button

### 3. `script.js` (MODIFIED)
Added two new functions:
- `loadFeaturedMenu()` - Fetches menu data from API
- `renderFeaturedMenu(items)` - Renders menu items dynamically

## How It Works

1. **Page Load**: When the page loads, the menu shows a loading spinner
2. **API Call**: JavaScript fetches data from `menu-api.json`
3. **Rendering**: Menu items are dynamically created and displayed
4. **Error Handling**: If the API fails, an error message with retry button appears

## How to Update Menu Items

### Option 1: Using Local JSON File (Current Setup)
Simply edit `menu-api.json` and modify the items:

```json
{
  "id": 9,
  "name": "New Item",
  "description": "Description here",
  "price": "1,500.00",
  "image": "images/new-item.webp",
  "category": "burgers",
  "featured": true
}
```

### Option 2: Using External API
To connect to a real backend API, modify line 421 in `script.js`:

**Before:**
```javascript
const response = await fetch('menu-api.json');
```

**After:**
```javascript
const response = await fetch('https://your-api.com/api/featured-menu');
```

## External API Requirements

If you want to connect to an external API, ensure it returns data in this format:

```json
{
  "status": "success",
  "data": {
    "featured_items": [
      // array of menu items
    ]
  }
}
```

## Adding New Fields

To add additional fields (e.g., calories, spice level):

1. **Add to API response:**
```json
{
  "id": 1,
  "name": "Burger",
  "calories": 650,
  "spice_level": "medium",
  ...
}
```

2. **Update rendering in `script.js`:**
```javascript
const createMenuItem = (item) => `
  <div class="menu-item" data-id="${item.id}">
    <img src="${item.image}" alt="${item.name}" loading="lazy" />
    <div class="menu-info">
      <h3>${item.name}</h3>
      <p>${item.description || ''}</p>
      <span class="calories">${item.calories} cal</span>
    </div>
    <div class="menu-price">LKR${item.price}</div>
  </div>
`;
```

## Benefits

✅ **Easy Updates**: Change menu items without editing HTML
✅ **Centralized Data**: All menu data in one place
✅ **Scalable**: Easy to connect to a real backend later
✅ **Error Handling**: Graceful fallback if API fails
✅ **Loading States**: Better user experience with loading indicators

## Troubleshooting

### Menu Not Loading
1. Check browser console for errors (F12)
2. Ensure `menu-api.json` exists in the root directory
3. Check that the JSON format is valid

### Images Not Showing
1. Verify image paths in `menu-api.json`
2. Ensure images exist in the `images/` folder
3. Check image file names match exactly (case-sensitive)

### Using with Live Server
If testing locally, use a local server (e.g., Live Server extension in VS Code) instead of opening the HTML file directly to avoid CORS issues.

## Future Enhancements

You can further enhance this by:
- Adding search/filter functionality
- Implementing real-time updates via WebSocket
- Adding admin panel to manage menu items
- Integrating with a backend CMS
- Adding animations for menu item changes
- Caching API responses for better performance

## Support

For questions or issues, contact your development team.

