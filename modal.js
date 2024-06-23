// JavaScript to handle modal behavior
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('aboutModal');
    const modalBtn = document.getElementById('about-link');
    const closeBtn = document.getElementsByClassName('close-btn')[0];
  
    // Open modal on link click
    modalBtn.onclick = function() {
      modal.style.display = 'block';
    }
  
    // Close modal on X click
    closeBtn.onclick = function() {
      modal.style.display = 'none';
    }
  
    // Close modal on outside click
    window.onclick = function(event) {
      if (event.target === modal) {
        modal.style.display = 'none';
      }
    }
  });
  