const textContainer = Array.from(document.querySelectorAll('div.text-container'));

window.addEventListener('scroll', () => {
  scrollEvent();
});

function scrollEvent() {
  textContainer.forEach((el, index) => {
    const rect = el.getBoundingClientRect();
    const isInView = rect.top <= (window.innerHeight / 2) && rect.bottom >= 0;

    if (isInView && !el.children[0].classList.contains('visible')) {
      el.children[0].classList.add('visible');
      textContainer.splice(index, 1);
    }
  });
}

setTimeout(() => {
  scrollEvent();
}, 500);