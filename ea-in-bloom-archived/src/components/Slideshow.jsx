import { useState, useEffect } from 'react';
import couplePhoto from '../assets/couple-photo.jpg';

// This component will be used to display a slideshow of images
// In a real implementation, you would replace the placeholder images with your own
const Slideshow = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // In a real implementation, these would be replaced with actual wedding photos
  const slides = [
    {
      id: 1,
      src: couplePhoto,
      alt: 'Couple Photo'
    },
    // Additional images would be added here
    // { id: 2, src: '/path/to/image2.jpg', alt: 'Description 2' },
    // { id: 3, src: '/path/to/image3.jpg', alt: 'Description 3' },
  ];

  // Auto-advance the slideshow
  useEffect(() => {
    if (slides.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [slides.length]);

  // If there are no slides, don't render anything
  if (slides.length === 0) return null;

  return (
    <div className="slideshow">
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={slide.src}
              alt={slide.alt}
              className="slideshow-image"
            />
          </div>
        ))}
        
        {/* Navigation dots */}
        {slides.length > 1 && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full ${
                  index === currentSlide ? 'bg-primary' : 'bg-white/50'
                }`}
                onClick={() => setCurrentSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Slideshow;

