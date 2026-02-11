import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * decorate the carousel block
 * @param {Element} block the block
 */
export default async function decorate(block) {
  const slides = block.querySelectorAll(':scope > div');

  if (slides.length === 0) {
    return;
  }

  // Check for variants
  const isAutoplay = block.classList.contains('autoplay');
  const showIndicators = !block.classList.contains('no-indicators');

  // Create carousel wrapper
  const carousel = document.createElement('div');
  carousel.className = 'carousel-wrapper';

  // Create slides container
  const slidesContainer = document.createElement('div');
  slidesContainer.className = 'carousel-slides';

  // Process each slide
  slides.forEach((slide, index) => {
    const slideEl = document.createElement('div');
    slideEl.className = 'carousel-slide';
    if (index === 0) {
      slideEl.classList.add('active');
    }

    // Move content from authored div to slide
    slideEl.append(...slide.childNodes);
    slidesContainer.append(slideEl);
  });

  carousel.append(slidesContainer);

  // Create navigation buttons
  const prevBtn = document.createElement('button');
  prevBtn.className = 'carousel-nav carousel-prev';
  prevBtn.setAttribute('aria-label', 'Previous slide');
  prevBtn.textContent = '❮';

  const nextBtn = document.createElement('button');
  nextBtn.className = 'carousel-nav carousel-next';
  nextBtn.setAttribute('aria-label', 'Next slide');
  nextBtn.textContent = '❯';

  carousel.append(prevBtn, nextBtn);

  // Create indicators if enabled
  let indicatorsContainer;
  if (showIndicators) {
    indicatorsContainer = document.createElement('div');
    indicatorsContainer.className = 'carousel-indicators';

    slides.forEach((_, index) => {
      const indicator = document.createElement('button');
      indicator.className = 'carousel-indicator';
      if (index === 0) {
        indicator.classList.add('active');
      }
      indicator.setAttribute('aria-label', `Go to slide ${index + 1}`);
      indicator.setAttribute('data-slide', index);
      indicatorsContainer.append(indicator);
    });

    carousel.append(indicatorsContainer);
  }

  // Replace block content with carousel
  block.replaceChildren(carousel);

  // Carousel state
  let currentSlide = 0;
  let autoplayInterval;

  // Get all slide elements
  const slideElements = slidesContainer.querySelectorAll('.carousel-slide');
  const totalSlides = slideElements.length;

  /**
   * Show a specific slide
   * @param {number} index slide index
   */
  const showSlide = (index) => {
    currentSlide = (index + totalSlides) % totalSlides;

    slideElements.forEach((slide, idx) => {
      slide.classList.toggle('active', idx === currentSlide);
    });

    if (indicatorsContainer) {
      const indicators = indicatorsContainer.querySelectorAll('.carousel-indicator');
      indicators.forEach((indicator, idx) => {
        indicator.classList.toggle('active', idx === currentSlide);
      });
    }
  };

  /**
   * Move to next slide
   */
  const nextSlide = () => {
    showSlide(currentSlide + 1);
    resetAutoplay();
  };

  /**
   * Move to previous slide
   */
  const prevSlide = () => {
    showSlide(currentSlide - 1);
    resetAutoplay();
  };

  /**
   * Start autoplay
   */
  const startAutoplay = () => {
    if (!isAutoplay) return;
    autoplayInterval = setInterval(() => {
      showSlide(currentSlide + 1);
    }, 5000);
  };

  /**
   * Reset autoplay timer
   */
  const resetAutoplay = () => {
    if (autoplayInterval) {
      clearInterval(autoplayInterval);
    }
    startAutoplay();
  };

  // Event listeners
  nextBtn.addEventListener('click', nextSlide);
  prevBtn.addEventListener('click', prevSlide);

  if (indicatorsContainer) {
    indicatorsContainer.addEventListener('click', (e) => {
      if (e.target.classList.contains('carousel-indicator')) {
        const slideIndex = parseInt(e.target.getAttribute('data-slide'), 10);
        showSlide(slideIndex);
        resetAutoplay();
      }
    });
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (block.contains(document.activeElement) || carousel.contains(e.target)) {
      if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
      }
    }
  });

  // Start autoplay if enabled
  if (isAutoplay) {
    startAutoplay();

    // Pause on hover
    carousel.addEventListener('mouseenter', () => {
      if (autoplayInterval) {
        clearInterval(autoplayInterval);
      }
    });

    carousel.addEventListener('mouseleave', () => {
      startAutoplay();
    });
  }
}