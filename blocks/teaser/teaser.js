import { getBlockModel, getButtonModel, createButtonElement, createTextElement, extractImageElements } from '../../scripts/blockHelper.js';
import { createImageCarousel } from '../../scripts/imageCarouselHelper.js';
import { loadFragment } from '../fragment/fragment.js';

function getProps() {
  return [
    { name: 'fragment', attribute: 'href' },
  ];
}

function getItemsProps() {
  return [
    { name: 'title', tags: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'] },
    { name: 'titleStyle' },
    { name: 'subtitle', tags: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'] },
    { name: 'subtitleStyle' },
    { name: 'eyebrow' },
    { name: 'verticalText' }
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

  const firstElement = modelData.fragment.items[0];

  // Create the main container
  const container = document.createElement('div');
  container.className = 'teaser-content-container';

  // Create the left section
  const leftSection = document.createElement('div');
  leftSection.className = 'left-section';

  // Append elements to the left section
  if (firstElement.eyebrow) {
    const eyebrowModel = {
      value: firstElement.eyebrow
    };
    leftSection.appendChild(createTextElement(eyebrowModel, ['teaser-eyebrow']));
  }
  if (firstElement.title.value) {
    leftSection.appendChild(createTextElement(firstElement.title, ['teaser-title']));
  }
  if (firstElement.subtitle.value) {
    leftSection.appendChild(createTextElement(firstElement.subtitle, ['teaser-subtitle']));
  }
  if (firstElement.button?.link && firstElement.button?.text) {
    leftSection.appendChild(createButtonElement(firstElement.button));
  }
  if (firstElement.verticalText) {
    leftSection.setAttribute('data-vertical-text', firstElement.verticalText);
  }

  // Create the right section
  const rightSection = document.createElement('div');
  rightSection.className = 'right-section';

  // Append image to the right section
  rightSection.appendChild(createImageCarousel(firstElement.images));

  // Append both sections to the main container
  container.appendChild(leftSection);
  container.appendChild(rightSection);

  // Append the main container to the body or a specific element
  block.appendChild(container);
};

/*
window.addEventListener('scroll', () => {
  const testElement = document.getElementsByClassName('teaser-content-container')[0];
  const rect = testElement.getBoundingClientRect();
    let isInView = false;
    if (rect.top <= window.innerHeight && rect.bottom >= 0) {
    isInView = true;
  }
    console.log(`Top: ${rect.top} - Bottom: ${rect.bottom} - Is in view: ${isInView}`);
});

*/