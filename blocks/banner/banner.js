import { getBlockModel, getButtonModel, createButtonElement, createTextElement, extractImageElements, createImageElement } from '../../scripts/blockHelper.js';
import { loadFragment } from '../fragment/fragment.js';

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
    { name: 'darkBackground', isBoolean: true },
    { name: 'galleryMediaFragment', attribute: 'href' }
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

  modelData.title.style = modelData.titleStyle;
  modelData.subtitle.style = modelData.subtitleStyle;
  modelData.secondSubtitle.style = modelData.secondSubtitleStyle;

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

  // Media section
  if (modelData.mediaType == 'gallery') {
    banner.classList.add('banner-with-gallery');

    const mainDiv = document.createElement('div');
    mainDiv.classList.add('gallery-container');
    // mainDiv.style.gridTemplateColumns = `repeat(${modelData.galleryMediaFragment.items.length}, 1fr)`;
    modelData.galleryMediaFragment.items.forEach((item, index) => {
      // const galleryItem = document.createElement('div');
      // galleryItem.classList.add('gallery-item');
      // const imageModel = {
      //   image: item.image.value,
      //   imageAlt: item.altText
      // };
      // galleryItem.appendChild(createImageElement(imageModel));
      // mainDiv.appendChild(galleryItem);

      mainDiv.appendChild(createGalleryItem(item));
    });
    elementsToBeAppendedAtTheEnd.push(mainDiv);
  } else if (modelData.images.length) {
    if (!modelData.mediaType || modelData.mediaType == 'image') {
      banner.style.backgroundImage = `url('${modelData.images[0].image}')`;
    } else if (modelData.mediaType == 'backgroundGallery') {
      banner.classList.add('banner-background-gallery');
      const mainDiv = document.createElement('div');
      mainDiv.classList.add('background-gallery-container');

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
        const backgroundGalleryItem = document.createElement('div');
        backgroundGalleryItem.classList.add('background-gallery-item');

        // TODO: remove mock for image
        for (let j = 0; j < listsImages[i].length; j++) {
          backgroundGalleryItem.appendChild(createImageElement(listsImages[i][j]));
        }

        mainDiv.appendChild(backgroundGalleryItem);
      }

      banner.appendChild(mainDiv);
    } else if (modelData.mediaType == 'video') {

    }
  }

  banner.appendChild(createTextSection(modelData));

  elementsToBeAppendedAtTheEnd.forEach(element => {
    banner.appendChild(element);
  });

  block.appendChild(banner);

  if (modelData.darkBackground) {
    block.classList.add('dark-background');
  }
}

function createTextSection(modelData) {
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

  return content;
}

function createGalleryItem(item) {
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
    container.appendChild(text);
    container.appendChild(button);
    gridItem.appendChild(container);

    gridItem.classList.add('medium-shadow');
  } else {
    // Choose overlay or bottom text
    if (item.textPosition === 'center') {
      text.classList.add('overlay-text', 'overlay-text-center');
    } else if (item.textPosition === 'bottom') {
      text.classList.add('overlay-text', 'overlay-text-bottom');
    }

    if (item.text) {
      gridItem.appendChild(text);

      gridItem.classList.add('small-shadow');
    }

    if (item.hoverText) {
      gridItem.classList.add('with-hover');

      const hoverText = document.createElement('div');
      hoverText.textContent = item.hoverText;
      hoverText.classList.add('overlay-text', 'overlay-text-center', 'hover-text');
      gridItem.appendChild(hoverText);
    }
  }

  if (item.image.value) {
    gridItem.appendChild(img);
  }

  return gridItem;
}