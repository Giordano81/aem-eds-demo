import { getBlockModel, getButtonModel, createButtonElement, createTextElement, extractImageElements, createImageElement, crateBackgroundGallery, setDataSet } from '../../js/blockHelper.js';
import { loadFragment } from '../fragment/fragment.js';

function getProps() {
  return [
    { name: 'title', tags: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'] },
    { name: 'titleStyle' },
    { name: 'subtitle', tags: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'] },
    { name: 'subtitleStyle' },
    { name: 'subtitleSlowAnimation', isBoolean: true },
    { name: 'secondSubtitle', tags: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'] },
    { name: 'secondSubtitleStyle' },
    { name: 'subtitleQuotes', isBoolean: true },
    { name: 'eyebrow' },
    { name: 'verticalText' },
    { name: 'horizontalAlign' },
    { name: 'verticalAlign' },
    { name: 'mediaType' },
    { name: 'splittedIn2', isBoolean: true },
    { name: 'imageOpacity', isBoolean: true },
    { name: 'darkBackground', isBoolean: true },
    { name: 'galleryMediaFragment', attribute: 'href' },
    { name: 'video', attribute: 'href' },
    { name: 'galleryZoom', isBoolean: true },
    { name: 'galleryAnimation' },
    { name: 'galleryFastAnimation', isBoolean: true },
    { name: 'galleryFullscreen', isBoolean: true },
    { name: 'removeFullscreen', isBoolean: true }
  ];
}

function getItemsProps() {
  return [
    { name: 'image', attribute: 'src' },
    { name: 'altText' },
    { name: 'text' },
    { name: 'textPosition' },
    { name: 'ctaText' },
    { name: 'ctaLink', attribute: 'href' },
    { name: 'hoverText' }
  ];
}

export default async function decorate(block) {
  const { block: updatedBlock, images } = extractImageElements(block);

  let modelData = getBlockModel(block, getProps());
  if (block.children.length > getProps().length) {
    modelData.button = getButtonModel(block.children[getProps().length]);
  }
  modelData.images = images;

  if (modelData.galleryMediaFragment.value) {
    const fragment = await loadFragment(modelData.galleryMediaFragment.value);
    modelData.galleryMediaFragment.html = fragment.querySelector('& > div');
    if (modelData.galleryMediaFragment.html) {
      modelData.galleryMediaFragment.items = []
      for (let i = 0; i < modelData.galleryMediaFragment.html.children.length; i++) {
        const sponsorItem = modelData.galleryMediaFragment.html.children[i].querySelector('& > div');

        // Remove all child blocks so is possible to extract images for carousel without touching image for logo
        const otherBlocks = document.createElement('div');
        while (sponsorItem.children.length > getItemsProps().length) {
          otherBlocks.appendChild(sponsorItem.children[getItemsProps().length]);
        }
        const item = getBlockModel(sponsorItem, getItemsProps());
        modelData.galleryMediaFragment.items.push(item);
      }
    }
  }

  block.innerHTML = '';

  // Create main container
  const banner = document.createElement('div');
  banner.classList.add('banner-block');
  if (modelData.imageOpacity) {
    banner.classList.add('with-overlay-opacity');
    banner.style.setProperty('--banner-overlay-opacity', '0.4');
  }

  const elementsToBeAppendedAtTheEnd = [];

  const textSection = createTextSection(modelData);

  // Media section
  if (modelData.mediaType == 'gallery') {
    banner.classList.add(modelData.galleryFullscreen ? 'banner-with-gallery-fullscreen' : 'banner-with-gallery');

    const mainDiv = document.createElement('div');
    mainDiv.classList.add('gallery-container');
    if (modelData.galleryFastAnimation) {
      mainDiv.classList.add('gallery-fast-animation');
    }
    modelData.galleryMediaFragment.items.forEach((item, index) => {
      mainDiv.appendChild(createGalleryItem(item, modelData));
    });
    if (modelData.galleryAnimation) {
      mainDiv.classList.add(modelData.galleryAnimation);
    }
    elementsToBeAppendedAtTheEnd.push(mainDiv);
  } else if (modelData.mediaType == 'video') {
    const videoContainer = document.createElement('div');
    videoContainer.classList.add('video-container');

    const video = document.createElement('video');
    video.autoplay = true;
    video.muted = true;
    video.loop = true;
    const source = document.createElement('source');
    source.src = modelData.video.value;
    video.appendChild(source);

    const playPauseButton = document.createElement('div');
    playPauseButton.classList.add('button-play-pause');
    playPauseButton.onclick = (event) => {
      if (video.paused) {
        video.play();
        playPauseButton.classList.remove('paused');
      } else {
        video.pause();
        playPauseButton.classList.add('paused');
      }
    };

    videoContainer.appendChild(video);
    videoContainer.appendChild(playPauseButton);

    banner.appendChild(videoContainer);
  } else if (modelData.images.length) {
    if (!modelData.mediaType || modelData.mediaType == 'image') {
      if (modelData.splittedIn2) {
        banner.classList.add('splitted-in-2-rows');
        textSection.classList.add('text-section-splitted');

        const imageContainer = document.createElement('div');
        setDataSet(imageContainer, modelData.images[0]);
        imageContainer.classList.add('image-section-splitted', 'fade-in-animation');
        imageContainer.appendChild(createImageElement(modelData.images[0]));
        elementsToBeAppendedAtTheEnd.push(imageContainer);
      } else {
        banner.classList.add('with-background-image');
        banner.style.backgroundImage = `url('${modelData.images[0].image}')`;
        setDataSet(banner, modelData.images[0]);
      }
    } else if (modelData.mediaType == 'backgroundGallery') {
      banner.classList.add('banner-background-gallery');
      const mainDiv = crateBackgroundGallery(modelData.images);
      banner.appendChild(mainDiv);
    }
  }

  banner.appendChild(textSection);

  elementsToBeAppendedAtTheEnd.forEach(element => {
    banner.appendChild(element);
  });

  block.appendChild(banner);

  if (modelData.darkBackground) {
    block.classList.add('dark-background');
  }
  if (modelData.removeFullscreen) {
    block.closest('.banner-wrapper').classList.add('not-fullscreen');
  }
}

function createTextSection(modelData) {
  const content = document.createElement('div');
  content.className = 'banner-content';

  if (modelData.eyebrow) {
    content.appendChild(createTextElement(modelData.eyebrow, ['banner-eyebrow']));
  }
  if (modelData.title.value) {
    const titleClasses = ['banner-title'];
    content.appendChild(createTextElement(modelData.title, titleClasses));

    if (modelData.title.style === 'main-title') {
      content.style.width = '100%';
    }
  }

  if (modelData.subtitle.value && modelData.secondSubtitle.value) {
    const subtitlesContainer = document.createElement('div');
    subtitlesContainer.classList.add('subtitles-container');
    const subtitle = createTextElement(modelData.subtitle, []);
    const secondSubtitle = createTextElement(modelData.secondSubtitle, []);
    subtitle.classList.add('subtitle-item');
    secondSubtitle.classList.add('subtitle-item');
    subtitlesContainer.appendChild(subtitle);
    subtitlesContainer.appendChild(secondSubtitle);
    content.appendChild(subtitlesContainer);
    content.style.width = '100%';
  } else {
    const subtitleClasses = [];
    if (modelData.subtitleQuotes) {
      subtitleClasses.push('banner-subtitle-with-quotes');
    }
    if (modelData.subtitle.value) {
      content.appendChild(createTextElement(modelData.subtitle, subtitleClasses));
    }
    // if (modelData.secondSubtitle.value) {
    //   content.appendChild(createTextElement(modelData.secondSubtitle, subtitleClasses));
    // }

    if (modelData.horizontalAlign) {
      content.classList.add(modelData.horizontalAlign);
    }
    if (modelData.verticalAlign) {
      content.classList.add(modelData.verticalAlign);
    }
  }

  if (modelData.button) {
    content.appendChild(createButtonElement(modelData.button));
  }

  if (modelData.verticalText) {
    content.setAttribute('data-vertical-text', modelData.verticalText);
  }

  return content;
}

function createGalleryItem(item, modelData) {
  const gridItem = document.createElement('div');
  gridItem.className = 'photo-gallery-item';

  const imageModel = {
    image: item.image.value,
    imageAlt: item.altText
  }
  const img = createImageElement(imageModel);

  const text = document.createElement('div');
  text.textContent = item.text;

  if (item.ctaText && item.ctaLink.value) {
    const buttonModel = {
      type: 'secondary',
      text: item.ctaText,
      link: item.ctaLink
    };
    const button = createButtonElement(buttonModel);

    const container = document.createElement('div');
    container.classList.add('overlay-text', 'overlay-text-center');
    if (item.text) {
      text.classList.add('body-1-medium');
      container.appendChild(text);
    }
    container.appendChild(button);
    gridItem.appendChild(container);

    if (!modelData.galleryFullscreen)
      gridItem.classList.add('medium-shadow');
  } else {
    // Choose overlay or bottom text
    if (item.textPosition === 'center') {
      text.classList.add('overlay-text', 'overlay-text-center', 'body-1-medium');
    } else if (item.textPosition === 'bottom') {
      text.classList.add('overlay-text', 'overlay-text-bottom');
    }

    if (item.text) {
      gridItem.appendChild(text);

      if (!modelData.galleryFullscreen)
        gridItem.classList.add('small-shadow');
    }
  }

  if (item.hoverText) {
    gridItem.classList.add('with-hover-text');

    const hoverText = document.createElement('div');
    hoverText.textContent = item.hoverText;
    hoverText.classList.add('overlay-text', 'overlay-text-center', 'hover-text');
    gridItem.appendChild(hoverText);
  }

  if (modelData.galleryZoom) {
    gridItem.classList.add('with-hover');
  }

  if (item.image.value) {
    gridItem.appendChild(img);
  }

  return gridItem;
}