document.addEventListener('DOMContentLoaded', function() {
    const menuBtn = document.querySelector('.menu-btn');
    const closeBtn = document.querySelector('.close-btn');
    const menu = document.getElementById('menu');
    const aboutLink = document.getElementById('about-link');
    const aboutSection = document.getElementById('about');
    
    menuBtn.addEventListener('click', function() {
        menu.classList.add('open');
    });
    
    closeBtn.addEventListener('click', function() {
        menu.classList.remove('open');
    });
    
    aboutLink.addEventListener('click', function(event) {
        event.preventDefault();
        menu.classList.remove('open');
        aboutSection.style.display = 'block';
    });
});