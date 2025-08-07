import { getBlockModel, createTextElement, createImageElement, createButtonElement, extractImageElements, getButtonModel } from '../../scripts/blockHelper.js';

function getProps() {
  return [

  ];
}

function getItemsProps() {
  return [
    { name: 'title' },
    { name: 'ctaText' },
    { name: 'ctaLink', attribute: 'href' }
  ];
}

export default function decorate(block) {
  let modelData = getBlockModel(block, getProps());

  modelData.items = [];
  for (let i = getProps().length; i < block.children.length; i++) {
    const item = block.children[i];
    modelData.items.push(getBlockModel(item, getItemsProps()));
  }

  block.innerHTML = '';

  const mainContainer = document.createElement('div');
  mainContainer.className = 'sezioni-link';

  (modelData.items || []).forEach(item => {
    const itemContainer = document.createElement('div');
    itemContainer.className = 'sezione-item';

    const title = document.createElement('p');
    title.textContent = item.title;

    const link = document.createElement('a');
    link.setAttribute('href', item.ctaLink.value);
    link.innerHTML = item.ctaText;

    itemContainer.appendChild(title);
    itemContainer.appendChild(link);

    mainContainer.appendChild(itemContainer);
  });


  block.appendChild(mainContainer);
}