const textContainer = Array.from(document.querySelectorAll('div.text-container'));
const buttons = Array.from(document.querySelectorAll('.button-animation'));
const bannerGalleryContainer = Array.from(document.querySelectorAll('.gallery-container'));
const fadeinAnimation = Array.from(document.querySelectorAll('.fade-in-animation'));
const verticalText = Array.from(document.querySelectorAll('main > div [class$="-wrapper"]'));

window.addEventListener('scroll', () => {
  scrollEvent();
});

function scrollEvent() {
  for (let i = 0; i < textContainer.length; i++) {
    const el = textContainer[i];
    const rect = el.getBoundingClientRect();
    const isInView = rect.top <= (window.innerHeight / 1.5) && rect.bottom >= 0;

    if (isInView && !el.children[0].classList.contains('visible')) {
      setTimeout(() => {
        el.children[0].classList.add('visible');
      }, el.children[0].getAttribute('data-delayed') === 'true' ? 1500 : 0);
      textContainer.splice(i, 1);
      i--;
    }
  }

  for (let i = 0; i < buttons.length; i++) {
    const el = buttons[i];
    const rect = el.getBoundingClientRect();
    const isInView = rect.top <= (window.innerHeight / 1.5) && rect.bottom >= 0;

    if (isInView && !el.classList.contains('visible')) {
      setTimeout(() => {
        el.classList.add('visible');
      }, el.getAttribute('data-delayed') === 'true' ? 1500 : 0);
      buttons.splice(i, 1);
      i--;
    }
  }

  for (let i = 0; i < bannerGalleryContainer.length; i++) {
    const el = bannerGalleryContainer[i];
    const rect = el.getBoundingClientRect();
    const isInView = rect.top <= (window.innerHeight / 1.5) && rect.bottom >= 0;

    if (isInView && !el.classList.contains('visible')) {
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
      bannerGalleryContainer.splice(i, 1);
      i--;
    }
  }

  for (let i = 0; i < fadeinAnimation.length; i++) {
    const el = fadeinAnimation[i];
    const rect = el.getBoundingClientRect();
    const isInView = rect.top <= (window.innerHeight / 1.5) && rect.bottom >= 0;

    if (isInView && !el.classList.contains('visible')) {
      setTimeout(() => {
        el.classList.add('visible');
      }, el.getAttribute('data-delayed') ? +el.getAttribute('data-delayed') : 0);
      fadeinAnimation.splice(i, 1);
      i--;
    }
  }

  for (let i = 0; i < verticalText.length; i++) {
    const text = document.querySelector('.page-vertical-text');
    if (!text) break;

    const el = verticalText[i];
    const rect = el.getBoundingClientRect();
    const isInView = rect.top <= (window.innerHeight / 2) && rect.bottom >= 0;
    if (isInView) {
      const child = el.querySelector('[data-vertical-text]')
      text.textContent = child ? child.getAttribute('data-vertical-text') : '';
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

setTimeout(() => {
  scrollEvent();
}, 1000);

initVerticalText();