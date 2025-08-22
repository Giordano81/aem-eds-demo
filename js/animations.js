const verticalText = Array.from(document.querySelectorAll('main > div [class*="-wrapper"]'));
const blockWrapper = Array.from(document.querySelectorAll('main > div [class*="-wrapper"]:not(.be-part-of-wrapper)'));
// BE PART OF or other pages with very high blocks
const textContainer = Array.from(document.querySelectorAll('main > div .be-part-of-wrapper div.text-container:not(.text-container-manual)'));
const buttons = Array.from(document.querySelectorAll('main > div .be-part-of-wrapper .button-animation'));
const fadeinAnimation = Array.from(document.querySelectorAll('main > div .be-part-of-wrapper .fade-in-animation:not(.fade-in-animation-manual)'));

window.addEventListener('scroll', scrollEvent);

function scrollEvent() {
  handleVisibility(blockWrapper, false, showElementsInBlock);

  const text = document.querySelector('.page-vertical-text');
  if (text) {
    verticalText.forEach(el => {
      if (isInView(el)) {
        const child = el.querySelector('[data-vertical-text]');
        text.textContent = child ? child.getAttribute('data-vertical-text') : '';
      }
    });
  }

  // BE PART OF or other pages with very high blocks
  handleBasicElements(false, textContainer, buttons, fadeinAnimation);
}

function handleVisibility(elements, doNotCheckIsInView, callback) {
  for (let i = 0; i < elements.length; i++) {
    const el = elements[i];
    if (doNotCheckIsInView || isInView(el)) {
      callback(el);
      elements.splice(i, 1);
      i--;
    }
  }
}

function isInView(el) {
  const rect = el.getBoundingClientRect();
  const visibleHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
  // If the element is greater than the screen, I have to check in another way
  const isInViewFallback = rect.height > window.innerHeight && rect.top <= (window.innerHeight / 4) && rect.bottom >= 0;
  return (visibleHeight >= (0.75 * rect.height)) || isInViewFallback; // 75%
}

function handleBasicElements(doNotCheckIsInView, textContainer, buttons, fadeinAnimation) {
  handleVisibility(textContainer, doNotCheckIsInView, el => {
    if (!el.children[0].classList.contains('visible')) {
      setTimeout(() => {
        el.children[0].classList.add('visible');
      }, el.children[0].getAttribute('data-delayed') === 'true' ? 1500 : 0);
    }
  });

  handleVisibility(buttons, doNotCheckIsInView, el => {
    if (!el.classList.contains('visible')) {
      setTimeout(() => {
        el.classList.add('visible');
      }, el.getAttribute('data-delayed') === 'true' ? 1500 : 0);
    }
  });

  handleVisibility(fadeinAnimation, doNotCheckIsInView, el => {
    if (!el.classList.contains('visible')) {
      setTimeout(() => {
        el.classList.add('visible');
      }, el.getAttribute('data-delayed') ? +el.getAttribute('data-delayed') : 0);
    }
  });
}

function showElementsInBlock(block) {
  const textContainer = Array.from(block.querySelectorAll('div.text-container:not(.text-container-manual)'));
  const buttons = Array.from(block.querySelectorAll('.button-animation'));
  const bannerGalleryContainer = Array.from(block.querySelectorAll('.gallery-container'));
  const fadeinAnimation = Array.from(block.querySelectorAll('.fade-in-animation:not(.fade-in-animation-manual)'));
  const backgroundGallery = Array.from(block.querySelectorAll('.banner-background-gallery .background-gallery-container'));

  handleBasicElements(true, textContainer, buttons, fadeinAnimation);

  for (let i = 0; i < bannerGalleryContainer.length; i++) {
    const el = bannerGalleryContainer[i];
    if (!el.classList.contains('visible')) {
      const children = el.querySelectorAll('.photo-gallery-item');
      let currentIndex = 0;
      const timeout = el.classList.contains('gallery-fast-animation') ? 600 : 1000;
      function showNextImage() {
        if (currentIndex < children.length) {
          const currentImage = children[currentIndex];
          currentImage.classList.add('visible');

          setTimeout(() => {
            currentIndex++;
            showNextImage();
          }, timeout);
        }
      }
      showNextImage();
    }
  }

  for (let i = 0; i < backgroundGallery.length; i++) {
    const el = backgroundGallery[i];
    const galleryItems = el.querySelectorAll('.background-gallery-item');
    for (let i = 0; i < galleryItems.length; i++) {
      const item = galleryItems[i];

      let scrollSpeed = 0;
      function scrollElement() {
        item.style.transform = `translateY(${scrollSpeed}px)`;
        if (i % 2 == 0) {
          scrollSpeed--;
          if (scrollSpeed <= -923) clearInterval(scrollInterval);
        }
        else {
          scrollSpeed++;
          if (scrollSpeed >= 923) clearInterval(scrollInterval);
        }
      }
      const scrollInterval = setInterval(scrollElement, 20);
    }
  }
}

export function executeAnimationOnElement(element) {
  const textContainer = Array.from(element.querySelectorAll('div.text-container:not(.text-container-manual)'));
  const buttons = Array.from(element.querySelectorAll('.button-animation'));
  const fadeinAnimation = Array.from(element.querySelectorAll('.fade-in-animation:not(.fade-in-animation-manual)'));

  handleBasicElements(false, textContainer, buttons, fadeinAnimation);

  scrollEvent();
}

setTimeout(scrollEvent, 1000);

function initVerticalText() {
  if (document.querySelectorAll('[data-vertical-text]').length) {
    const smallText = document.createElement('span');
    smallText.classList.add('page-vertical-text');
    document.querySelector('main').appendChild(smallText);
  }
}

initVerticalText();
