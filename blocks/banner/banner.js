import { getBlockModel, getButtonModel, createButtonElement, createTextElement } from '../../scripts/blockHelper.js';

function getProps() {
  return [
    { name: 'title', tags: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'] },
    { name: 'subtitle', tags: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'] },
    { name: 'subtitleQuotes', isBoolean: true },
    { name: 'horizontalAlign' },
    { name: 'verticalAlign' },
    { name: 'image', attribute: 'src' },
    { name: 'imageOpacity', isBoolean: true },
    { name: 'backgroundColor' },
    { name: 'componentSize' }
  ];
}

export default function decorate(block) {
  let modelData = getBlockModel(block, getProps());
  modelData.button = getButtonModel(block.children[getProps().length]);

  // Create main container
  const banner = document.createElement('div');
  banner.className = 'banner-block';
  if (modelData.image?.value) {
    banner.style.backgroundImage = `url('${modelData.image.value}')`;
  } else if (modelData.backgroundColor) {
    banner.style.backgroundColor = `#${modelData.backgroundColor.replace('#', '')}`;
  }
  if (modelData.imageOpacity) {
    banner.style.setProperty('--banner-overlay-opacity', '0.4');
  }
  if (modelData.componentSize) {
    banner.classList.add(modelData.componentSize);
  }

  // Create content container
  const content = document.createElement('div');
  content.className = 'banner-content';
  if (modelData.horizontalAlign) {
    content.classList.add(modelData.horizontalAlign);
  }
  if (modelData.verticalAlign) {
    content.classList.add(modelData.verticalAlign);
  }

  content.appendChild(createTextElement(modelData.title, ['banner-title']));

  const subtitleClasses = ['banner-subtitle'];
  if (modelData.subtitleQuotes) {
    subtitleClasses.push('banner-subtitle-with-quotes');
  }
  content.appendChild(createTextElement(modelData.subtitle, subtitleClasses));

  if (modelData.button.link && modelData.button.text) {
    content.appendChild(createButtonElement(modelData.button));
  }

  banner.appendChild(content);

  block.innerHTML = '';
  block.appendChild(banner);
}