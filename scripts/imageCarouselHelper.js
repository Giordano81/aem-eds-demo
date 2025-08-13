
import { createOptimizedPicture } from './aem.js';

window.carouselId = window.carouselId || 0;

export function createImageCarousel(imageList) {
  if (!imageList || !imageList.length) return null;

  window.carouselId += 1;
  const block = document.createElement('div');
  block.classList.add('carousel');

  const isSingleSlide = imageList.length < 2;

  // const placeholders = await fetchPlaceholders();
  const placeholders = {};

  block.setAttribute('role', 'region');
  block.setAttribute('aria-roledescription', placeholders.carousel || 'Carousel');

  const container = document.createElement('div');
  container.classList.add('carousel-slides-container');

  const slidesWrapper = document.createElement('ul');
  slidesWrapper.classList.add('carousel-slides');
  slidesWrapper.setAttribute('id', `carousel-${window.carouselId}-slides`);

  container.append(slidesWrapper);

  if (!isSingleSlide) {
    const indicator = document.createElement('div');
    indicator.classList.add('carousel-indicator');
    const indicatorWidth = 100 / imageList.length
    indicator.setAttribute('data-slides-count', imageList.length);
    indicator.setAttribute('data-width', indicatorWidth);
    indicator.style.width = `${indicatorWidth}%`;
    indicator.style.left = 0;
    container.appendChild(indicator);
  }

  block.append(container);

  let slideIndicators;
  if (!isSingleSlide) {
    // DO NOT REMOVE THIS slideIndicatorsNav OR THE CAROUSEL WILL NOT WORK
    // If you remove this block, the IntersectionObserver will trigger more times during the initialization
    // and set the slideIndex to the last slide instead of the first
    const slideIndicatorsNav = document.createElement('nav');
    slideIndicatorsNav.setAttribute('aria-label', placeholders.carouselSlideControls || 'Carousel slide controls');
    slideIndicators = document.createElement('ol');
    slideIndicators.classList.add('carousel-slide-indicators');
    slideIndicators.setAttribute('aria-label', placeholders.carouselSlides || 'Carousel slides');
    slideIndicatorsNav.append(slideIndicators);
    block.append(slideIndicatorsNav);

    const slideNavButtons = document.createElement('div');
    slideNavButtons.classList.add('carousel-navigation-buttons');
    slideNavButtons.innerHTML = `
      <button type="button" class= "slide-prev" aria-label="${placeholders.previousSlide || 'Previous Slide'}"></button>
      <button type="button" class="slide-next" aria-label="${placeholders.nextSlide || 'Next Slide'}"></button>
    `;

    container.append(slideNavButtons);
  }

  // Create slides and indicators from the imageList object array
  imageList.forEach((image, idx) => {
    const slide = createImageSlide(image, idx, window.carouselId);
    slidesWrapper.append(slide);

    // if (slideIndicators) {
    //   const indicator = document.createElement('li');
    //   indicator.classList.add('carousel-slide-indicator');
    //   indicator.dataset.targetSlide = idx;
    //   indicator.setAttribute('aria-controls', `carousel-${window.carouselId}-slides`);
    //   indicator.innerHTML = `<button type="button"><span>${idx + 1}</span></button>`;
    //   slideIndicators.append(indicator);
    // }
  });

  if (!isSingleSlide) {
    bindEvents(block);
  }

  // Set initial state
  const slides = block.querySelectorAll('.carousel-slide');
  if (slides.length > 0) {
    updateActiveSlide(slides[0]);
  }

  return block;
}

function updateActiveSlide(slide) {
  const block = slide.closest('.carousel');
  if (!block) return;
  const slideIndex = parseInt(slide.dataset.slideIndex, 10);
  block.dataset.activeSlide = slideIndex;

  const slides = block.querySelectorAll('.carousel-slide');
  slides.forEach((aSlide, idx) => {
    aSlide.setAttribute('aria-hidden', idx !== slideIndex);
    aSlide.setAttribute('tabindex', idx !== slideIndex ? '-1' : '0');
  });

  // const indicators = block.querySelectorAll('.carousel-slide-indicator');
  // indicators.forEach((indicator, idx) => {
  //   const button = indicator.querySelector('button');
  //   if (idx !== slideIndex) {
  //     button.removeAttribute('disabled');
  //   } else {
  //     button.setAttribute('disabled', 'true');
  //   }
  // });
}

function showSlide(block, slideIndex = 0) {
  const slides = block.querySelectorAll('.carousel-slide');
  let realSlideIndex = slideIndex;
  if (slideIndex < 0) {
    realSlideIndex = slides.length - 1;
  } else if (slideIndex >= slides.length) {
    realSlideIndex = 0;
  }
  const activeSlide = slides[realSlideIndex];

  block.querySelector('.carousel-slides').scrollTo({
    top: 0,
    left: activeSlide.offsetLeft,
    behavior: 'smooth',
  });
  const indicator = block.querySelector('.carousel-indicator');
  if (indicator) {
    const left = realSlideIndex * +indicator.getAttribute('data-width');
    if (left != null && !isNaN(left)) {
      indicator.style.left = `${left}%`;
    }
  }
}

function bindEvents(block) {
  // const slideIndicators = block.querySelector('.carousel-slide-indicators');
  // if (!slideIndicators) return;

  // slideIndicators.querySelectorAll('button').forEach((button) => {
  //   button.addEventListener('click', (e) => {
  //     const slideIndicator = e.currentTarget.parentElement;
  //     showSlide(block, parseInt(slideIndicator.dataset.targetSlide, 10));
  //   });
  // });

  block.querySelector('.slide-prev')?.addEventListener('click', () => {
    showSlide(block, parseInt(block.dataset.activeSlide, 10) - 1);
  });

  block.querySelector('.slide-next')?.addEventListener('click', () => {
    showSlide(block, parseInt(block.dataset.activeSlide, 10) + 1);
  });

  const slideObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) updateActiveSlide(entry.target);
    });
  }, { threshold: 0.5 });

  block.querySelectorAll('.carousel-slide').forEach((slide) => {
    slideObserver.observe(slide);
  });
}

/**
 * Creates a carousel slide from an object containing image data.
 * @param {object} imageData The object with image details.
 * @param {string} imageData.image The URL or path to the image.
 * @param {string} imageData.imageAlt The alt text for the image.
 * @param {number} slideIndex The index of the slide.
 * @param {number} carouselId The unique ID of the carousel instance.
 * @returns {HTMLLIElement} The created slide element.
 */
function createImageSlide(imageData, slideIndex, carouselId) {
  const slide = document.createElement('li');
  slide.dataset.slideIndex = slideIndex;
  slide.setAttribute('id', `carousel-${carouselId}-slide-${slideIndex}`);
  slide.classList.add('carousel-slide');
  slide.setAttribute('aria-label', `Slide ${slideIndex + 1}`);
  slide.setAttribute('aria-roledescription', 'slide');

  // Create an optimized picture element using AEM's helper function
  const picture = createOptimizedPicture(imageData.image, imageData.imageAlt, false);
  const img = picture.querySelector('img');
  img.classList.add('carousel-slide-image');

  slide.append(picture);
  return slide;
}