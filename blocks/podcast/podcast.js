import { getBlockModel, createTextElement, createImageElement, createButtonElement, extractImageElements, getButtonModel } from '../../scripts/blockHelper.js';
import { createModal } from '../modal/modal.js';
import { loadFragment } from '../fragment/fragment.js';
import { createImageCarousel } from '../../scripts/imageCarouselHelper.js';

function getProps() {
  return [
    { name: 'title', tags: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'] },
    { name: 'titleStyle', },
    { name: 'subtitle', tags: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'] },
    { name: 'subtitleStyle', },
    { name: 'subtitleSlowAnimation', isBoolean: true },
    { name: 'fragment', attribute: 'href' },
  ];
}

function getItemsProps() {
  return [
    { name: 'numberEpisode' },
    { name: 'title' },
    { name: 'text' },
    { name: 'audio', attribute: 'href' },
    { name: 'ctaText' },
    { name: 'ctaLink' },
  ];
}

export default async function decorate(block) {
  let modelData = getBlockModel(block, getProps());

  if (modelData.fragment.value) {
    const fragment = await loadFragment(modelData.fragment.value);
    modelData.fragment.html = fragment.querySelector('& > div');
    if (modelData.fragment.html) {
      modelData.fragment.items = []
      for (let i = 0; i < modelData.fragment.html.children.length; i++) {
        const child = modelData.fragment.html.children[i].querySelector('& > div');
        const { child: updatedBlock, images } = extractImageElements(child);
        const item = getBlockModel(child, getItemsProps());
        item.images = images;
        modelData.fragment.items.push(item);
      }
    }
  }

  block.innerHTML = '';

  const container = document.createElement('div');
  container.classList.add('main-container');

  const textSection = document.createElement('div');
  textSection.classList.add('podcast-text-section');

  if (modelData.title.value) {
    textSection.appendChild(createTextElement(modelData.title, ['podcast-title']));
  }
  if (modelData.subtitle.value) {
    textSection.appendChild(createTextElement(modelData.subtitle, ['podcast-subtitle']));
  }

  const carouselSection = document.createElement('div');
  carouselSection.classList.add('podcast-carousel-section');
  (modelData.fragment?.items || []).forEach(item => {
    const carouselItem = document.createElement('div');
    carouselItem.classList.add('podcast-carousel-item');

    const carouselVideo = document.createElement('div');
    // Background image
    if (item.images.length) {
      carouselVideo.style.backgroundImage = `url(${item.images[0].image})`;
      carouselVideo.classList.add('with-background-image');
    }
    // Texts
    if (item.numberEpisode) {
      carouselVideo.appendChild(createTextElement(item.numberEpisode));
    }
    if (item.title) {
      carouselVideo.appendChild(createTextElement(item.title));
    }

    // Audio reader
    const audio = document.createElement('audio');
    audio.controls = true;
    const source = document.createElement('source');
    source.src = item.audio.value;
    audio.addEventListener('ended', function () {
      playPauseButton.classList.add('paused');
      carouselVideo.classList.remove('is-playing');
    });
    audio.addEventListener('timeupdate', function () {
      const remainingTime = audio.duration - audio.currentTime;
      const minutes = Math.floor(remainingTime / 60);
      const seconds = Math.floor(remainingTime % 60);

      const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
      remainingTimeDisplay.textContent = `- ${formattedTime}`;

      const progress = (audio.currentTime / audio.duration) * 100;
      progressBar.style.width = `${progress}%`;
    });
    audio.addEventListener('play', () => {
      carouselVideo.classList.add('is-playing');
    });
    audio.addEventListener('pause', () => {
      carouselVideo.classList.remove('is-playing');
    });
    audio.appendChild(source);
    carouselVideo.appendChild(audio)

    // Play / pause button
    const playPauseButton = document.createElement('div');
    playPauseButton.classList.add('button-play-pause');
    playPauseButton.onclick = (event) => {
      if (audio.paused) {
        // Before stop every audio in the page
        const allAudio = carouselSection.querySelectorAll('audio');
        allAudio.forEach(el => {
          el.pause();
          audio.currentTime = 0;
        });

        audio.play();
      } else {
        audio.pause();
      }
    };
    carouselVideo.appendChild(playPauseButton);

    // Remaining time
    const remainingTimeDisplay = document.createElement('div');
    remainingTimeDisplay.classList.add('remaining-time');
    carouselVideo.appendChild(remainingTimeDisplay);

    // Progress bar
    const progressContainer = document.createElement('div');
    progressContainer.classList.add('progress-container');
    const progressBar = document.createElement('div');
    progressBar.classList.add('progress-bar');
    progressContainer.appendChild(progressBar);
    carouselVideo.appendChild(progressContainer);

    carouselItem.appendChild(carouselVideo);

    // Texts under audio
    const carouselText = document.createElement('div');
    if (item.text)
      carouselText.appendChild(createTextElement(item.text, ['body-2-light', 'podcast-carousel-text']));
    if (item.ctaLink && item.ctaText) {
      const link = document.createElement('a');
      link.classList.add('body-2-medium');
      link.textContent = item.ctaText;
      link.href = item.ctaLink;
      carouselText.appendChild(link);
    }
    carouselItem.appendChild(carouselText);

    carouselSection.appendChild(carouselItem);
  });

  container.appendChild(textSection);
  container.appendChild(carouselSection);
  block.appendChild(container);
}