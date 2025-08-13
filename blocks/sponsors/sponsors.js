import { getBlockModel, createTextElement, createImageElement, createButtonElement, extractImageElements, getButtonModel } from '../../scripts/blockHelper.js';
import { createModal } from '../modal/modal.js';
import { loadFragment } from '../fragment/fragment.js';
import { createImageCarousel } from '../../scripts/imageCarouselHelper.js';

function getProps() {
  return [
    { name: 'title', tags: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'] },
    { name: 'fragment', attribute: 'href' }
  ];
}

function getItemsProps() {
  return [
    { name: 'logo', attribute: 'src' },
    { name: 'logoAltText' },
    { name: 'title', tags: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'] },
    { name: 'titleStyle' },
    { name: 'subtitle', tags: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'] },
    { name: 'subtitleStyle' }
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
        const sponsorItem = modelData.fragment.html.children[i].querySelector('& > div');

        // Remove all child blocks so is possible to extract images for carousel without touching image for logo
        const otherBlocks = document.createElement('div');
        while (sponsorItem.children.length > getItemsProps().length) {
          otherBlocks.appendChild(sponsorItem.children[getItemsProps().length]);
        }
        const item = getBlockModel(sponsorItem, getItemsProps());
        const { otherBlocks: updatedBlock, images } = extractImageElements(otherBlocks);
        item.images = images;
        
        if (otherBlocks.children.length) {
          item.button = getButtonModel(otherBlocks.children[0]);
        }

        modelData.fragment.items.push(item);
      }
    }
  }

  block.innerHTML = '';

  const sponsorContainer = document.createElement('div');
  sponsorContainer.className = 'sponsor-container';

  if (modelData.title.value) {
    modelData.title.tag = 'h2';
    modelData.title.style = 'h2';
    sponsorContainer.appendChild(createTextElement(modelData.title, ['sponsor-title']));
  }

  const sponsorLogos = document.createElement('div');
  sponsorLogos.className = 'sponsor-logos';

  let counter = 0;
  (modelData.fragment?.items || []).forEach(item => {
    counter++;
    const model = {
      image: item.logo.value,
      imageAlt: item.logoAltText,
    }
    const image = createImageElement(model);
    image.querySelector('img').onclick = async () => {
      const dialogClasses = [];

      const modalBody = document.createElement('div');

      // Create the left section
      const textSection = document.createElement('div');
      textSection.classList.add('text-section');
      textSection.appendChild(createImageElement(model));
      if (item.title.value) {
        textSection.appendChild(createTextElement(item.title, ['teaser-title'], true));
      }
      if (item.subtitle.value) {
        textSection.appendChild(createTextElement(item.subtitle, ['teaser-subtitle'], true));
      }
      if (item.button?.link && item.button?.text) {
        textSection.appendChild(createButtonElement(item.button));
      }
      modalBody.appendChild(textSection);

      if (item.images.length) {
        textSection.classList.add('with-images');
        modalBody.appendChild(createImageCarousel(item.images));
      } else {
        dialogClasses.push('without-images');
      }

      const modal = await createModal(modalBody.childNodes, dialogClasses);
      modal.showModal();
    };
    image.classList.add('sponsor-logo');
    if (counter % 4 == 1) {
      image.classList.add('start');
    }
    if (counter % 4 == 0) {
      image.classList.add('end');
    }
    sponsorLogos.appendChild(image);
  });

  sponsorContainer.appendChild(sponsorLogos);
  block.appendChild(sponsorContainer);
}