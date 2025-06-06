// Enhanced interactivity and animations
document.addEventListener('DOMContentLoaded', function() {
    // Disable right-click context menu
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        return false;
    });

    // Disable text selection on images
    document.addEventListener('selectstart', function(e) {
        if (e.target.tagName === 'IMG') {
            e.preventDefault();
            return false;
        }
    });

    // Disable drag and drop on images
    document.addEventListener('dragstart', function(e) {
        if (e.target.tagName === 'IMG') {
            e.preventDefault();
            return false;
        }
    });

    // Disable F12, Ctrl+Shift+I, Ctrl+U, Ctrl+S
    document.addEventListener('keydown', function(e) {
        // F12
        if (e.keyCode === 123) {
            e.preventDefault();
            return false;
        }
        // Ctrl+Shift+I
        if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
            e.preventDefault();
            return false;
        }
        // Ctrl+U
        if (e.ctrlKey && e.keyCode === 85) {
            e.preventDefault();
            return false;
        }
        // Ctrl+S
        if (e.ctrlKey && e.keyCode === 83) {
            e.preventDefault();
            return false;
        }
    });

    // Add entrance animation to main elements
    const mainContent = document.querySelector('main > div');
    mainContent.style.opacity = '0';
    mainContent.style.transform = 'translateY(30px)';
    
    setTimeout(() => {
        mainContent.style.transition = 'all 1s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        mainContent.style.opacity = '1';
        mainContent.style.transform = 'translateY(0)';
    }, 100);

    // Add click tracking for buttons (useful for analytics)
    const buttons = document.querySelectorAll('.wedding-btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Add a ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
                z-index: 2;
            `;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Parallax effect for decorative elements
    if (window.innerWidth > 768) { // Only on desktop to avoid performance issues on mobile
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const decorativeElements = document.querySelectorAll('.sunflower-decoration');
            
            decorativeElements.forEach((element, index) => {
                const speed = 0.5 + (index * 0.1);
                element.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.1}deg)`;
            });
        });
    }

    // Initialize slideshow
    initializeSlideshow();

    // Preload images for better performance
    const imagePreloader = new Image();
    imagePreloader.src = 'images/background.jpg';
    
    // Preload slideshow images
    for (let i = 1; i <= 3; i++) {
        const img = new Image();
        img.src = `images/slide${i}.jpg`;
    }
});

// Slideshow functionality
let currentSlideIndex = 0;
const slides = document.querySelectorAll('.slide');
const indicators = document.querySelectorAll('.indicator');

function initializeSlideshow() {
    // Auto-advance slideshow every 5 seconds
    setInterval(() => {
        changeSlide(1);
    }, 5000);
}

function showSlide(index) {
    // Hide all slides
    slides.forEach(slide => {
        slide.classList.remove('active');
    });
    
    // Remove active class from all indicators
    indicators.forEach(indicator => {
        indicator.classList.remove('active');
    });
    
    // Show current slide
    if (slides[index]) {
        slides[index].classList.add('active');
    }
    
    // Activate current indicator
    if (indicators[index]) {
        indicators[index].classList.add('active');
    }
}

function changeSlide(direction) {
    currentSlideIndex += direction;
    
    if (currentSlideIndex >= slides.length) {
        currentSlideIndex = 0;
    } else if (currentSlideIndex < 0) {
        currentSlideIndex = slides.length - 1;
    }
    
    showSlide(currentSlideIndex);
}

function currentSlide(index) {
    currentSlideIndex = index - 1;
    showSlide(currentSlideIndex);
}

// Add CSS animation for ripple effect
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);