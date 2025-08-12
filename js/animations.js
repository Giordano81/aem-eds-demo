const textContainer = Array.from(document.querySelectorAll('div.text-container'));
const buttons = Array.from(document.querySelectorAll('.button-animation'));
const bannerGalleryContainer = Array.from(document.querySelectorAll('.gallery-container'));
const fadeinAnimation = Array.from(document.querySelectorAll('.fade-in-animation'));

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
      el.classList.add('visible');
      fadeinAnimation.splice(i, 1);
      i--;
    }
  }
}

setTimeout(() => {
  scrollEvent();
}, 500);