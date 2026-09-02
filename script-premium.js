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
    initNavScroll();
    initMobileMenu();
    initActiveNav();
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
// NAVIGATION SCROLL EFFECTS
// ===================================
function initNavScroll() {
    const nav = document.querySelector('.nav');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 60) {
            nav.classList.add('scrolled');
            // Enhanced scroll effect with backdrop blur
            nav.style.background = 'rgba(10,15,30,0.95)';
            nav.style.backdropFilter = 'blur(12px)';
            nav.style.webkitBackdropFilter = 'blur(12px)';
            nav.style.borderBottom = '1px solid rgba(0,212,255,0.1)';
        } else {
            nav.classList.remove('scrolled');
            nav.style.background = 'transparent';
            nav.style.backdropFilter = 'none';
            nav.style.webkitBackdropFilter = 'none';
            nav.style.borderBottom = 'none';
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

    // Keep aria-expanded in sync with the visual state
    const setOpen = (open) => {
        menuToggle.classList.toggle('active', open);
        navMenu.classList.toggle('active', open);
        menuToggle.setAttribute('aria-expanded', String(open));
    };

    setOpen(false);

    menuToggle.addEventListener('click', () => {
        setOpen(!navMenu.classList.contains('active'));
    });

    // Close menu when clicking on a link
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => setOpen(false));
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-container')) setOpen(false);
    });

    // Close on Escape and return focus to the toggle
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            setOpen(false);
            menuToggle.focus();
        }
    });
}

// ===================================
// ACTIVE NAV STATE
// ===================================
function initActiveNav() {
    const path = window.location.pathname.replace(/\/index\.html$/, '/') || '/';
    document.querySelectorAll('.nav-menu a').forEach(link => {
        const href = link.getAttribute('href');
        if (!href || href.startsWith('#') || href.startsWith('/#')) return;
        if (href === path) link.setAttribute('aria-current', 'page');
    });
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