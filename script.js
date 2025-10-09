// script.js - Fixed and Optimized

// 2. Featured Menu Carousel
const carouselTrack = document.querySelector('.carousel-track');
const carouselItems = document.querySelectorAll('.carousel-item');
const prevBtn = document.getElementById('carouselPrev');
const nextBtn = document.getElementById('carouselNext');
let carouselIndex = 0;
let mobileCarouselInterval = null;

function isMobile() {
  return window.innerWidth <= 600;
}

function updateCarousel(options = { scroll: true }) {
  if (isMobile()) {
    // Remove active from all, add to current
    carouselItems.forEach((item, idx) => {
      item.classList.toggle('active', idx === carouselIndex);
    });
    // On mobile, use scroll instead of transform
    const item = carouselItems[carouselIndex];
    if (item && options.scroll) {
      // Only scroll the carousel, not the whole page
      carouselTrack.scrollTo({
        left: item.offsetLeft - carouselTrack.offsetLeft,
        behavior: 'smooth'
      });
    }
  } else {
    // Remove active from all on desktop
    carouselItems.forEach(item => item.classList.remove('active'));
    const visibleItems = 2;
    const gap = 32; // px, matches .carousel-track gap
    const itemWidth = carouselItems[0].offsetWidth;
    const offset = -carouselIndex * (itemWidth + gap);
    carouselTrack.style.transform = `translateX(${offset}px)`;
  }
}

function startMobileCarouselAutoSlide() {
  if (mobileCarouselInterval) clearInterval(mobileCarouselInterval);
  if (!isMobile()) return;
  mobileCarouselInterval = setInterval(() => {
    carouselIndex = (carouselIndex + 1) % carouselItems.length;
    updateCarousel({ scroll: true });
  }, 2500);
}

function stopMobileCarouselAutoSlide() {
  if (mobileCarouselInterval) {
    clearInterval(mobileCarouselInterval);
    mobileCarouselInterval = null;
  }
}

if (prevBtn && nextBtn && carouselTrack && carouselItems.length > 0) {
  prevBtn.addEventListener('click', () => {
    stopMobileCarouselAutoSlide();
    carouselIndex = Math.max(0, carouselIndex - 1);
    updateCarousel({ scroll: true });
    if (isMobile()) startMobileCarouselAutoSlide();
  });
  
  nextBtn.addEventListener('click', () => {
    stopMobileCarouselAutoSlide();
    const visibleItems = 2;
    const maxIndex = isMobile() ? carouselItems.length - 1 : Math.max(0, carouselItems.length - visibleItems);
    carouselIndex = Math.min(maxIndex, carouselIndex + 1);
    updateCarousel({ scroll: true });
    if (isMobile()) startMobileCarouselAutoSlide();
  });
}

window.addEventListener('resize', () => {
  if (mobileCarouselInterval) clearInterval(mobileCarouselInterval);
  if (isMobile()) startMobileCarouselAutoSlide();
});

// Initialize carousel on page load
document.addEventListener('DOMContentLoaded', () => {
  if (carouselTrack && carouselItems.length > 0) {
    updateCarousel({ scroll: false }); // Set initial position without scrolling
    if (isMobile()) {
      startMobileCarouselAutoSlide();
    }
  }
});

// 3. Newsletter Signup
const newsletterForm = document.getElementById('newsletterForm');
const newsletterEmail = document.getElementById('newsletterEmail');
const newsletterMsg = document.getElementById('newsletterMsg');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = newsletterEmail.value.trim();
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      newsletterMsg.textContent = 'Please enter a valid email address.';
      return;
    }
    newsletterMsg.textContent = 'Thank you for subscribing!';
    newsletterEmail.value = '';
    setTimeout(() => newsletterMsg.textContent = '', 4000);
  });
}

// 4. Global navigation behaviour
function initNavigation() {
  const hamburgerBtn = document.getElementById('hamburger');
  const navLinksContainer = document.querySelector('.nav-links');

  if (!hamburgerBtn || !navLinksContainer) {
    return;
  }

  const navAnchors = navLinksContainer.querySelectorAll('.nav-link');
  const hamburgerIcon = hamburgerBtn.querySelector('i');

  const setHamburgerState = (isOpen) => {
    hamburgerBtn.classList.toggle('active', isOpen);
    hamburgerBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    if (hamburgerIcon) {
      hamburgerIcon.className = isOpen ? 'fas fa-times' : 'fas fa-bars';
    }
  };

  const closeMenu = () => {
    navLinksContainer.classList.remove('open');
    setHamburgerState(false);
  };

  const toggleMenu = () => {
    const isOpen = navLinksContainer.classList.toggle('open');
    setHamburgerState(isOpen);
  };

  hamburgerBtn.setAttribute('aria-expanded', 'false');

  hamburgerBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    toggleMenu();
  });

  navLinksContainer.addEventListener('click', (event) => {
    event.stopPropagation();
  });

  navAnchors.forEach((link) => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  document.addEventListener('click', (event) => {
    if (!navLinksContainer.contains(event.target) && !hamburgerBtn.contains(event.target)) {
      closeMenu();
    }
  });

  document.addEventListener('keyup', (event) => {
    if (event.key === 'Escape') {
      closeMenu();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth >= 900) {
      closeMenu();
    }
  });

  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  navAnchors.forEach((link) => {
    const href = link.getAttribute('href');
    if (!href) {
      return;
    }
    if (href === currentPage) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });

  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  anchorLinks.forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
      const targetSelector = anchor.getAttribute('href');
      if (!targetSelector || targetSelector === '#') {
        return;
      }
      const target = document.querySelector(targetSelector);
      if (target) {
        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        closeMenu();
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', initNavigation);

// 5. Dynamic Google Reviews Carousel
let reviews = [];
let reviewIndex = 0;
const reviewSlide = document.getElementById('reviewSlide');
const reviewPrev = document.getElementById('reviewPrev');
const reviewNext = document.getElementById('reviewNext');
let reviewInterval = null;
let googleReviewsAPI = null;

// Initialize Google Reviews API
async function initializeGoogleReviews() {
  try {
    // Check if Google Reviews config is available
    if (typeof GOOGLE_REVIEWS_CONFIG === 'undefined' || typeof GoogleReviewsAPI === 'undefined') {
      console.warn('⚠️ Google Reviews API not configured. Using fallback reviews.');
      
      // Use fallback reviews
      reviews = [
        {
          text: "Hands down the best burgers in Sri Lanka – juicy and packed with flavour!",
          name: "Kasun",
          stars: 5,
          verified: false
        },
        {
          text: "Like Five Guys, but with a Sri Lankan twist. Absolutely worth it!",
          name: "Dilshan",
          stars: 5,
          verified: false
        },
        {
          text: "Didn't expect such top-quality burgers here. Totally impressed!",
          name: "Ruwan",
          stars: 4,
          verified: false
        },
        {
          text: "Fresh ingredients, amazing taste, and a proper local vibe.",
          name: "Shalini",
          stars: 5,
          verified: false
        },
        {
          text: "Crispy fries, juicy patties, and the sauces are next level. Coming back for sure!",
          name: "Nadeesha",
          stars: 5,
          verified: false
        },
        {
          text: "Great value for money and the friendliest staff in Burleys.",
          name: "Tharindu",
          stars: 4,
          verified: false
        }
      ];
      
      if (reviewSlide) {
        renderReview(reviewIndex);
        startReviewAutoSlide();
      }
      return;
    }

    // Initialize Google Reviews API
    googleReviewsAPI = new GoogleReviewsAPI(GOOGLE_REVIEWS_CONFIG);
    
    // Show loading state
    if (reviewSlide) {
      reviewSlide.innerHTML = `
        <div class="review-loading">
          <i class="fas fa-spinner fa-spin" style="font-size: 2rem; color: #fa9f1b;"></i>
          <p style="margin-top: 1rem; color: #666;">Loading reviews from Google...</p>
        </div>
      `;
    }

    // Fetch Google reviews
    reviews = await googleReviewsAPI.getFormattedReviews();
    
    console.log(`✅ Loaded ${reviews.length} Google reviews`);

    // Start carousel
    if (reviewSlide && reviews.length > 0) {
      renderReview(reviewIndex);
      startReviewAutoSlide();
    }

  } catch (error) {
    console.error('❌ Error initializing Google reviews:', error);
    
    // Use fallback reviews on error
    reviews = GOOGLE_REVIEWS_CONFIG?.fallbackReviews || [
      {
        text: "Hands down the best burgers in Sri Lanka – juicy and packed with flavour!",
        name: "Kasun",
        stars: 5,
        verified: false
      }
    ];
    
    if (reviewSlide) {
      renderReview(reviewIndex);
      startReviewAutoSlide();
    }
  }
}

// Render a single review
function renderReview(idx) {
  if (!reviewSlide || !reviews || reviews.length === 0) return;
  
  const review = reviews[idx];
  const stars = '★'.repeat(review.stars) + '☆'.repeat(5 - review.stars);
  
  // Build profile photo HTML
  const profilePhotoHTML = review.profilePhoto 
    ? `<img src="${review.profilePhoto}" alt="${review.name}" class="review-profile-photo" onerror="this.style.display='none'" />`
    : '';
  
  // Build verified badge HTML
  const verifiedBadgeHTML = review.verified 
    ? `<span class="review-verified-badge" title="Verified Google Review">
         <i class="fab fa-google"></i> Verified
       </span>`
    : '';
  
  // Format time if available
  const timeHTML = review.time 
    ? `<span class="review-time">${formatReviewTime(review.time)}</span>`
    : '';
  
  reviewSlide.innerHTML = `
    <div class="review-stars">${stars}</div>
    <div class="review-text">"${review.text}"</div>
    <div class="review-author">
      ${profilePhotoHTML}
      <div class="review-author-info">
        <span class="review-name">- ${review.name}</span>
        ${verifiedBadgeHTML}
        ${timeHTML}
      </div>
    </div>
  `;
  
  // Fade in animation
  reviewSlide.style.opacity = 0;
  setTimeout(() => { reviewSlide.style.opacity = 1; }, 50);
}

// Format review time (relative time)
function formatReviewTime(timestamp) {
  const now = Math.floor(Date.now() / 1000);
  const diff = now - timestamp;
  
  const minute = 60;
  const hour = minute * 60;
  const day = hour * 24;
  const week = day * 7;
  const month = day * 30;
  const year = day * 365;
  
  if (diff < minute) return 'Just now';
  if (diff < hour) return `${Math.floor(diff / minute)} minutes ago`;
  if (diff < day) return `${Math.floor(diff / hour)} hours ago`;
  if (diff < week) return `${Math.floor(diff / day)} days ago`;
  if (diff < month) return `${Math.floor(diff / week)} weeks ago`;
  if (diff < year) return `${Math.floor(diff / month)} months ago`;
  return `${Math.floor(diff / year)} years ago`;
}

// Auto-slide reviews
function startReviewAutoSlide() {
  if (reviewInterval) clearInterval(reviewInterval);
  if (!reviews || reviews.length === 0) return;
  
  reviewInterval = setInterval(() => {
    reviewIndex = (reviewIndex + 1) % reviews.length;
    renderReview(reviewIndex);
  }, 5000); // Changed to 5 seconds for longer read time
}

// Stop auto-slide
function stopReviewAutoSlide() {
  if (reviewInterval) clearInterval(reviewInterval);
}

// Navigation button handlers
if (reviewPrev) {
  reviewPrev.addEventListener('click', () => {
    stopReviewAutoSlide();
    reviewIndex = (reviewIndex - 1 + reviews.length) % reviews.length;
    renderReview(reviewIndex);
    startReviewAutoSlide();
  });
}

if (reviewNext) {
  reviewNext.addEventListener('click', () => {
    stopReviewAutoSlide();
    reviewIndex = (reviewIndex + 1) % reviews.length;
    renderReview(reviewIndex);
    startReviewAutoSlide();
  });
}

// Initialize reviews when DOM is ready
if (reviewSlide) {
  document.addEventListener('DOMContentLoaded', () => {
    initializeGoogleReviews();
  });
}

// Loading Screen and Modal Logic
document.addEventListener('DOMContentLoaded', function() {
  const loadingScreen = document.getElementById('loadingScreen');
  const modalOverlay = document.getElementById('modalOverlay');
  const modalClose = document.getElementById('modalClose');
  const mainContent = document.getElementById('mainContent');
  
  if (!loadingScreen || !modalOverlay || !modalClose || !mainContent) return;
  
  // Modal Image Carousel Variables
  const modalImages = document.querySelectorAll('.modal-image');
  const indicators = document.querySelectorAll('.indicator');
  let currentImageIndex = 0;
  let imageInterval;

  // Image Carousel Function
  function showImage(index) {
    // Remove active class from all images and indicators
    modalImages.forEach(img => img.classList.remove('active'));
    indicators.forEach(ind => ind.classList.remove('active'));
    
    // Add active class to current image and indicator
    if (modalImages[index]) modalImages[index].classList.add('active');
    if (indicators[index]) indicators[index].classList.add('active');
  }

  // Auto-advance images every 3 seconds
  function startImageCarousel() {
    if (imageInterval) clearInterval(imageInterval);
    imageInterval = setInterval(() => {
      currentImageIndex = (currentImageIndex + 1) % modalImages.length;
      showImage(currentImageIndex);
    }, 3000);
  }

  // Stop image carousel
  function stopImageCarousel() {
    if (imageInterval) {
      clearInterval(imageInterval);
    }
  }

  // Indicator click handlers
  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
      currentImageIndex = index;
      showImage(currentImageIndex);
      
      // Restart the interval
      stopImageCarousel();
      startImageCarousel();
    });
  });

  // Simulate loading time
  setTimeout(() => {
    // Hide loading screen
    loadingScreen.classList.add('hidden');
    
    // Show main content
    setTimeout(() => {
      mainContent.classList.add('visible');
      
      // Show modal after a brief delay
      setTimeout(() => {
        modalOverlay.classList.add('active');
        // Start image carousel when modal opens (only if images exist)
        if (modalImages.length > 0) {
          startImageCarousel();
        }
      }, 500);
    }, 300);
  }, 2500); // 2.5 seconds loading time

  // Close modal functionality
  function closeModal() {
    modalOverlay.classList.remove('active');
    // Stop image carousel when modal closes
    stopImageCarousel();
  }

  modalClose.addEventListener('click', closeModal);
  
  // Close modal when clicking outside
  modalOverlay.addEventListener('click', function(e) {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });

  // Close modal with Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });
});

document.addEventListener('copy', event => event.preventDefault()); 

// Back to Top Button
const backToTopBtn = document.getElementById("backToTop");

if (backToTopBtn) {
  // Show button on scroll
  window.onscroll = function() {
    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
      backToTopBtn.style.display = "block";
    } else {
      backToTopBtn.style.display = "none";
    }
  };

  // Smooth scroll to top
  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Delivergate API Configuration (Inline)
const DELIVERGATE_API = {
  baseURL: 'https://pos.delivergate.com/api/v1/webshop',
  categoryId: 5, // Main menu category ID
  webshopBrand: 1,
  shop: 1,
  tenantCode: 'burleys',
  timeout: 10000,
  useLocalFallback: true, // Set to false to force API-only mode
  
  // Build API URLs
  getCategoriesURL() {
    return `${this.baseURL}/categories/webshop-brand/${this.webshopBrand}/shop/${this.shop}`;
  },
  
  getMenuURL(categoryId) {
    if (!categoryId) {
      throw new Error('Category ID is required');
    }
    return `${this.baseURL}/main-menu/${categoryId}/categories/webshop-brand/${this.webshopBrand}/shop/${this.shop}`;
  },
  
  // Fetch with timeout
  async fetchWithTimeout(url, options = {}) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        mode: 'cors',
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json',
          'origin': 'https://burleys-webshop.delivergate.com',
          'referer': 'https://burleys-webshop.delivergate.com/',
          'x-tenant-code': this.tenantCode,
          ...options.headers
        }
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorText = await response.text().catch(() => response.statusText);
        throw new Error(`API Error ${response.status}: ${errorText || response.statusText}\nURL: ${url}`);
      }
      
      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('Request timeout - please try again');
      }
      throw error;
    }
  },
  
  // Test and get valid categories
  async getValidCategories() {
    try {
      const url = this.getCategoriesURL();
      console.log('Fetching categories from:', url);
      const categories = await this.fetchWithTimeout(url);
      console.log('Available categories:', categories);
      return categories;
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      return null;
    }
  }
};

// Featured Menu API Integration
async function loadFeaturedMenu(forceCategoryId = null) {
  const menuContainer = document.getElementById('menuContainer');
  const menuLoading = document.getElementById('menuLoading');
  const menuError = document.getElementById('menuError');

  if (!menuContainer || !menuLoading || !menuError) return;

  // Show loading state
  menuLoading.style.display = 'block';
  menuContainer.style.display = 'none';
  menuError.style.display = 'none';

  try {
    // Use forced category ID, or default to configured category ID
    let categoryId = forceCategoryId || DELIVERGATE_API.categoryId;
    console.log(`📌 Using category ID: ${categoryId}`);

    // Try Delivergate API with category ID
    const menuURL = DELIVERGATE_API.getMenuURL(categoryId);
    console.log('📡 Fetching menu from:', menuURL);
    
    const apiData = await DELIVERGATE_API.fetchWithTimeout(menuURL);
    console.log('📦 API Response received:', apiData);
    
    // Process Delivergate API response
    let menuItems = [];
    
    // Handle categorized data structure: { data: { "Category Name": [items], ... } }
    if (apiData && apiData.data && typeof apiData.data === 'object' && !Array.isArray(apiData.data)) {
      console.log('Processing categorized menu structure...');
      Object.entries(apiData.data).forEach(([categoryName, items]) => {
        if (Array.isArray(items)) {
          items.forEach(item => {
            menuItems.push({
              id: item.id || item.item_id || item.product_id,
              name: item.title || item.name || item.item_name || 'Unknown Item',
              description: item.description || item.item_description || '',
              price: formatAPIPrice(item.price || item.item_price || item.selling_price || 0),
              image: item.image_url || item.image || item.item_image || 'images/placeholder.webp',
              category: categoryName,
              featured: true
            });
          });
        }
      });
    } else if (apiData && Array.isArray(apiData)) {
      menuItems = processDelivergateData(apiData);
    } else if (apiData && apiData.data && Array.isArray(apiData.data)) {
      menuItems = processDelivergateData(apiData.data);
    } else if (apiData && apiData.items && Array.isArray(apiData.items)) {
      menuItems = processDelivergateData(apiData.items);
    } else if (apiData) {
      // Try to process single item or different structure
      menuItems = processDelivergateData([apiData]);
    }
    
    if (menuItems.length > 0) {
      console.log(`✅ Rendering ${menuItems.length} menu items`);
      renderFeaturedMenu(menuItems);
      menuLoading.style.display = 'none';
      menuContainer.style.display = 'grid';
    } else {
      throw new Error('No menu items found in API response');
    }
    
  } catch (error) {
    console.error('❌ Delivergate API Error:', error.message);
    console.error('Full error:', error);
    
    // Fallback to local JSON if enabled
    if (DELIVERGATE_API.useLocalFallback) {
      try {
        console.log('🔄 Falling back to local menu data...');
        const response = await fetch('menu-api.json');
        
        if (!response.ok) {
          throw new Error('Failed to fetch local menu');
        }

        const data = await response.json();
        
        if (data.status === 'success' && data.data.featured_items) {
          console.log('✅ Local menu loaded successfully');
          renderFeaturedMenu(data.data.featured_items);
          menuLoading.style.display = 'none';
          menuContainer.style.display = 'grid';
        } else {
          throw new Error('Invalid local data format');
        }
      } catch (fallbackError) {
        console.error('❌ Fallback Error:', fallbackError);
        showErrorMessage(menuError, error.message);
        menuLoading.style.display = 'none';
        menuError.style.display = 'block';
      }
    } else {
      showErrorMessage(menuError, error.message);
      menuLoading.style.display = 'none';
      menuError.style.display = 'block';
    }
  }
}

// Show detailed error message
function showErrorMessage(errorElement, message) {
  if (errorElement) {
    const errorHTML = `
      <p style="color: #d32f2f; font-weight: 600;">⚠️ Failed to load menu items</p>
      <p style="color: #666; font-size: 0.9rem; margin-top: 0.5rem;">${message}</p>
      <button onclick="loadFeaturedMenu()" style="margin-top: 1rem; padding: 0.5rem 1.5rem; background: #fa9f1b; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">Retry</button>
      <button onclick="testDelivergateAPI()" style="margin-top: 1rem; margin-left: 0.5rem; padding: 0.5rem 1.5rem; background: #2196F3; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">Test API</button>
    `;
    errorElement.innerHTML = errorHTML;
  }
}

// Format price from API
function formatAPIPrice(price) {
  if (typeof price === 'string') {
    // Remove any existing formatting
    price = price.replace(/[^0-9.]/g, '');
  }
  const numPrice = parseFloat(price);
  if (isNaN(numPrice)) return '0.00';
  return numPrice.toFixed(2);
}

// Process Delivergate API data to match our format
function processDelivergateData(apiData) {
  return apiData.map(item => {
    // Handle different possible API structures
    return {
      id: item.id || item.item_id || item.product_id,
      name: item.name || item.item_name || item.product_name || 'Unnamed Item',
      description: item.description || item.item_description || '',
      price: formatPrice(item.price || item.item_price || item.selling_price || 0),
      image: getImageURL(item.image || item.item_image || item.photo_url),
      category: item.category || item.category_name || 'general',
      featured: item.featured || item.is_featured || true
    };
  });
}

// Format price for display
function formatPrice(price) {
  const numPrice = parseFloat(price);
  if (isNaN(numPrice)) return '0.00';
  return numPrice.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Get proper image URL
function getImageURL(imagePath) {
  if (!imagePath) return 'images/placeholder.webp';
  
  // If it's already a full URL, return it
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // If it's a relative path, prepend the images folder
  if (!imagePath.startsWith('images/')) {
    return `images/${imagePath}`;
  }
  
  return imagePath;
}

function renderFeaturedMenu(items) {
  const menuContainer = document.getElementById('menuContainer');
  if (!menuContainer) return;

  // Filter featured items and limit to 8
  const featuredItems = items.filter(item => item.featured !== false).slice(0, 8);

  // Split items into two columns
  const midpoint = Math.ceil(featuredItems.length / 2);
  const leftColumn = featuredItems.slice(0, midpoint);
  const rightColumn = featuredItems.slice(midpoint);

  // Create HTML for menu items
  const createMenuItem = (item) => `
    <div class="menu-item" data-id="${item.id}">
      <img src="${item.image}" 
           alt="${item.name}" 
           loading="lazy" 
           onerror="this.src='images/placeholder.webp'" />
      <div class="menu-info">
        <h3>${item.name}</h3>
        <p>${item.description || ''}</p>
      </div>
      <div class="menu-price">LKR${item.price}</div>
    </div>
  `;

  // Render both columns
  menuContainer.innerHTML = `
    <div class="menu-column">
      ${leftColumn.map(createMenuItem).join('')}
    </div>
    <div class="menu-column">
      ${rightColumn.map(createMenuItem).join('')}
    </div>
  `;
}

// Test Delivergate API function
async function testDelivergateAPI() {
  console.log('🧪 === API DIAGNOSTIC TEST ===');
  console.log('Configuration:', {
    baseURL: DELIVERGATE_API.baseURL,
    webshopBrand: DELIVERGATE_API.webshopBrand,
    shop: DELIVERGATE_API.shop
  });
  
  // Test 1: Categories endpoint
  console.log('\n📋 Test 1: Fetching Categories');
  const categoriesURL = DELIVERGATE_API.getCategoriesURL();
  console.log('URL:', categoriesURL);
  
  try {
    const categoriesResponse = await fetch(categoriesURL);
    console.log('Status:', categoriesResponse.status, categoriesResponse.statusText);
    
    if (categoriesResponse.ok) {
      const categoriesData = await categoriesResponse.json();
      console.log('✅ Categories Response:', categoriesData);
      
      // Extract category IDs
      if (Array.isArray(categoriesData)) {
        console.log('📁 Available Category IDs:', categoriesData.map(c => ({
          id: c.id || c.category_id,
          name: c.name || c.category_name
        })));
        
        // Test menu endpoint with first category
        if (categoriesData.length > 0) {
          const testCategoryId = categoriesData[0].id || categoriesData[0].category_id;
          console.log(`\n🍔 Test 2: Fetching Menu for Category ${testCategoryId}`);
          const menuURL = DELIVERGATE_API.getMenuURL(testCategoryId);
          console.log('URL:', menuURL);
          
          try {
            const menuResponse = await fetch(menuURL);
            console.log('Status:', menuResponse.status, menuResponse.statusText);
            
            if (menuResponse.ok) {
              const menuData = await menuResponse.json();
              console.log('✅ Menu Response:', menuData);
              console.log('Item count:', Array.isArray(menuData) ? menuData.length : 'Not an array');
            } else {
              const errorText = await menuResponse.text();
              console.error('❌ Menu Error:', errorText);
            }
          } catch (menuError) {
            console.error('❌ Menu Fetch Error:', menuError);
          }
        }
      } else if (categoriesData.data) {
        console.log('✅ Categories (wrapped):', categoriesData.data);
      }
    } else {
      const errorText = await categoriesResponse.text();
      console.error('❌ Categories Error:', errorText);
    }
  } catch (error) {
    console.error('❌ Categories Fetch Error:', error);
  }
  
  console.log('\n💡 Tip: Check the console above for detailed API responses');
  console.log('If you see valid category IDs, use one in loadFeaturedMenu(categoryId)');
}

// Load menu when page loads
// Note: Homepage now uses static featured menu (index.html)
// API integration is active only on menu.html page
// Uncomment below to re-enable API for homepage:
// document.addEventListener('DOMContentLoaded', () => {
//   loadFeaturedMenu();
// });

// Scroll Progress Bar
function updateScrollProgress() {
  const scrollProgressBar = document.getElementById('scrollProgressBar');
  if (!scrollProgressBar) return;
  
  const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (winScroll / height) * 100;
  
  scrollProgressBar.style.width = scrolled + "%";
}

// Update progress on scroll
window.addEventListener('scroll', updateScrollProgress);

// Initialize on load
document.addEventListener('DOMContentLoaded', updateScrollProgress);

// Console Signature
(() => {
  const titleStyle = [
    "font-size:20px",
    "font-weight:700",
    "color:#fff",
    "padding:10px 18px",
    "border-radius:8px",
    "background: linear-gradient(90deg,#3f1e27 0%, #b22222 100%)"
  ].join(";");

  console.log("%c🚀 Powered by Delivergate LK | 2025", titleStyle);
})();

