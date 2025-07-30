import { getBlockModel } from '../../scripts/blockHelper.js';

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
    { name: 'ctaText' },
    { name: 'ctaLink', attribute: 'href' },
    { name: 'ctaStyle' },
    { name: 'componentSize' },
    { name: 'overflowElements', isBoolean: true }
  ];
}

export default function decorate(block) {
  // let modelData = getPropValue(block);
  let modelData = getBlockModel(block, getProps());

  // Create main container
  const banner = document.createElement('div');
  banner.className = 'banner-block';
  if (modelData.image) {
    banner.style.backgroundImage = `url('${modelData.image}')`;
  } else if (modelData.backgroundColor) {
    banner.style.backgroundColor = `#${modelData.backgroundColor}`;
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

  // Create title
  const h1 = document.createElement('h1');
  h1.className = 'banner-title';
  h1.innerHTML = modelData.title;

  // Create subtitle
  const p = document.createElement('p');
  p.className = 'banner-subtitle';
  if (modelData.subtitleQuotes) {
    p.classList.add('banner-subtitle-with-quotes');
  }
  p.innerHTML = modelData.subtitle;

  // Assemble
  content.appendChild(h1);
  content.appendChild(p);

  // Create button
  if (modelData.ctaText && modelData.ctaLink) {
    const button = document.createElement('a');
    button.className = modelData.ctaStyle || 'cta-primary';
    button.textContent = modelData.ctaText;
    button.href = modelData.ctaLink;
    // button.style.setProperty('--link-color', '#fff');

    content.appendChild(button);
  }

  banner.appendChild(content);

  block.innerHTML = '';
  block.append(banner);
}