// ===================================
// WORLD-CLASS INTERACTIVE PORTFOLIO
// Advanced interactions, scroll storytelling, and micro-animations
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all premium features
    initCustomCursor();
    initScrollProgress();
    initHeroAnimations();
    initScrollReveal();
    initSmoothScroll();
    // initParticles(); // Disabled for cleaner, calmer design
    initNavScroll();
    initFormValidation();
    initThemeToggle();
    initMobileMenu();
});

// ===================================
// CUSTOM CURSOR
// ===================================
function initCustomCursor() {
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    if (!cursorDot || !cursorOutline) return;

    let mouseX = 0,
        mouseY = 0;
    let dotX = 0,
        dotY = 0;
    let outlineX = 0,
        outlineY = 0;
    let rafId = null;

    // Track mouse position with throttling
    window.addEventListener('mousemove', (e) => {
        if (rafId) return;
        rafId = requestAnimationFrame(() => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            rafId = null;
        });
    });

    // Smooth cursor follow
    function animateCursor() {
        // Dot follows immediately
        dotX += (mouseX - dotX) * 0.9;
        dotY += (mouseY - dotY) * 0.9;

        // Outline follows with delay
        outlineX += (mouseX - outlineX) * 0.15;
        outlineY += (mouseY - outlineY) * 0.15;

        cursorDot.style.transform = `translate(${dotX - 4}px, ${dotY - 4}px)`;
        cursorOutline.style.transform = `translate(${outlineX - 20}px, ${outlineY - 20}px)`;

        requestAnimationFrame(animateCursor);
    }

    animateCursor();

    // Hover effects
    const interactiveElements = document.querySelectorAll(
        'a, button, .btn, .project-card, .premium-project-card, .repo-card, .lab-card, .link-card, .metric-card'
    );

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            document.body.classList.add('cursor-hover');
        });

        el.addEventListener('mouseleave', () => {
            document.body.classList.remove('cursor-hover');
        });
    });
}

// ===================================
// SCROLL PROGRESS BAR
// ===================================
function initScrollProgress() {
    const progressBar = document.querySelector('.scroll-progress');
    if (!progressBar) return;

    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.pageYOffset / windowHeight);
        progressBar.style.transform = `scaleX(${scrolled})`;
    });
}

// ===================================
// HERO ANIMATIONS
// ===================================
function initHeroAnimations() {
    // Animate elements on load
    setTimeout(() => {
        const animatedElements = document.querySelectorAll('[data-animate]');
        animatedElements.forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('animated');
            }, index * 150);
        });

        // Animate split text
        const heroName = document.querySelector('.hero-name[data-animate="split-text"]');
        if (heroName) {
            heroName.classList.add('animated');
        }
    }, 300);
}

// ===================================
// SCROLL-BASED REVEAL ANIMATIONS
// ===================================
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.project-card, .skill-category, .research-item, .leadership-item, .testimonial, .link-card, .pillar-card, .catalog-card, .internship-item, .detailed-project-card');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Wrap in requestAnimationFrame to prevent spinner bug
                requestAnimationFrame(() => {
                    entry.target.style.opacity = '0';
                    entry.target.style.transform = 'translateY(50px)';

                    setTimeout(() => {
                        entry.target.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, 100);

                    revealObserver.unobserve(entry.target);
                });
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
}

// ===================================
// SMOOTH SCROLL
// ===================================
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');

            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navHeight = document.querySelector('.nav').offsetHeight;
                const targetPosition = targetElement.offsetTop - navHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===================================
// PARTICLE CANVAS ANIMATION
// ===================================
function initParticles() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouseX = 0;
    let mouseY = 0;

    // Set canvas size
    function setCanvasSize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // Track mouse
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Particle class
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 2 + 1;
            this.opacity = Math.random() * 0.5 + 0.2;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Mouse interaction
            const dx = mouseX - this.x;
            const dy = mouseY - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 150) {
                const force = (150 - distance) / 150;
                this.x -= dx * force * 0.03;
                this.y -= dy * force * 0.03;
            }

            // Wrap around edges
            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 217, 255, ${this.opacity})`;
            ctx.fill();
        }
    }

    // Create particles
    for (let i = 0; i < 80; i++) {
        particles.push(new Particle());
    }

    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw connections
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 120) {
                    const opacity = (120 - distance) / 120 * 0.2;
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(0, 217, 255, ${opacity})`;
                    ctx.lineWidth = 1;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }

        // Update and draw particles
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        requestAnimationFrame(animate);
    }

    animate();
}

// ===================================
// NAVIGATION SCROLL EFFECTS
// ===================================
function initNavScroll() {
    const nav = document.querySelector('.nav');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });
}

// ===================================
// MOBILE MENU
// ===================================
function initMobileMenu() {
    const menuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.querySelector('.nav-menu');

    if (!menuToggle || !navMenu) return;

    // Toggle menu on button click
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking on a link
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-container')) {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}

// ===================================
// FORM VALIDATION
// ===================================
function initFormValidation() {
    const form = document.querySelector('.contact-form');

    if (!form) return;

    form.addEventListener('submit', async(e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        // Validation
        if (!data.name || !data.email || !data.message) {
            showNotification('Please fill in all required fields.', 'error');
            return;
        }

        if (!isValidEmail(data.email)) {
            showNotification('Please enter a valid email address.', 'error');
            return;
        }

        // Submit
        const button = form.querySelector('button[type="submit"]');
        const originalText = button.innerHTML;
        button.innerHTML = '<span class="btn-text">Sending...</span>';
        button.disabled = true;

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Success
        showNotification('Thank you! Your message has been sent.', 'success');
        form.reset();

        // Reset button
        button.innerHTML = originalText;
        button.disabled = false;
    });
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showNotification(message, type = 'info') {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    Object.assign(notification.style, {
        position: 'fixed',
        top: '100px',
        right: '20px',
        padding: '1rem 1.5rem',
        backgroundColor: type === 'error' ? '#FF4757' : type === 'success' ? '#00D9FF' : '#0A0E27',
        color: type === 'success' || type === 'error' ? '#0A0E27' : 'white',
        borderRadius: '4px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
        zIndex: '10000',
        fontFamily: 'Space Grotesk, sans-serif',
        fontSize: '0.9375rem',
        fontWeight: '600',
        maxWidth: '400px',
        animation: 'slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        cursor: 'pointer'
    });

    document.body.appendChild(notification);

    notification.addEventListener('click', () => notification.remove());
    setTimeout(() => notification.remove(), 5000);
}

// ===================================
// UTILITY: DEBOUNCE
// ===================================
function debounce(func, wait = 20) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// ===================================
// ACCESSIBILITY: KEYBOARD NAVIGATION
// ===================================
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
});

// Add keyboard styles
const keyboardStyles = document.createElement('style');
keyboardStyles.textContent = `
    .keyboard-nav *:focus {
        outline: 2px solid #00D9FF;
        outline-offset: 2px;
    }
    
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(keyboardStyles);

// ===================================
// REDUCED MOTION SUPPORT
// ===================================
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion) {
    const style = document.createElement('style');
    style.textContent = `
        *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
        }
        
        .cursor-dot, .cursor-outline {
            display: none !important;
        }
    `;
    document.head.appendChild(style);
}


// ===================================
// THEME TOGGLE
// ===================================
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) {
        console.log('Theme toggle button not found');
        return;
    }

    // Check for saved theme preference or default to 'dark'
    const currentTheme = localStorage.getItem('theme') || 'dark';
    console.log('Current theme:', currentTheme);

    // Apply the theme on load
    if (currentTheme === 'light') {
        document.body.classList.add('light-mode');
    }

    // Toggle theme on button click
    themeToggle.addEventListener('click', () => {
        console.log('Theme toggle clicked!');
        document.body.classList.toggle('light-mode');

        // Save the preference
        const theme = document.body.classList.contains('light-mode') ? 'light' : 'dark';
        localStorage.setItem('theme', theme);
        console.log('Theme changed to:', theme);

        // Add a subtle animation to the button
        themeToggle.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            themeToggle.style.transform = 'rotate(0deg)';
        }, 300);
    });

    // Smooth transition for theme toggle
    themeToggle.style.transition = 'transform 0.3s ease';
    console.log('Theme toggle initialized successfully');
}


console.log('%c✨ Premium Portfolio Loaded', 'color: #00D9FF; font-size: 16px; font-weight: 700; text-shadow: 0 0 10px rgba(0, 217, 255, 0.5);');

// ===================================
// PREMIUM SECTIONS SCROLL ANIMATIONS
// ===================================

function initPremiumSectionsAnimations() {
    // Intersection Observer for scroll-triggered animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Wrap in requestAnimationFrame to prevent spinner bug
                requestAnimationFrame(() => {
                    entry.target.classList.add('animated');

                    // Trigger progress bar animations for Now Building section
                    if (entry.target.classList.contains('now-featured-card')) {
                        entry.target.setAttribute('data-animated', 'true');
                    }
                });
            }
        });
    }, observerOptions);

    // Observe all elements with data-animate attribute
    document.querySelectorAll('[data-animate]').forEach(el => {
        animationObserver.observe(el);
    });

    // Observe progress bars
    document.querySelectorAll('.now-featured-card').forEach(card => {
        animationObserver.observe(card);
    });

    // Observe timeline blocks
    document.querySelectorAll('.timeline-block').forEach(block => {
        animationObserver.observe(block);
    });

    // Observe ambition items
    document.querySelectorAll('.ambition-item').forEach(item => {
        animationObserver.observe(item);
    });

    // Observe research items
    document.querySelectorAll('.research-item').forEach(item => {
        animationObserver.observe(item);
    });

    // Observe ecosystem nodes
    document.querySelectorAll('.ecosystem-node, .center-node').forEach(node => {
        animationObserver.observe(node);
    });

    // Observe dashboard cards
    document.querySelectorAll('.dashboard-card').forEach(card => {
        animationObserver.observe(card);
    });

    // Observe lab cards
    document.querySelectorAll('.lab-card').forEach(card => {
        animationObserver.observe(card);
    });
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPremiumSectionsAnimations);
} else {
    initPremiumSectionsAnimations();
}