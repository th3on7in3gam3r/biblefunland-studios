// ===== THEME SWITCHER =====
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const themeLabel = document.getElementById('themeLabel');
const themeDropdown = document.getElementById('themeDropdown');
const themeOptions = document.querySelectorAll('.theme-option');

const themeData = {
    premium: {
        icon: '✨',
        label: 'Premium',
        headline: 'Bringing <span class="highlight">Faith</span> to Life Through <span class="highlight">Creative</span> Media',
        subtitle: 'We build brands, craft animations, design experiences, and tell stories that move people closer to purpose — for churches, ministries, and faith-driven organizations worldwide.',
        banner: 'banner_image.png'
    },
    comic: {
        icon: '💥',
        label: 'Comic',
        headline: '<span class="highlight">Faith</span> Meets <span class="highlight">Creativity</span> — POW!',
        subtitle: 'Bold stories. Bigger impact. We bring the energy of faith to every frame, pixel, and project we touch.',
        banner: 'banner_image.png'
    },
    dark: {
        icon: '🌙',
        label: 'Dark',
        headline: 'Create in the <span class="highlight">Dark</span>. Shine in the <span class="highlight">Light</span>.',
        subtitle: 'When the world sleeps, we build. Premium media crafted with purpose for ministries that refuse to blend in.',
        banner: 'banner_image.png'
    },
    'stained-glass': {
        icon: '🪟',
        label: 'Glass',
        headline: '<span class="highlight">Sacred</span> Creativity. <span class="highlight">Eternal</span> Stories.',
        subtitle: 'Like light through glass, we transform vision into beauty — crafting media that honors the divine and moves the soul.',
        banner: 'banner_image.png'
    },
    retro: {
        icon: '📜',
        label: 'Retro',
        headline: '<span class="highlight">Timeless</span> Stories. <span class="highlight">Timeless</span> Faith.',
        subtitle: 'Some things never go out of style — truth, craftsmanship, and stories told with heart. We carry that tradition forward.',
        banner: 'banner_image.png'
    },
    neon: {
        icon: '⚡',
        label: 'Neon',
        headline: 'The <span class="highlight">Future</span> of <span class="highlight">Faith</span> Media.',
        subtitle: 'Next-gen creativity for a next-gen mission. We build digital experiences that cut through the noise and glow in the dark.',
        banner: 'banner_image.png'
    },
    minimal: {
        icon: '◻️',
        label: 'Minimal',
        headline: 'Less Noise. More <span class="highlight">Purpose</span>.',
        subtitle: 'Clean design. Clear message. We strip away the clutter so your mission speaks louder.',
        banner: 'banner_image.png'
    },
    kids: {
        icon: '🎈',
        label: 'Kids',
        headline: "Let's Create Something <span class=\"highlight\">Awesome</span>!",
        subtitle: "Fun, colorful, and full of faith — we make media that kids love and parents trust. Learning God's Word has never been this exciting.",
        banner: 'banner_image.png'
    }
};

// Load saved theme
const savedTheme = localStorage.getItem('bfl-theme') || 'premium';
applyTheme(savedTheme);

// Toggle dropdown
themeToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    themeDropdown.classList.toggle('open');
    // Close mobile nav when opening theme picker
    const navLinks = document.getElementById('navLinks');
    if (navLinks) navLinks.classList.remove('active');
});

// Close dropdown on outside click (desktop)
document.addEventListener('click', () => {
    themeDropdown.classList.remove('open');
});

// Close button
const themeDropdownClose = document.getElementById('themeDropdownClose');
if (themeDropdownClose) {
    themeDropdownClose.addEventListener('click', () => {
        themeDropdown.classList.remove('open');
    });
}

themeDropdown.addEventListener('click', (e) => {
    if (e.target === themeDropdown) {
        themeDropdown.classList.remove('open');
    }
});

// Theme option click
themeOptions.forEach(option => {
    option.addEventListener('click', () => {
        const theme = option.dataset.theme;
        applyTheme(theme);
        localStorage.setItem('bfl-theme', theme);
        themeDropdown.classList.remove('open');
        // Also close mobile nav if open
        const navLinks = document.getElementById('navLinks');
        if (navLinks) navLinks.classList.remove('active');
    });
});

function applyTheme(theme) {
    // Remove all theme classes
    document.body.classList.remove('cartoon', 'theme-comic', 'theme-dark', 'theme-stained-glass', 'theme-retro', 'theme-neon', 'theme-minimal', 'theme-kids');

    // Apply new theme
    if (theme !== 'premium') {
        document.body.classList.add('theme-' + theme);
    }

    // Update toggle button
    const data = themeData[theme];
    themeIcon.textContent = data.icon;
    themeLabel.textContent = data.label;

    // Update active state
    themeOptions.forEach(opt => {
        opt.classList.toggle('active', opt.dataset.theme === theme);
    });

    // Update hero headline
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) heroTitle.innerHTML = data.headline;

    // Update hero subtitle
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle) heroSubtitle.textContent = data.subtitle;

    // Update banner image
    const heroBanner = document.querySelector('.hero-image img');
    if (heroBanner) heroBanner.src = data.banner;
}

// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== MOBILE NAV TOGGLE =====
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
const navClose = document.getElementById('navClose');

navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

navClose.addEventListener('click', () => {
    navLinks.classList.remove('active');
});

navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 80;
            const position = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top: position, behavior: 'smooth' });
        }
    });
});

// ===== SCROLL REVEAL ANIMATION =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.service-card, .portfolio-card, .testimonial-card, .stat-card, .brand-card, .partner-card, .process-step').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
});

// ===== FAQ ACCORDION =====
document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
        const item = btn.parentElement;
        const isActive = item.classList.contains('active');

        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));

        if (!isActive) {
            item.classList.add('active');
        }
    });
});

// ===== CONTACT FORM HANDLING =====
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const btn = this.querySelector('button[type="submit"]');
    const originalText = btn.textContent;

    btn.textContent = 'Sending...';
    btn.disabled = true;

    const formData = new FormData(this);

    const actionUrl = this.dataset.action || this.action;

    fetch(actionUrl, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
    })
    .then(response => {
        if (response.ok) {
            btn.textContent = '✓ Message Sent!';
            btn.style.background = '#4ECDC4';
            btn.style.boxShadow = '0 4px 16px rgba(78, 205, 196, 0.3)';
            contactForm.reset();
        } else {
            btn.textContent = '✓ Message Sent!';
            btn.style.background = '#4ECDC4';
            contactForm.reset();
        }

        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
            btn.style.boxShadow = '';
            btn.disabled = false;
        }, 3000);
    })
    .catch(() => {
        btn.textContent = 'Error — Try Again';
        btn.style.background = '#e63946';
        btn.disabled = false;

        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
        }, 3000);
    });
});

// ===== STAGGER ANIMATION DELAYS =====
document.querySelectorAll('.services-grid .service-card').forEach((card, i) => {
    card.style.animationDelay = `${i * 0.1}s`;
});

document.querySelectorAll('.brands-grid .brand-card').forEach((card, i) => {
    card.style.animationDelay = `${i * 0.1}s`;
});

document.querySelectorAll('.portfolio-grid .portfolio-card').forEach((card, i) => {
    card.style.animationDelay = `${i * 0.1}s`;
});

document.querySelectorAll('.testimonials-grid .testimonial-card').forEach((card, i) => {
    card.style.animationDelay = `${i * 0.1}s`;
});


// ===== BACK TO TOP =====
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 600);
});

backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});


// ===== PAGE LOADER =====
const loader = document.getElementById('pageLoader');

function hideLoader() {
    if (loader) loader.classList.add('hidden');
}

if (document.readyState === 'complete') {
    setTimeout(hideLoader, 800);
} else {
    window.addEventListener('load', () => setTimeout(hideLoader, 800));
}

// Failsafe — always hide after 2.5s
setTimeout(hideLoader, 2500);


// ===== ACTIVE NAV LINK ON SCROLL =====
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const top = section.offsetTop - 120;
        if (window.scrollY >= top) {
            current = section.getAttribute('id');
        }
    });

    navAnchors.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
});


// ===== COOKIE NOTICE =====
const cookieNotice = document.getElementById('cookieNotice');
const cookieAccept = document.getElementById('cookieAccept');

if (!localStorage.getItem('bfl-cookies-accepted')) {
    setTimeout(() => {
        cookieNotice.classList.add('visible');
    }, 2000);
}

cookieAccept.addEventListener('click', () => {
    cookieNotice.classList.remove('visible');
    cookieNotice.classList.add('hidden');
    localStorage.setItem('bfl-cookies-accepted', 'true');
});
