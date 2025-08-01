import { getBlockModel, getButtonModel, createButtonElement, createTextElement, extractImageElements, createImageElement } from '../../scripts/blockHelper.js';

function getProps() {
  return [
    { name: 'title', tags: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'] },
    { name: 'subtitle', tags: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'] },
    { name: 'subtitleQuotes', isBoolean: true },
    { name: 'horizontalAlign' },
    { name: 'verticalAlign' },
    { name: 'mediaType' },
    { name: 'imageOpacity', isBoolean: true },
    { name: 'componentSize' }
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
  banner.className = 'banner-block';

  let isGallery = false;
  if (modelData.images.length) {
    if (!modelData.mediaType || modelData.mediaType == 'image') {
      banner.style.backgroundImage = `url('${modelData.images[0].image}')`;
    } else if (modelData.mediaType == 'gallery') {
      isGallery = true;
      const mainDiv = document.createElement('div');
      mainDiv.className = 'gallery-container';

      for (let i = 0; i < 4; i++) {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';

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
  if (modelData.horizontalAlign) {
    content.classList.add(modelData.horizontalAlign);
  }
  if (modelData.verticalAlign) {
    content.classList.add(modelData.verticalAlign);
  }

  content.appendChild(createTextElement(modelData.title, ['banner-title']));

  const subtitleClasses = ['banner-subtitle'];
  if (modelData.subtitleQuotes) {
    subtitleClasses.push('banner-subtitle-with-quotes');
  }
  content.appendChild(createTextElement(modelData.subtitle, subtitleClasses));

  if (modelData.button?.link && modelData.button?.text) {
    content.appendChild(createButtonElement(modelData.button));
  }

  banner.appendChild(content);

  block.innerHTML = '';
  block.appendChild(banner);
}