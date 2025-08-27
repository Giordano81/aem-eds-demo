import { getBlockModel, createTextElement, createImageElement, extractImageElements } from '../../js/blockHelper.js';
import { loadFragment } from '../fragment/fragment.js';

function getProps() {
  return [
    { name: 'title', tags: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'] },
    { name: 'titleStyle', },
    { name: 'subtitle', tags: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'] },
    { name: 'subtitleStyle', },
    { name: 'subtitleSlowAnimation', isBoolean: true },
    { name: 'fragment', attribute: 'href' },
    { name: 'darkBackground' }
  ];
}

function getItemsProps() {
  return [
    { name: 'tag' },
    { name: 'title' },
    { name: 'date' },
    { name: 'ctaText' },
    { name: 'ctaLink', attribute: 'href' },
  ];
}

export default async function decorate(block) {
  let modelData = getBlockModel(block, getProps());

  if (modelData.fragment.value) {
    const fragment = await loadFragment(modelData.fragment.value);
    modelData.fragment.html = fragment.querySelector('& > div');
    if (modelData.fragment.html) {
      modelData.fragment.items = []
      for (let i = 0; i < modelData.fragment.html.children.length; i++) {
        const child = modelData.fragment.html.children[i].querySelector('& > div');
        const { child: updatedBlock, images } = extractImageElements(child);
        const item = getBlockModel(child, getItemsProps());
        item.images = images;
        modelData.fragment.items.push(item);
      }
    }
  }

  block.innerHTML = '';

  const container = document.createElement('div');
  container.classList.add('main-container');

  // Text section
  const textSection = document.createElement('div');
  textSection.classList.add('articles-text-section');

  if (modelData.title.value) {
    textSection.appendChild(createTextElement(modelData.title, ['articles-title']));
  }
  if (modelData.subtitle.value) {
    textSection.appendChild(createTextElement(modelData.subtitle, ['articles-subtitle']));
  }

  // Articles
  const articlesSection = document.createElement('div');
  articlesSection.classList.add('articles-section');

  (modelData.fragment?.items || []).forEach(item => {
    const articleItem = document.createElement('div');
    articleItem.classList.add('article-item');

    if (item.images.length) {
      articleItem.appendChild(createImageElement(item.images[0]));
    }
    if (item.tag) {
      const tag = document.createElement('div');
      tag.classList.add('article-tag-container');
      tag.appendChild(createTextElement(item.tag, ['article-tag'], true));
      articleItem.appendChild(tag);
    }
    if (item.date) {
      articleItem.appendChild(createTextElement(item.date, ['article-date'], true));
    }
    if (item.title) {
      articleItem.appendChild(createTextElement(item.title, ['article-title'], true));
    }
    if (item.ctaLink && item.ctaText) {
      const link = document.createElement('a');
      link.classList.add('article-link');
      link.textContent = item.ctaText;
      link.href = item.ctaLink.value;
      articleItem.appendChild(link);
    }

    articlesSection.appendChild(articleItem);
  });

  const loadMoreButton = document.createElement('button');
  loadMoreButton.textContent = 'Load More';
  loadMoreButton.classList.add('button', 'cta-light', 'cta-secondary', 'articles-button');
  loadMoreButton.onclick = () => {
    block.parentElement.classList.add('show-all-articles');
  };
  articlesSection.appendChild(loadMoreButton);

  container.appendChild(textSection);
  container.appendChild(articlesSection);
  block.appendChild(container);

  if (modelData.darkBackground) {
    block.classList.add('dark-background');
  }
}