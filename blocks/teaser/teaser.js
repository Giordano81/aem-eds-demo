import { getBlockModel, getButtonModel, createButtonElement, createTextElement } from '../../scripts/blockHelper.js';

function getProps() {
  return [
    { name: 'title', tags: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'] },
    { name: 'subtitle', tags: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'] },
  ];
}

export default function decorate(block) {
  return;
  let modelData = getBlockModel(block, getProps());
  modelData.button = getButtonModel(block.children[getProps().length]);

  block.innerHTML = '';

  block.appendChild(createTextElement(modelData.title, ['teaser-title']));
  block.appendChild(createTextElement(modelData.subtitle, ['teaser-subtitle']));

  if (modelData.button.link && modelData.button.text) {
    block.appendChild(createButtonElement(modelData.button));
  }
  debugger;
};