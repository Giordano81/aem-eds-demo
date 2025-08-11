import { getBlockModel, getButtonModel, createButtonElement, createTextElement, extractImageElements } from '../../scripts/blockHelper.js';
import { createImageCarousel } from '../../scripts/imageCarouselHelper.js';

function getProps() {
  return [
    { name: 'title', tags: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'] },
    { name: 'titleStyle' },
    { name: 'subtitle', tags: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'] },
    { name: 'subtitleStyle' },
    { name: 'eyebrow' },
    { name: 'verticalText' }
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

  block.innerHTML = '';

  // Create the main container
  const container = document.createElement('div');
  container.className = 'content-container';

  // Create the left section
  const leftSection = document.createElement('div');
  leftSection.className = 'left-section';

  // Append elements to the left section
  if (modelData.eyebrow) {
    const eyebrowModel = {
      value: modelData.eyebrow
    };
    leftSection.appendChild(createTextElement(eyebrowModel, ['teaser-eyebrow']));
  }
  if (modelData.title.value) {
    leftSection.appendChild(createTextElement(modelData.title, ['teaser-title']));
  }
  if (modelData.subtitle.value) {
    leftSection.appendChild(createTextElement(modelData.subtitle, ['teaser-subtitle']));
  }
  if (modelData.button?.link && modelData.button?.text) {
    leftSection.appendChild(createButtonElement(modelData.button));
  }
  if (modelData.verticalText) {
    const smallText = document.createElement('span');
    smallText.className = 'vertical-text';
    smallText.textContent = modelData.verticalText;
    leftSection.appendChild(smallText);
  }

  // Create the right section
  const rightSection = document.createElement('div');
  rightSection.className = 'right-section';

  // Append image to the right section
  rightSection.appendChild(createImageCarousel(modelData.images));

  // Append both sections to the main container
  container.appendChild(leftSection);
  container.appendChild(rightSection);

  // Append the main container to the body or a specific element
  block.appendChild(container);
};