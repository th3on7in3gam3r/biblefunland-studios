(function initSiteNav() {
    const navLinks = document.getElementById('navLinks');
    if (!navLinks || !navLinks.hasAttribute('data-site-nav')) return;

    const active = navLinks.getAttribute('data-active') || '';
    const base = navLinks.getAttribute('data-base') || '';
    const isHome = navLinks.getAttribute('data-home') === 'true';

    const aboutHref = isHome ? '#about' : `${base}index.html#about`;
    const faqHref = isHome ? '#faq' : `${base}index.html#faq`;
    const contactHref = isHome ? '#contact' : `${base}index.html#contact`;
    const blogHref = isHome ? '/blog.html' : `${base}blog.html`;

    const items = [
        { key: 'about', label: 'About', href: aboutHref },
        { key: 'brands', label: 'Brands', href: `${base}brand/index.html` },
        { key: 'services', label: 'Services', href: `${base}services.html` },
        { key: 'work', label: 'Work', href: `${base}work.html` },
        { key: 'case-studies', label: 'Case Studies', href: `${base}case-studies.html` },
        { key: 'faq', label: 'FAQ', href: faqHref },
        { key: 'blog', label: 'Blog', href: blogHref }
    ];

    const closeBtn = '<button class="nav-close" id="navClose" aria-label="Close navigation">✕</button>';
    const links = items.map((item) => {
        const cls = item.key === active ? ' class="active"' : '';
        return `<li><a href="${item.href}"${cls}>${item.label}</a></li>`;
    }).join('');
    const cta = `<li><a href="${contactHref}" class="btn btn-nav">Get In Touch</a></li>`;

    navLinks.innerHTML = closeBtn + links + cta;

    const navClose = document.getElementById('navClose');
    const navToggle = document.getElementById('navToggle');

    if (navClose && navLinks) {
        navClose.addEventListener('click', () => navLinks.classList.remove('active'));
    }

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => navLinks.classList.toggle('active'));
        navLinks.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', () => navLinks.classList.remove('active'));
        });
    }
})();

(function initBackToTop() {
    let backToTop = document.getElementById('backToTop');

    if (!backToTop) {
        backToTop = document.createElement('button');
        backToTop.className = 'back-to-top';
        backToTop.id = 'backToTop';
        backToTop.setAttribute('aria-label', 'Back to top');
        backToTop.textContent = '↑';
        document.body.appendChild(backToTop);
    }

    window.addEventListener('scroll', () => {
        backToTop.classList.toggle('visible', window.scrollY > 600);
    }, { passive: true });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
})();
