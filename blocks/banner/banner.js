import { getBlockModel, getButtonModel, createButtonElement, createTextElement, extractImageElements, createImageElement } from '../../scripts/blockHelper.js';

function getProps() {
  return [
    { name: 'title', tags: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'] },
    { name: 'titleStyle' },
    { name: 'subtitle', tags: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'] },
    { name: 'subtitleStyle' },
    { name: 'secondSubtitle', tags: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'] },
    { name: 'secondSubtitleStyle' },
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

  modelData.title.style = modelData.titleStyle;
  modelData.subtitle.style = modelData.subtitleStyle;
  modelData.secondSubtitle.style = modelData.secondSubtitleStyle;

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

      const list1 = [];
      const list2 = [];
      const list3 = [];
      const list4 = [];

      modelData.images.forEach((item, index) => {
        if (index % 4 === 0) {
          list1.push(item);
        } else if (index % 4 === 1) {
          list2.push(item);
        } else if (index % 4 === 2) {
          list3.push(item);
        } else {
          list4.push(item);
        }
      });
      const listsImages = [list1, list2, list3, list4];

      for (let i = 0; i < 4; i++) {
        const galleryItem = document.createElement('div');
        galleryItem.classList.add('gallery-item');

        // TODO: remove mock for image
        for (let j = 0; j < listsImages[i].length; j++) {
          galleryItem.appendChild(createImageElement(listsImages[i][j]));
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