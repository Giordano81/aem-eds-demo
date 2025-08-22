import { getBlockModel } from '../../js/blockHelper.js';

function getProps() {
  return [
    { name: 'size' }
  ];
}

export default function decorate(block) {
  let modelData = getBlockModel(block, getProps());
  block.innerHTML = '';

  const container = document.createElement('div');
  container.classList.add(modelData.size);

  block.appendChild(container);
}