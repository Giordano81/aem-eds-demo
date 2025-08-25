import { getBlockModel, createTextElement, setDataSet } from '../../js/blockHelper.js';

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
  mainContainer.classList.add('links-container');

  (modelData.items || []).forEach(item => {
    const itemContainer = document.createElement('div');
    setDataSet(itemContainer, item);
    itemContainer.classList.add('link-item');

    if (item.title) {
      itemContainer.appendChild(createTextElement({value: item.title}, ['heading-h3-medium', 'link-title']));
    }

    if (item.ctaText && item.ctaLink.value) {
      const link = document.createElement('a');
      link.setAttribute('href', item.ctaLink.value);
      link.innerHTML = item.ctaText;
      itemContainer.appendChild(link);
    }

    mainContainer.appendChild(itemContainer);
  });


  block.appendChild(mainContainer);
}