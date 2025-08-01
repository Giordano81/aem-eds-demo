import { getBlockModel, getButtonModel, createButtonElement, createTextElement, extractImageElements, getImageModel } from '../../scripts/blockHelper.js';
import { createImageCarousel } from '../../scripts/imageCarouselHelper.js';

function getProps() {
  return [
    { name: 'title', tags: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'] },
    { name: 'subtitle', tags: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'] },
  ];
}

export default function decorate(block) {
  // return;
  const { block: updatedBlock, images } = extractImageElements(block);

  let modelData = getBlockModel(block, getProps());
  modelData.button = getButtonModel(block.children[getProps().length]);

  modelData.images = [];
  images.forEach(image => {
    modelData.images.push(getImageModel(image));
  });

  block.innerHTML = '';

  block.appendChild(createTextElement(modelData.title, ['teaser-title']));
  block.appendChild(createTextElement(modelData.subtitle, ['teaser-subtitle']));

  if (modelData.button.link && modelData.button.text) {
    block.appendChild(createButtonElement(modelData.button));
  }

  const carousel = createImageCarousel(modelData.images);
  block.appendChild(carousel);

  debugger;
};