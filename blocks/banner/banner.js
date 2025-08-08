import { getBlockModel, getButtonModel, createButtonElement, createTextElement, extractImageElements, createImageElement } from '../../scripts/blockHelper.js';

function getProps() {
  return [
    { name: 'title', tags: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'] },
    { name: 'mainTitleStyle', isBoolean: true },
    { name: 'subtitle', tags: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'] },
    { name: 'secondSubtitle', tags: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'] },
    { name: 'subtitleQuotes', isBoolean: true },
    { name: 'verticalText' },
    { name: 'horizontalAlign' },
    { name: 'verticalAlign' },
    { name: 'mediaType' },
    { name: 'imageOpacity', isBoolean: true },
    { name: 'componentSize' },
    { name: 'darkBackground', isBoolean: true }
  ];
}

export default function decorate(block) {
  const { block: updatedBlock, images } = extractImageElements(block);

  let modelData = getBlockModel(block, getProps());
  if (block.children.length > getProps().length) {
    modelData.button = getButtonModel(block.children[getProps().length]);
  }
  modelData.images = images;


  // Create main container
  const banner = document.createElement('div');
  banner.classList.add('banner-block');

  let isGallery = false;
  if (modelData.images.length) {
    if (!modelData.mediaType || modelData.mediaType == 'image') {
      banner.style.backgroundImage = `url('${modelData.images[0].image}')`;
    } else if (modelData.mediaType == 'gallery') {
      isGallery = true;
      const mainDiv = document.createElement('div');
      mainDiv.classList.add('gallery-container');

      for (let i = 0; i < 4; i++) {
        const galleryItem = document.createElement('div');
        galleryItem.classList.add('gallery-item');

        // TODO: remove mock for image
        for (let j = 0; j < 4; j++) {
          galleryItem.appendChild(createImageElement(modelData.images[0]));
        }

        mainDiv.appendChild(galleryItem);
      }

      banner.appendChild(mainDiv);
    } else if (modelData.mediaType == 'video') {

    }
  }

  if (modelData.imageOpacity) {
    banner.style.setProperty('--banner-overlay-opacity', '0.4');
  }
  if (isGallery) {
    banner.classList.add('banner-gallery');
  } else if (modelData.componentSize) {
    banner.classList.add(modelData.componentSize);
  }

  // Create content container
  const content = document.createElement('div');
  content.className = 'banner-content';

  if (modelData.title.value) {
    const titleClasses = ['banner-title'];
    if (modelData.mainTitleStyle) {
      titleClasses.push('main-title');
    }
    content.appendChild(createTextElement(modelData.title, titleClasses));
  }

  const subtitleClasses = ['banner-subtitle'];
  if (modelData.subtitleQuotes) {
    subtitleClasses.push('banner-subtitle-with-quotes');
  }
  const hasBothSubtitles = modelData.subtitle.value && modelData.secondSubtitle.value;
  if (hasBothSubtitles) {
    const subtitlesContainer = document.createElement('div');
    subtitlesContainer.classList.add('subtitles-container');
    subtitleClasses.push('subtitle-item');
    subtitlesContainer.appendChild(createTextElement(modelData.subtitle, subtitleClasses));
    subtitlesContainer.appendChild(createTextElement(modelData.secondSubtitle, subtitleClasses));
    content.appendChild(subtitlesContainer);
  } else {
    if (modelData.subtitle.value) {
      content.appendChild(createTextElement(modelData.subtitle, subtitleClasses));
    }
    if (modelData.secondSubtitle.value) {
      content.appendChild(createTextElement(modelData.secondSubtitle, subtitleClasses));
    }

    if (modelData.horizontalAlign) {
      content.classList.add(modelData.horizontalAlign);
    }
    if (modelData.verticalAlign) {
      content.classList.add(modelData.verticalAlign);
    }
  }

  if (modelData.button?.link && modelData.button?.text) {
    content.appendChild(createButtonElement(modelData.button));
  }

  if (modelData.verticalText) {
    const smallText = document.createElement('span');
    smallText.className = 'vertical-text';
    smallText.textContent = modelData.verticalText;
    content.appendChild(smallText);
  }

  banner.appendChild(content);

  block.innerHTML = '';
  block.appendChild(banner);

  if (modelData.darkBackground) {
    block.classList.add('dark-background');
  }
}