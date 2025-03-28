// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu after clicking
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });
});

// Contact Form Handling
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const submitButton = this.querySelector('.submit-button');
    const formMessage = document.getElementById('formMessage');
    
    // Show loading state
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitButton.disabled = true;
    formMessage.style.display = 'none';
    
    // Add a timeout to show message even if server doesn't respond
    const timeout = setTimeout(() => {
        formMessage.textContent = 'Request timed out. Please try again.';
        formMessage.className = 'form-message error';
        submitButton.innerHTML = 'Send Message';
        submitButton.disabled = false;
    }, 10000);
    
    fetch('send_email.php', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        clearTimeout(timeout);
        if (data.success) {
            formMessage.textContent = data.message;
            formMessage.className = 'form-message success';
            this.reset();
        } else {
            formMessage.textContent = data.message;
            formMessage.className = 'form-message error';
        }
    })
    .catch(error => {
        clearTimeout(timeout);
        formMessage.textContent = 'Sorry, something went wrong. Please try again.';
        formMessage.className = 'form-message error';
        console.error('Error:', error);
    })
    .finally(() => {
        submitButton.innerHTML = 'Send Message';
        submitButton.disabled = false;
    });
});

// Add scroll animation for elements
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// Image Slider
const slides = document.querySelectorAll('.slide');
let currentSlide = 0;

function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    slides[index].classList.add('active');
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}

// Show first slide
showSlide(0);

// Change slide every 5 seconds
setInterval(nextSlide, 5000);

// Preload images for smooth transitions
window.addEventListener('load', () => {
    slides.forEach(slide => {
        const img = slide.querySelector('img');
        if (img) {
            const src = img.getAttribute('src');
            const preloadImg = new Image();
            preloadImg.src = src;
        }
    });
}); 