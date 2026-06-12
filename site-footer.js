(function initSiteFooter() {
    const footer = document.querySelector('[data-site-footer]');
    if (!footer) return;

    const base = footer.getAttribute('data-base') || '';
    const isHome = footer.getAttribute('data-home') === 'true';

    const logoHref = isHome ? '#' : `${base}index.html`;
    const aboutHref = isHome ? '#about' : `${base}index.html#about`;
    const contactHref = isHome ? '#contact' : `${base}index.html#contact`;

    footer.innerHTML = `
        <div class="container">
            <div class="footer-content">
                <div class="footer-brand">
                    <a href="${logoHref}" class="logo">
                        <span class="logo-icon">✦</span>
                        <span class="logo-text">BibleFunLand<span class="logo-accent">Studios</span></span>
                    </a>
                    <p>Faith-inspired creative media that brings stories to life.</p>
                </div>
                <div class="footer-links">
                    <a href="${aboutHref}">About</a>
                    <a href="${base}brand/index.html">Brands</a>
                    <a href="${base}services.html">Services</a>
                    <a href="${base}work.html">Work</a>
                    <a href="${base}case-studies.html">Case Studies</a>
                    <a href="${base}blog.html">Blog</a>
                    <a href="${contactHref}">Contact</a>
                </div>
            </div>
            <div class="footer-bottom">
                <p class="copyright">
                    &copy; 2026 BibleFunLand Studios. All rights reserved.
                    <a href="https://biblefunland.com" id="easter-game" target="_blank" rel="noopener noreferrer">Bored? Play a game →</a>
                </p>
            </div>
        </div>
    `;

    const copyright = footer.querySelector('.copyright');
    const gameLink = footer.querySelector('#easter-game');

    if (copyright && gameLink) {
        copyright.addEventListener('mouseenter', () => {
            gameLink.style.opacity = '1';
        });

        copyright.addEventListener('mouseleave', () => {
            gameLink.style.opacity = '0.25';
        });
    }
})();
