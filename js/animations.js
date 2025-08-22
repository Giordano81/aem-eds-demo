const verticalText = Array.from(document.querySelectorAll('main > div [class*="-wrapper"]'));
const blockWrapper = Array.from(document.querySelectorAll('main > div [class*="-wrapper"]:not(.be-part-of-wrapper)'));
// BE PART OF
const textContainer = Array.from(document.querySelectorAll('main > div .be-part-of-wrapper div.text-container:not(.text-container-manual)'));
const buttons = Array.from(document.querySelectorAll('main > div .be-part-of-wrapper .button-animation'));
const fadeinAnimation = Array.from(document.querySelectorAll('main > div .be-part-of-wrapper .fade-in-animation:not(.fade-in-animation-manual)'));

window.addEventListener('scroll', () => {
  scrollEvent();
});

function isInView(el) {
  const rect = el.getBoundingClientRect();
  const elementHeight = rect.height;
  const visibleHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
  const isInView = visibleHeight >= (0.75 * elementHeight); // 75%
  return isInView;
}

function scrollEvent() {
  for (let i = 0; i < blockWrapper.length; i++) {
    const el = blockWrapper[i];

    if (isInView(el)) {
      showElementsInBlock(el);
      blockWrapper.splice(i, 1);
      i--;
    }
  }

  for (let i = 0; i < verticalText.length; i++) {
    const text = document.querySelector('.page-vertical-text');
    if (!text) break;

    const el = verticalText[i];

    if (isInView(el)) {
      const child = el.querySelector('[data-vertical-text]')
      text.textContent = child ? child.getAttribute('data-vertical-text') : '';
    }
  }


  // BE PART OF
  for (let i = 0; i < textContainer.length; i++) {
    const el = textContainer[i];

    if (isInView(el) && !el.children[0].classList.contains('visible')) {
      setTimeout(() => {
        el.children[0].classList.add('visible');
      }, el.children[0].getAttribute('data-delayed') === 'true' ? 1500 : 0);
      textContainer.splice(i, 1);
      i--;
    }
  }

  for (let i = 0; i < buttons.length; i++) {
    const el = buttons[i];

    if (isInView(el) && !el.classList.contains('visible')) {
      setTimeout(() => {
        el.classList.add('visible');
      }, el.getAttribute('data-delayed') === 'true' ? 1500 : 0);
      buttons.splice(i, 1);
      i--;
    }
  }

  for (let i = 0; i < fadeinAnimation.length; i++) {
    const el = fadeinAnimation[i];

    if (isInView(el) && !el.classList.contains('visible')) {
      setTimeout(() => {
        el.classList.add('visible');
      }, el.getAttribute('data-delayed') ? +el.getAttribute('data-delayed') : 0);
      fadeinAnimation.splice(i, 1);
      i--;
    }
  }
}

function showElementsInBlock(block) {
  const textContainer = Array.from(block.querySelectorAll('div.text-container:not(.text-container-manual)'));
  const buttons = Array.from(block.querySelectorAll('.button-animation'));
  const bannerGalleryContainer = Array.from(block.querySelectorAll('.gallery-container'));
  const fadeinAnimation = Array.from(block.querySelectorAll('.fade-in-animation:not(.fade-in-animation-manual)'));
  const backgroundGallery = Array.from(block.querySelectorAll('.banner-background-gallery .background-gallery-container'));

  for (let i = 0; i < textContainer.length; i++) {
    const el = textContainer[i];
    if (!el.children[0].classList.contains('visible')) {
      setTimeout(() => {
        el.children[0].classList.add('visible');
      }, el.children[0].getAttribute('data-delayed') === 'true' ? 1500 : 0);
    }
  }

  for (let i = 0; i < buttons.length; i++) {
    const el = buttons[i];
    if (!el.classList.contains('visible')) {
      setTimeout(() => {
        el.classList.add('visible');
      }, el.getAttribute('data-delayed') === 'true' ? 1500 : 0);
    }
  }

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

  for (let i = 0; i < fadeinAnimation.length; i++) {
    const el = fadeinAnimation[i];
    if (!el.classList.contains('visible')) {
      setTimeout(() => {
        el.classList.add('visible');
      }, el.getAttribute('data-delayed') ? +el.getAttribute('data-delayed') : 0);
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

function initVerticalText() {
  if (document.querySelectorAll('[data-vertical-text]').length) {
    const smallText = document.createElement('span');
    smallText.classList.add('page-vertical-text');
    document.querySelector('main').appendChild(smallText);
  }
}

export function executeAnimationOnElement(element) {
  const textContainer = Array.from(element.querySelectorAll('div.text-container:not(.text-container-manual)'));
  const buttons = Array.from(element.querySelectorAll('.button-animation'));
  const fadeinAnimation = Array.from(element.querySelectorAll('.fade-in-animation:not(.fade-in-animation-manual)'));

  for (let i = 0; i < textContainer.length; i++) {
    const el = textContainer[i];

    if (isInView(el) && !el.children[0].classList.contains('visible')) {
      setTimeout(() => {
        el.children[0].classList.add('visible');
      }, el.children[0].getAttribute('data-delayed') === 'true' ? 1500 : 0);
      textContainer.splice(i, 1);
      i--;
    }
  }

  for (let i = 0; i < buttons.length; i++) {
    const el = buttons[i];

    if (isInView(el) && !el.classList.contains('visible')) {
      setTimeout(() => {
        el.classList.add('visible');
      }, el.getAttribute('data-delayed') === 'true' ? 1500 : 0);
      buttons.splice(i, 1);
      i--;
    }
  }

  for (let i = 0; i < fadeinAnimation.length; i++) {
    const el = fadeinAnimation[i];

    if (isInView(el) && !el.classList.contains('visible')) {
      setTimeout(() => {
        el.classList.add('visible');
      }, el.getAttribute('data-delayed') ? +el.getAttribute('data-delayed') : 0);
      fadeinAnimation.splice(i, 1);
      i--;
    }
  }

  scrollEvent();
}

setTimeout(() => {
  scrollEvent();
}, 1000);

initVerticalText();