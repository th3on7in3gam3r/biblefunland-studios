// ===== THEME LOADER =====
// Applies saved theme immediately. Works in <head> or <body>.
(function() {
    var savedTheme = localStorage.getItem('bfl-theme') || 'premium';
    if (savedTheme !== 'premium') {
        // If body exists, apply directly
        if (document.body) {
            document.body.classList.add('theme-' + savedTheme);
        } else {
            // Otherwise wait for DOM
            document.addEventListener('DOMContentLoaded', function() {
                document.body.classList.add('theme-' + savedTheme);
            });
        }
    }
})();
