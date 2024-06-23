document.addEventListener('DOMContentLoaded', function() {
    const menuIcon = document.getElementById('menu-icon');
    const navMenu = document.getElementById('nav-menu');
    const closeIcon = document.getElementById('close-icon');

    menuIcon.addEventListener('click', function() {
        navMenu.classList.toggle('open');
    });

    closeIcon.addEventListener('click', function() {
        navMenu.classList.remove('open');
    });

    document.querySelectorAll('.menu a').forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('open');
        });
    });
});