/**
 * =============================================================================
 * EcoMart - Main JavaScript File
 * Author: EcoMart Team
 * Description: This file contains all JavaScript functionality for the EcoMart
 *              website including:
 *              - Mobile navigation toggle
 *              - Form validation
 *              - Product filtering and search
 *              - Dynamic content updates
 *              - Toast notifications
 * =============================================================================
 */

// =============================================================================
// DOCUMENT READY - Wait for DOM to be fully loaded
// =============================================================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('EcoMart website initialized');
    
    // Initialize all modules
    initMobileNavigation();
    initProductFilter();
    initContactForm();
    initNewsletterForm();
    initScrollEffects();
});

// =============================================================================
// MOBILE NAVIGATION
// Handles the mobile menu toggle functionality
// =============================================================================

/**
 * Initialize mobile navigation functionality
 * Toggles the navigation menu visibility on mobile devices
 */
function initMobileNavigation() {
    // Get the mobile menu button and navigation links
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    // Check if elements exist before adding event listeners
    if (mobileMenuBtn && navLinks) {
        // Toggle menu on button click
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            
            // Update button icon (hamburger <-> close)
            const icon = this.querySelector('span');
            if (icon) {
                icon.textContent = navLinks.classList.contains('active') ? '✕' : '☰';
            }
        });
        
        // Close menu when clicking on a link (for smooth navigation)
        navLinks.querySelectorAll('a').forEach(function(link) {
            link.addEventListener('click', function() {
                navLinks.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('span');
                if (icon) {
                    icon.textContent = '☰';
                }
            });
        });
    }
}

// =============================================================================
// PRODUCT FILTERING AND SEARCH
// Allows users to filter and search products on the products page
// =============================================================================

/**
 * Initialize product filter functionality
 * Handles category filtering and search functionality
 */
function initProductFilter() {
    // Get filter elements
    const filterButtons = document.querySelectorAll('.filter-btn');
    const searchInput = document.querySelector('.search-box input');
    const productCards = document.querySelectorAll('.product-card');
    
    // Check if we're on the products page
    if (!filterButtons.length || !productCards.length) {
        return; // Exit if not on products page
    }
    
    /**
     * Filter products by category
     * @param {string} category - The category to filter by ('all' shows all products)
     */
    function filterByCategory(category) {
        productCards.forEach(function(card) {
            // Get the category from the data attribute
            const cardCategory = card.dataset.category;
            
            // Show/hide based on category match
            if (category === 'all' || cardCategory === category) {
                card.style.display = 'block';
                card.classList.add('animate-fade-in');
            } else {
                card.style.display = 'none';
            }
        });
    }
    
    /**
     * Filter products by search term
     * @param {string} searchTerm - The search term to filter by
     */
    function filterBySearch(searchTerm) {
        const term = searchTerm.toLowerCase().trim();
        
        productCards.forEach(function(card) {
            // Get product name and description
            const name = card.querySelector('.card-title').textContent.toLowerCase();
            const description = card.querySelector('.card-description').textContent.toLowerCase();
            
            // Show/hide based on search match
            if (name.includes(term) || description.includes(term)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }
    
    // Add click event to filter buttons
    filterButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(function(btn) {
                btn.classList.remove('active');
            });
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get category and filter
            const category = this.dataset.category;
            filterByCategory(category);
            
            // Clear search input when using category filter
            if (searchInput) {
                searchInput.value = '';
            }
        });
    });
    
    // Add input event to search box
    if (searchInput) {
        // Use debounce for better performance
        let searchTimeout;
        
        searchInput.addEventListener('input', function() {
            // Clear previous timeout
            clearTimeout(searchTimeout);
            
            // Set new timeout for search (debounce)
            searchTimeout = setTimeout(function() {
                filterBySearch(searchInput.value);
                
                // Reset category filter buttons
                filterButtons.forEach(function(btn) {
                    btn.classList.remove('active');
                });
                filterButtons[0].classList.add('active'); // Select 'All' button
            }, 300); // 300ms delay
        });
    }
}

// =============================================================================
// FORM VALIDATION
// Validates contact form inputs before submission
// =============================================================================

/**
 * Initialize contact form validation
 * Validates all required fields and displays error messages
 */
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    // Check if contact form exists
    if (!contactForm) {
        return; // Exit if not on contact page
    }
    
    /**
     * Validate email format using regex
     * @param {string} email - The email address to validate
     * @returns {boolean} - True if valid, false otherwise
     */
    function isValidEmail(email) {
        // Regular expression for email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    /**
     * Validate phone number format
     * @param {string} phone - The phone number to validate
     * @returns {boolean} - True if valid, false otherwise
     */
    function isValidPhone(phone) {
        // Allow empty phone (optional field)
        if (!phone) return true;
        
        // Regular expression for phone validation (accepts various formats)
        const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
        return phoneRegex.test(phone);
    }
    
    /**
     * Show error message for a form field
     * @param {HTMLElement} input - The input element
     * @param {string} message - The error message to display
     */
    function showError(input, message) {
        const formGroup = input.closest('.form-group');
        formGroup.classList.add('error');
        
        // Create or update error message element
        let errorElement = formGroup.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('span');
            errorElement.className = 'error-message';
            formGroup.appendChild(errorElement);
        }
        errorElement.textContent = message;
    }
    
    /**
     * Clear error message for a form field
     * @param {HTMLElement} input - The input element
     */
    function clearError(input) {
        const formGroup = input.closest('.form-group');
        formGroup.classList.remove('error');
    }
    
    /**
     * Validate the entire form
     * @returns {boolean} - True if form is valid, false otherwise
     */
    function validateForm() {
        let isValid = true;
        
        // Get form fields
        const nameInput = contactForm.querySelector('#name');
        const emailInput = contactForm.querySelector('#email');
        const phoneInput = contactForm.querySelector('#phone');
        const subjectInput = contactForm.querySelector('#subject');
        const messageInput = contactForm.querySelector('#message');
        
        // Validate name (required, min 2 characters)
        if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
            showError(nameInput, 'Please enter your full name (at least 2 characters)');
            isValid = false;
        } else {
            clearError(nameInput);
        }
        
        // Validate email (required, valid format)
        if (!emailInput.value.trim()) {
            showError(emailInput, 'Please enter your email address');
            isValid = false;
        } else if (!isValidEmail(emailInput.value.trim())) {
            showError(emailInput, 'Please enter a valid email address');
            isValid = false;
        } else {
            clearError(emailInput);
        }
        
        // Validate phone (optional, but if provided must be valid)
        if (phoneInput && phoneInput.value.trim() && !isValidPhone(phoneInput.value.trim())) {
            showError(phoneInput, 'Please enter a valid phone number');
            isValid = false;
        } else if (phoneInput) {
            clearError(phoneInput);
        }
        
        // Validate subject (required)
        if (subjectInput && !subjectInput.value) {
            showError(subjectInput, 'Please select a subject');
            isValid = false;
        } else if (subjectInput) {
            clearError(subjectInput);
        }
        
        // Validate message (required, min 10 characters)
        if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
            showError(messageInput, 'Please enter a message (at least 10 characters)');
            isValid = false;
        } else {
            clearError(messageInput);
        }
        
        return isValid;
    }
    
    // Add real-time validation on input blur
    const inputs = contactForm.querySelectorAll('input, textarea, select');
    inputs.forEach(function(input) {
        input.addEventListener('blur', function() {
            // Validate individual field on blur
            if (this.id === 'name' && this.value.trim().length < 2) {
                showError(this, 'Please enter your full name (at least 2 characters)');
            } else if (this.id === 'email' && !isValidEmail(this.value.trim())) {
                showError(this, 'Please enter a valid email address');
            } else {
                clearError(this);
            }
        });
        
        // Clear error on input focus
        input.addEventListener('focus', function() {
            clearError(this);
        });
    });
    
    // Form submission handler
    contactForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission
        
        // Validate form
        if (validateForm()) {
            // Form is valid - show success message
            showToast('Thank you for your message! We will get back to you soon.', 'success');
            
            // Reset form
            contactForm.reset();
            
            // Log form data (for demonstration)
            console.log('Form submitted successfully');
        } else {
            // Form is invalid - show error message
            showToast('Please fix the errors in the form.', 'error');
        }
    });
}

// =============================================================================
// NEWSLETTER FORM
// Handles newsletter subscription form
// =============================================================================

/**
 * Initialize newsletter form functionality
 */
function initNewsletterForm() {
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    
    newsletterForms.forEach(function(form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            // Validate email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            if (!email) {
                showToast('Please enter your email address.', 'error');
                return;
            }
            
            if (!emailRegex.test(email)) {
                showToast('Please enter a valid email address.', 'error');
                return;
            }
            
            // Success - would normally send to server
            showToast('Thank you for subscribing to our newsletter!', 'success');
            emailInput.value = '';
            
            console.log('Newsletter subscription:', email);
        });
    });
}

// =============================================================================
// SCROLL EFFECTS
// Handles scroll-based animations and effects
// =============================================================================

/**
 * Initialize scroll-based effects
 * Adds animations when elements come into view
 */
function initScrollEffects() {
    // Add active class to current navigation link based on page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(function(link) {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        }
    });
    
    // Navbar scroll effect - add shadow on scroll
    const navbar = document.querySelector('.navbar');
    
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            } else {
                navbar.style.boxShadow = 'none';
            }
        });
    }
    
    // Animate elements on scroll (Intersection Observer)
    const animatedElements = document.querySelectorAll('.card, .team-card, .contact-info-card');
    
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in-up');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        animatedElements.forEach(function(element) {
            observer.observe(element);
        });
    }
}

// =============================================================================
// TOAST NOTIFICATIONS
// Displays success and error messages to users
// =============================================================================

/**
 * Show a toast notification
 * @param {string} message - The message to display
 * @param {string} type - The type of toast ('success' or 'error')
 */
function showToast(message, type) {
    // Check if toast container exists, create if not
    let toast = document.querySelector('.toast');
    
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    
    // Set message and type
    toast.textContent = message;
    toast.className = 'toast show ' + type;
    
    // Auto-hide after 4 seconds
    setTimeout(function() {
        toast.classList.remove('show');
    }, 4000);
}

// =============================================================================
// UTILITY FUNCTIONS
// Helper functions used throughout the application
// =============================================================================

/**
 * Debounce function to limit function calls
 * @param {Function} func - The function to debounce
 * @param {number} wait - The wait time in milliseconds
 * @returns {Function} - The debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = function() {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Format price with currency symbol
 * @param {number} price - The price to format
 * @returns {string} - Formatted price string
 */
function formatPrice(price) {
    return '$' + price.toFixed(2);
}

/**
 * Calculate discount percentage
 * @param {number} originalPrice - The original price
 * @param {number} discountedPrice - The discounted price
 * @returns {number} - The discount percentage
 */
function calculateDiscount(originalPrice, discountedPrice) {
    return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
}

// =============================================================================
// DYNAMIC CONTENT UPDATES
// Functions to dynamically update page content
// =============================================================================

/**
 * Update cart count in navigation (demonstration function)
 * @param {number} count - The number of items in cart
 */
function updateCartCount(count) {
    const cartBadge = document.querySelector('.cart-badge');
    if (cartBadge) {
        cartBadge.textContent = count;
        cartBadge.style.display = count > 0 ? 'block' : 'none';
    }
}

/**
 * Add product to cart (demonstration function)
 * @param {number} productId - The ID of the product to add
 */
function addToCart(productId) {
    console.log('Adding product to cart:', productId);
    showToast('Product added to cart!', 'success');
}

// Export functions for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        showToast,
        formatPrice,
        calculateDiscount,
        debounce
    };
}
