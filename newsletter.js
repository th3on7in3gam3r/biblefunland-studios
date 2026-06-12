document.querySelectorAll('.newsletter-form').forEach((form) => {
    const successEl = form.parentElement.querySelector('.newsletter-success');
    const submitBtn = form.querySelector('button[type="submit"]');
    const defaultLabel = submitBtn ? submitBtn.textContent : 'Subscribe';

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!submitBtn) return;

        submitBtn.disabled = true;
        submitBtn.textContent = 'Subscribing…';

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: { Accept: 'application/json' }
            });

            if (!response.ok) throw new Error('Subscribe failed');

            form.style.display = 'none';
            if (successEl) successEl.classList.add('visible');
        } catch {
            submitBtn.disabled = false;
            submitBtn.textContent = defaultLabel;
            alert('Something went wrong. Please try again.');
        }
    });
});
