/* ========================================
   PORTFOLIO WEBSITE - JAVASCRIPT
   Modular, production-ready vanilla JS
   ======================================== */

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Debounce function to limit rate of function execution
 * @param {Function} func - The function to debounce
 * @param {Number} delay - Delay in milliseconds
 */
const debounce = (func, delay) => {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
};

/**
 * Throttle function to limit function execution frequency
 * @param {Function} func - The function to throttle
 * @param {Number} limit - Time limit in milliseconds
 */
const throttle = (func, limit) => {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

/**
 * Validate email format
 * @param {String} email - Email address to validate
 */
const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

// ========================================
// THEME MANAGEMENT
// ========================================

class ThemeManager {
    constructor() {
        this.htmlElement = document.documentElement;
        this.themeToggle = document.getElementById('theme-toggle');
        this.init();
    }

    init() {
        // Check for saved theme preference or system preference
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
        
        this.setTheme(initialTheme);
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
    }

    setTheme(theme) {
        this.htmlElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }

    toggleTheme() {
        const currentTheme = this.htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
    }
}

// ========================================
// NAVIGATION MANAGEMENT
// ========================================

class NavigationManager {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.hamburger = document.getElementById('hamburger');
        this.navMenu = document.getElementById('nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.init();
    }

    init() {
        this.hamburger.addEventListener('click', () => this.toggleMenu());
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });
        window.addEventListener('scroll', () => this.updateNavbarStyle());
        this.updateActiveLink();
    }

    toggleMenu() {
        this.hamburger.classList.toggle('active');
        this.navMenu.classList.toggle('active');
    }

    closeMenu() {
        this.hamburger.classList.remove('active');
        this.navMenu.classList.remove('active');
    }

    updateNavbarStyle() {
        if (window.scrollY > 50) {
            this.navbar.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        } else {
            this.navbar.style.boxShadow = 'none';
        }
    }

    updateActiveLink() {
        const sections = document.querySelectorAll('section');
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                this.navLinks.forEach(link => link.classList.remove('active'));
                const activeLink = document.querySelector(`.nav-link[data-section="${section.id}"]`);
                if (activeLink) activeLink.classList.add('active');
            }
        });
    }
}

// ========================================
// HERO SECTION - TYPED TEXT EFFECT
// ========================================

class TypedText {
    constructor() {
        this.element = document.getElementById('typed-text');
        this.phrases = [
            'a Full-Stack Developer',
            'a Problem Solver',
            'an Innovator',
            'a Tech Enthusiast'
        ];
        this.currentIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        this.speed = 100;
        this.pauseTime = 2000;
        this.init();
    }

    init() {
        setTimeout(() => this.type(), 500);
    }

    type() {
        const currentPhrase = this.phrases[this.currentIndex];
        
        if (this.isDeleting) {
            this.element.textContent = currentPhrase.substring(0, this.charIndex - 1);
            this.charIndex--;
            
            if (this.charIndex === 0) {
                this.isDeleting = false;
                this.currentIndex = (this.currentIndex + 1) % this.phrases.length;
                setTimeout(() => this.type(), 500);
                return;
            }
        } else {
            this.element.textContent = currentPhrase.substring(0, this.charIndex + 1);
            this.charIndex++;
            
            if (this.charIndex === currentPhrase.length) {
                this.isDeleting = true;
                setTimeout(() => this.type(), this.pauseTime);
                return;
            }
        }
        
        setTimeout(() => this.type(), this.isDeleting ? 50 : this.speed);
    }
}

// ========================================
// SCROLL ANIMATIONS
// ========================================

class ScrollAnimations {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, this.observerOptions);

        // Observe all project cards and skill categories
        document.querySelectorAll('.project-card, .skill-category, .stat-box').forEach(el => {
            observer.observe(el);
        });

        // Animate progress bars on scroll
        this.observeProgressBars();
    }

    observeProgressBars() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progressBars = entry.target.querySelectorAll('.progress-fill');
                    progressBars.forEach(bar => {
                        const width = bar.style.width;
                        bar.style.width = '0';
                        setTimeout(() => {
                            bar.style.width = width;
                        }, 100);
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        const skillsSection = document.getElementById('skills');
        if (skillsSection) observer.observe(skillsSection);
    }
}

// ========================================
// PROJECT FILTERING
// ========================================

class ProjectFilter {
    constructor() {
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.projectCards = document.querySelectorAll('.project-card');
        this.init();
    }

    init() {
        this.filterButtons.forEach(btn => {
            btn.addEventListener('click', () => this.filterProjects(btn));
        });
    }

    filterProjects(clickedBtn) {
        const filterValue = clickedBtn.getAttribute('data-filter');

        // Update active button
        this.filterButtons.forEach(btn => btn.classList.remove('active'));
        clickedBtn.classList.add('active');

        // Filter projects with animation
        this.projectCards.forEach(card => {
            const category = card.getAttribute('data-category');
            
            if (filterValue === 'all' || category === filterValue) {
                card.classList.remove('hidden');
                card.style.animation = 'fadeIn 0.5s ease-out';
            } else {
                card.classList.add('hidden');
            }
        });
    }
}

// ========================================
// CONTACT FORM VALIDATION & SUBMISSION
// ========================================

class ContactForm {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.nameInput = document.getElementById('name');
        this.emailInput = document.getElementById('email');
        this.subjectInput = document.getElementById('subject');
        this.messageInput = document.getElementById('message');
        this.formMessage = document.getElementById('form-message');
        this.inputs = [this.nameInput, this.emailInput, this.subjectInput, this.messageInput];
        this.init();
    }

    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Real-time validation
        this.inputs.forEach(input => {
            input.addEventListener('input', () => this.clearError(input));
            input.addEventListener('blur', () => this.validateField(input));
        });
    }

    validateField(field) {
        let isValid = true;
        const errorElement = document.getElementById(`${field.id}-error`);

        if (!field.value.trim()) {
            this.showError(field, errorElement, 'This field is required');
            isValid = false;
        } else if (field.id === 'email' && !validateEmail(field.value)) {
            this.showError(field, errorElement, 'Please enter a valid email address');
            isValid = false;
        } else {
            this.clearError(field);
        }

        return isValid;
    }

    showError(field, errorElement, message) {
        field.style.borderColor = '#e74c3c';
        errorElement.textContent = message;
    }

    clearError(field) {
        field.style.borderColor = '';
        const errorElement = document.getElementById(`${field.id}-error`);
        if (errorElement) errorElement.textContent = '';
    }

    async handleSubmit(e) {
        e.preventDefault();

        // Validate all fields
        const isValid = this.inputs.every(input => this.validateField(input));

        if (!isValid) {
            this.showMessage('Please fix the errors above', 'error');
            return;
        }

        // Simulate form submission
        const submitBtn = this.form.querySelector('.btn-submit');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            this.showMessage('Message sent successfully! I\'ll get back to you soon.', 'success');
            this.form.reset();
            this.inputs.forEach(input => this.clearError(input));

        } catch (error) {
            this.showMessage('Failed to send message. Please try again.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    }

    showMessage(message, type) {
        this.formMessage.textContent = message;
        this.formMessage.className = `form-message ${type}`;

        // Clear message after 5 seconds
        setTimeout(() => {
            this.formMessage.className = '';
        }, 5000);
    }
}

// ========================================
// BACK TO TOP BUTTON
// ========================================

class BackToTop {
    constructor() {
        this.button = document.getElementById('back-to-top');
        this.init();
    }

    init() {
        window.addEventListener('scroll', throttle(() => this.toggleVisibility(), 200));
        this.button.addEventListener('click', () => this.scrollToTop());
    }

    toggleVisibility() {
        if (window.scrollY > 300) {
            this.button.classList.add('show');
        } else {
            this.button.classList.remove('show');
        }
    }

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

// ========================================
// SMOOTH SCROLL FOR NAVIGATION
// ========================================

class SmoothScroll {
    constructor() {
        this.links = document.querySelectorAll('a[href^="#"]');
        this.init();
    }

    init() {
        this.links.forEach(link => {
            link.addEventListener('click', (e) => this.handleClick(e));
        });
    }

    handleClick(e) {
        const href = e.currentTarget.getAttribute('href');
        
        if (href === '#') return;

        const target = document.querySelector(href);
        
        if (target) {
            e.preventDefault();
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }
}

// ========================================
// LAZY LOADING IMAGES
// ========================================

class LazyLoad {
    constructor() {
        this.init();
    }

    init() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }
}

// ========================================
// PERFORMANCE MONITORING
// ========================================

class PerformanceMonitor {
    constructor() {
        this.init();
    }

    init() {
        // Log performance metrics in development
        if (process.env?.NODE_ENV === 'development') {
            window.addEventListener('load', () => {
                const perfData = window.performance.timing;
                const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
                console.log('Page Load Time:', pageLoadTime + 'ms');
            });
        }
    }
}

// ========================================
// MAIN INITIALIZATION
// ========================================

class App {
    constructor() {
        this.init();
    }

    init() {
        // Initialize all managers and features
        new ThemeManager();
        new NavigationManager();
        new TypedText();
        new ScrollAnimations();
        new ProjectFilter();
        new ContactForm();
        new BackToTop();
        new SmoothScroll();
        new LazyLoad();

        console.log('Portfolio App Initialized Successfully');
    }
}

// ========================================
// APP STARTUP
// ========================================

// Wait for DOM to be fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new App();
    });
} else {
    new App();
}

// ========================================
// ERROR BOUNDARY (Optional but recommended)
// ========================================

window.addEventListener('error', (event) => {
    console.error('Global Error:', event.error);
    // You could send this to an error tracking service
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled Promise Rejection:', event.reason);
});
