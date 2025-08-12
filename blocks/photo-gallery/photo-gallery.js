import { getBlockModel, createImageElement } from '../../scripts/blockHelper.js';

function getProps() {
  return [
    { name: 'itemsPerRow', isNumber: true },
    { name: 'loadMore', isBoolean: true },
    { name: 'spaceBetweenItems', isBoolean: true }
  ];
}

function getItemsProps() {
  return [
    { name: 'image', attribute: 'src' },
    { name: 'text' }
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

  const gridContainer = document.createElement('div');
  gridContainer.id = 'photo-gallery-container';
  gridContainer.style.gridTemplateColumns = `repeat(${modelData.itemsPerRow}, 1fr)`;
  if (modelData.spaceBetweenItems) {
    gridContainer.classList.add('space-between-items');
  }
  block.appendChild(gridContainer);

  if (modelData.loadMore) {
    // Show only the first row initially
    const initialItems = modelData.items.slice(0, modelData.itemsPerRow);
    initialItems.forEach(item => {
      gridContainer.appendChild(createGridItem(item));
    });

    // Create "Load More" button
    const loadMoreButton = document.createElement('button');
    loadMoreButton.textContent = 'Load More';
    loadMoreButton.classList.add('photo-gallery-button');
    loadMoreButton.style.display = 'block';
    loadMoreButton.onclick = () => {
      modelData.items.slice(modelData.itemsPerRow).forEach(item => {
        gridContainer.appendChild(createGridItem(item, modelData));
      });
      loadMoreButton.style.display = 'none';
      loadLessButton.style.display = 'block';
    };
    block.appendChild(loadMoreButton);

    // Create "Load Less" button
    const loadLessButton = document.createElement('button');
    loadLessButton.textContent = 'Load Less';
    loadLessButton.classList.add('photo-gallery-button');
    loadLessButton.style.display = 'none';
    loadLessButton.onclick = (event) => {

      // Remove all items except the first row
      const children = event.target.parentElement.querySelector('div#photo-gallery-container')?.children;
      const allItems = children ? Array.from(children) : [];
      allItems.forEach((item, index) => {
        if (index >= modelData.itemsPerRow) {
          gridContainer.removeChild(item);
        }
      });
      loadLessButton.style.display = 'none';
      loadMoreButton.style.display = 'block';
    };
    block.appendChild(loadLessButton);
  } else {
    // Display all items immediately
    modelData.items.forEach(item => {
      gridContainer.appendChild(createGridItem(item, modelData));
    });
  }
}

function createGridItem(item) {
  const gridItem = document.createElement('div');
  gridItem.className = 'photo-gallery-item';

  if (item.image.value) {
    const imageModel = {
      image: item.image.value,
      imageAlt: item.alt
    }
    const img = createImageElement(imageModel);
    gridItem.appendChild(img);
  }
  if (item.text) {
    const text = document.createElement('div');
    text.textContent = item.text;
    text.classList.add('bottom-text');
    gridItem.appendChild(text);
  }

  return gridItem;
}