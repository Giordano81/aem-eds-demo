import { createTextElement, setDataSet } from './blockHelper.js';

window.videoCarouselId = window.videoCarouselId || 0;

export function createVideoCarousel(items) {
  if (!items || !items.length) return null;

  window.videoCarouselId += 1;

  const mainContainer = document.createElement('div');

  const block = document.createElement('div');
  block.classList.add('carousel', 'video-carousel-container');

  const isSingleSlide = items.length < 2;

  // const placeholders = await fetchPlaceholders();
  const placeholders = {};

  block.setAttribute('role', 'region');
  block.setAttribute('aria-roledescription', placeholders.carousel || 'Carousel');

  const container = document.createElement('div');
  container.classList.add('carousel-slides-container');

  const slidesWrapper = document.createElement('ul');
  slidesWrapper.classList.add('carousel-slides', 'video-slide');
  slidesWrapper.setAttribute('id', `carousel-${window.videoCarouselId}-slides`);

  container.append(slidesWrapper);

  if (!isSingleSlide) {
    // Left arrow
    const leftArrow = document.createElement('button');
    leftArrow.classList.add('arrow', 'left-arrow', 'slide-prev');
    block.appendChild(leftArrow);
  }

  block.append(container);

  let slideIndicators;
  if (!isSingleSlide) {
    // Right arrow
    const rightArrow = document.createElement('button');
    rightArrow.classList.add('arrow', 'right-arrow', 'slide-next');
    block.appendChild(rightArrow);

    // DO NOT REMOVE THIS slideIndicatorsNav OR THE CAROUSEL WILL NOT WORK
    // If you remove this block, the IntersectionObserver will trigger more times during the initialization
    // and set the slideIndex to the last slide instead of the first
    const slideIndicatorsNav = document.createElement('nav');
    slideIndicatorsNav.setAttribute('aria-label', placeholders.carouselSlideControls || 'Carousel slide controls');
    slideIndicators = document.createElement('ol');
    slideIndicators.classList.add('carousel-slide-indicators');
    slideIndicators.setAttribute('aria-label', placeholders.carouselSlides || 'Carousel slides');
    slideIndicatorsNav.append(slideIndicators);
    slideIndicatorsNav.style.display = 'none';
    block.append(slideIndicatorsNav);
  }

  // Create slides and indicators from the imageList object array
  items.forEach((image, idx) => {
    const slide = createVideoSlide(image, idx, window.videoCarouselId);
    slidesWrapper.append(slide);
  });

  if (!isSingleSlide) {
    bindEvents(block);
  }

  // Set initial state
  const slides = block.querySelectorAll('.carousel-slide');
  if (slides.length > 0) {
    updateActiveSlide(slides[0]);
  }

  // Indicators
  const carouselIndicators = document.createElement('div');
  carouselIndicators.classList.add('carousel-indicators');
  for (let i = 0; i < 3; i++) {
    const indicator = document.createElement('span');
    indicator.classList.add('indicator');
    indicator.setAttribute('data-slide-index', i);
    if (i === 0) indicator.classList.add('active');
    carouselIndicators.appendChild(indicator);
  }

  mainContainer.appendChild(block);
  mainContainer.appendChild(carouselIndicators);
  return mainContainer;
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

  afterChangeSlideEvent(slides, block, slideIndex);
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

  afterChangeSlideEvent(slides, block, realSlideIndex);
}

function afterChangeSlideEvent(slides, block, slideIndex) {
  // Stop every video and set time to 0
  for (let i = 0; i < slides.length; i++) {
    const video = slides[i].querySelector('video');
    video.pause();
    video.currentTime = 0;
  }

  // Update current indicator
  if (block.parentElement) {
    let indicators = block.parentElement.querySelectorAll('.carousel-indicators .indicator');
    for (let i = 0; i < indicators.length; i++) {
      const indicator = indicators[i];
      indicator.classList.remove('active');
      if (indicator.getAttribute('data-slide-index') == slideIndex) {
        indicator.classList.add('active');
      }
    }
  }

  // Add animations
  const activeSlide = slides[slideIndex];
  setTimeout(() => {
    const textContainer = activeSlide.querySelectorAll('.text-container-manual');
    const fadeinAnimation = activeSlide.querySelectorAll('.fade-in-animation-manual');
    for (let i = 0; i < textContainer.length; i++) {
      const el = textContainer[i];
      if (!el.children[0].classList.contains('visible')) {
        setTimeout(() => {
          el.children[0].classList.add('visible');
        }, el.children[0].getAttribute('data-delayed') === 'true' ? 1500 : 0);
      }
    }
    for (let i = 0; i < fadeinAnimation.length; i++) {
      const el = fadeinAnimation[i];
      if (!el.classList.contains('visible')) {
        setTimeout(() => {
          el.classList.add('visible');
        }, el.getAttribute('data-delayed') === 'true' ? 1500 : 0);
      }
    }
  }, 500);
}

function bindEvents(block) {
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
 * @param {object} item The object with details.
 * @param {number} slideIndex The index of the slide.
 * @param {number} carouselId The unique ID of the carousel instance.
 * @returns {HTMLLIElement} The created slide element.
 */
function createVideoSlide(item, slideIndex, carouselId) {
  const slide = document.createElement('li');
  slide.dataset.slideIndex = slideIndex;

  setDataSet(slide, item);

  slide.setAttribute('id', `carousel-${carouselId}-slide-${slideIndex}`);
  slide.classList.add('carousel-slide');
  slide.setAttribute('aria-label', `Slide ${slideIndex + 1}`);
  slide.setAttribute('aria-roledescription', 'slide');
  const videoOverlay = document.createElement('div');
  videoOverlay.classList.add('video-overlay');
  const videoOverlayForMobile = document.createElement('div');
  videoOverlayForMobile.classList.add('video-overlay-for-mobile');

  if (item.title) {
    videoOverlay.appendChild(createTextElement(item.title, ['carousel-title'], false, slideIndex > 0));
  }
  if (item.subtitle) {
    const subtitleClasses = ['carousel-subtitle', 'fade-in-animation', 'only-for-desktop'];
    if (slideIndex > 0) subtitleClasses.push('fade-in-animation-manual');
    videoOverlay.appendChild(createTextElement(item.subtitle, subtitleClasses, true));
    videoOverlayForMobile.appendChild(createTextElement(item.subtitle, subtitleClasses, true));
  }

  const videoContainer = document.createElement('div');
  videoContainer.classList.add('carousel-video-container');
  const video = document.createElement('video');
  if (item.altText) {
    video.setAttribute('alt', item.altText);
  }
  video.muted = true;
  const source = document.createElement('source');
  source.src = item.video.value;
  video.appendChild(source);
  videoContainer.appendChild(video);

  // Event needed when changing slide
  video.addEventListener('pause', () => {
    slide.classList.remove('isPlaying');
  });
  video.addEventListener('ended', function () {
    video.currentTime = 0;
  });

  const playPauseIcon = document.createElement('div');
  playPauseIcon.classList.add('play-pause-icon');
  playPauseIcon.addEventListener('click', (event) => {
    if (video.paused) {
      video.play();
      slide.classList.add('isPlaying');
    } else {
      video.pause();
      slide.classList.remove('isPlaying');
    }
  });
  videoContainer.appendChild(playPauseIcon);

  slide.appendChild(videoOverlay);
  slide.appendChild(videoContainer);
  slide.appendChild(videoOverlayForMobile);
  return slide;
}