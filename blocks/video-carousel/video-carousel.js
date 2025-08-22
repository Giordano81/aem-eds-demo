import { getBlockModel } from '../../js/blockHelper.js';
import { createVideoCarousel } from '../../js/videoCarouselHelper.js';

function getProps() {
  return [

  ];
}

function getItemsProps() {
  return [
    { name: 'title', tags: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'] },
    { name: 'titleStyle' },
    { name: 'subtitle', tags: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'] },
    { name: 'subtitleStyle' },
    { name: 'video', attribute: 'src' }
  ];
}

export default async function decorate(block) {
  let modelData = getBlockModel(block, getProps());

  modelData.items = [];
  for (let i = getProps().length; i < block.children.length; i++) {
    const item = block.children[i];
    modelData.items.push(getBlockModel(item, getItemsProps()));
  }

  block.innerHTML = '';

  const container = document.createElement('div');
  container.classList.add('main-container');

  container.appendChild(createVideoCarousel(modelData.items));

  block.appendChild(container);
}