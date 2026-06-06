(function initPortfolioCarousel() {
    const root = document.getElementById('portfolioCarousel');
    if (!root) return;

    const list = root.querySelector('.portfolio-carousel__list');
    const prevBtn = root.querySelector('.portfolio-carousel__prev');
    const nextBtn = root.querySelector('.portfolio-carousel__next');
    const items = [...root.querySelectorAll('.portfolio-carousel__item')];

    if (!list || !items.length) return;

    let activeIndex = items.findIndex(item => item.hasAttribute('data-active'));
    if (activeIndex < 0) activeIndex = 0;

    let autoTimer = null;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function setActive(index) {
        activeIndex = (index + items.length) % items.length;
        items.forEach((item, i) => {
            if (i === activeIndex) {
                item.setAttribute('data-active', '');
            } else {
                item.removeAttribute('data-active');
            }
        });
    }

    function pauseAuto() {
        if (autoTimer) {
            clearInterval(autoTimer);
            autoTimer = null;
        }
    }

    function startAuto() {
        if (reduceMotion || items.length < 2) return;
        pauseAuto();
        autoTimer = setInterval(() => setActive(activeIndex + 1), 4500);
    }

    function handlePrev() {
        pauseAuto();
        setActive(activeIndex - 1);
    }

    function handleNext() {
        pauseAuto();
        setActive(activeIndex + 1);
    }

    items.forEach((item, index) => {
        item.addEventListener('mouseenter', () => {
            pauseAuto();
            setActive(index);
        });

        item.addEventListener('focusin', () => {
            pauseAuto();
            setActive(index);
        });

        item.addEventListener('click', (event) => {
            if (!item.hasAttribute('data-active')) {
                event.preventDefault();
                pauseAuto();
                setActive(index);
            }
        });
    });

    list.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowLeft') {
            event.preventDefault();
            handlePrev();
        }
        if (event.key === 'ArrowRight') {
            event.preventDefault();
            handleNext();
        }
    });

    if (prevBtn) prevBtn.addEventListener('click', handlePrev);
    if (nextBtn) nextBtn.addEventListener('click', handleNext);

    root.addEventListener('mouseenter', pauseAuto);
    root.addEventListener('mouseleave', startAuto);
    root.addEventListener('focusin', pauseAuto);
    root.addEventListener('focusout', (event) => {
        if (!root.contains(event.relatedTarget)) startAuto();
    });

    setActive(activeIndex);
    startAuto();
})();
