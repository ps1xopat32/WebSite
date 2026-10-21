const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');
const searchToggle = document.querySelector('.search-toggle');
const searchBar = document.querySelector('.search-bar');
const subscribeForm = document.querySelector('.subscribe-form');
const formMessage = document.querySelector('.form-message');
const filterChips = document.querySelectorAll('.filter-chip');
const articleCards = document.querySelectorAll('.article-card');
const accessibilityToggle = document.querySelector('.accessibility-toggle');
const accessibilityPanel = document.createElement('section');
const accessibilityStorageKey = 'checkpoint-accessibility-settings';
const accessibilitySettings = {
  enabled: false,
  fontScale: 1,
  contrast: false,
  monochrome: false,
  hideImages: false
};

accessibilityPanel.className = 'accessibility-panel';
accessibilityPanel.id = 'accessibility-panel';
accessibilityPanel.setAttribute('aria-labelledby', 'accessibility-title');
accessibilityPanel.hidden = true;
accessibilityPanel.innerHTML = `
  <div class="accessibility-panel-heading">
    <h2 id="accessibility-title">Для слабовидящих</h2>
    <button class="accessibility-close" type="button" aria-label="Закрыть настройки">×</button>
  </div>
  <div class="accessibility-size-controls" aria-label="Размер текста">
    <button type="button" data-accessibility-action="decrease-font">A−</button>
    <span class="accessibility-font-size" aria-live="polite"></span>
    <button type="button" data-accessibility-action="increase-font">A+</button>
  </div>
  <button class="accessibility-option" type="button" data-accessibility-action="contrast" aria-pressed="false">Высокий контраст</button>
  <button class="accessibility-option" type="button" data-accessibility-action="monochrome" aria-pressed="false">Чёрно-белый режим</button>
  <button class="accessibility-option" type="button" data-accessibility-action="hide-images" aria-pressed="false">Скрыть изображения</button>
  <button class="accessibility-reset" type="button" data-accessibility-action="reset">Сбросить настройки</button>
  <button class="accessibility-disable" type="button" data-accessibility-action="disable">Выключить режим</button>
`;
document.body.appendChild(accessibilityPanel);

const accessibilityFontSize = accessibilityPanel.querySelector('.accessibility-font-size');

const saveAccessibilitySettings = () => {
  try {
    localStorage.setItem(accessibilityStorageKey, JSON.stringify(accessibilitySettings));
  } catch (error) {
    console.error('Не удалось сохранить настройки для слабовидящих.', error);
  }
};

const updateAccessibilityControls = () => {
  document.body.classList.toggle('accessibility-mode', accessibilitySettings.enabled);
  document.body.classList.toggle('accessibility-high-contrast', accessibilitySettings.contrast);
  document.body.classList.toggle('accessibility-monochrome', accessibilitySettings.monochrome);
  document.body.classList.toggle('accessibility-hide-images', accessibilitySettings.hideImages);
  document.documentElement.style.setProperty('--accessibility-font-scale', accessibilitySettings.fontScale);
  accessibilityFontSize.textContent = `${Math.round(accessibilitySettings.fontScale * 100)}%`;

  accessibilityPanel.querySelector('[data-accessibility-action="contrast"]').setAttribute('aria-pressed', String(accessibilitySettings.contrast));
  accessibilityPanel.querySelector('[data-accessibility-action="monochrome"]').setAttribute('aria-pressed', String(accessibilitySettings.monochrome));
  accessibilityPanel.querySelector('[data-accessibility-action="hide-images"]').setAttribute('aria-pressed', String(accessibilitySettings.hideImages));
};

try {
  const savedSettings = JSON.parse(localStorage.getItem(accessibilityStorageKey) || '{}');
  if (typeof savedSettings.enabled === 'boolean') accessibilitySettings.enabled = savedSettings.enabled;
  if ([1, 1.1, 1.2, 1.3].includes(savedSettings.fontScale)) accessibilitySettings.fontScale = savedSettings.fontScale;
  if (typeof savedSettings.contrast === 'boolean') accessibilitySettings.contrast = savedSettings.contrast;
  if (typeof savedSettings.monochrome === 'boolean') accessibilitySettings.monochrome = savedSettings.monochrome;
  if (typeof savedSettings.hideImages === 'boolean') accessibilitySettings.hideImages = savedSettings.hideImages;
} catch (error) {
  console.error('Не удалось загрузить настройки для слабовидящих.', error);
}

updateAccessibilityControls();

accessibilityToggle?.addEventListener('click', () => {
  accessibilityPanel.hidden = false;
  accessibilityToggle.setAttribute('aria-expanded', 'true');

  if (!accessibilitySettings.enabled) {
    accessibilitySettings.enabled = true;
    updateAccessibilityControls();
    saveAccessibilitySettings();
  }

  accessibilityPanel.querySelector('[data-accessibility-action="increase-font"]').focus();
});

accessibilityPanel.querySelector('.accessibility-close').addEventListener('click', () => {
  accessibilityPanel.hidden = true;
  accessibilityToggle.setAttribute('aria-expanded', 'false');
  accessibilityToggle.focus();
});

accessibilityPanel.addEventListener('click', (event) => {
  const action = event.target.closest('[data-accessibility-action]')?.dataset.accessibilityAction;
  if (!action) return;

  if (action === 'increase-font') {
    accessibilitySettings.fontScale = Math.min(1.3, accessibilitySettings.fontScale + 0.1);
  } else if (action === 'decrease-font') {
    accessibilitySettings.fontScale = Math.max(1, accessibilitySettings.fontScale - 0.1);
  } else if (action === 'contrast') {
    accessibilitySettings.contrast = !accessibilitySettings.contrast;
  } else if (action === 'monochrome') {
    accessibilitySettings.monochrome = !accessibilitySettings.monochrome;
  } else if (action === 'hide-images') {
    accessibilitySettings.hideImages = !accessibilitySettings.hideImages;
  } else if (action === 'reset') {
    accessibilitySettings.fontScale = 1;
    accessibilitySettings.contrast = false;
    accessibilitySettings.monochrome = false;
    accessibilitySettings.hideImages = false;
  } else if (action === 'disable') {
    Object.assign(accessibilitySettings, {
      enabled: false,
      fontScale: 1,
      contrast: false,
      monochrome: false,
      hideImages: false
    });
    accessibilityPanel.hidden = true;
    accessibilityToggle.setAttribute('aria-expanded', 'false');
    accessibilityToggle.focus();
  }

  updateAccessibilityControls();
  saveAccessibilitySettings();
});

accessibilityPanel.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') accessibilityPanel.querySelector('.accessibility-close').click();
});

menuToggle?.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('is-open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

searchToggle?.addEventListener('click', () => {
  const isVisible = searchBar.classList.toggle('is-visible');
  searchToggle.setAttribute('aria-expanded', String(isVisible));
  if (isVisible) document.querySelector('#site-search')?.focus();
});

subscribeForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  formMessage.textContent = 'Спасибо! Письмо уже в пути.';
  subscribeForm.reset();
});

document.querySelector('.search-bar')?.addEventListener('submit', (event) => {
  event.preventDefault();
  const input = document.querySelector('#site-search');
  if (input.value.trim()) {
    input.value = `Ищем: ${input.value.trim()}`;
    input.select();
  }
});

filterChips.forEach((chip) => {
  chip.addEventListener('click', () => {
    const selectedFilter = chip.dataset.filter;

    filterChips.forEach((item) => item.classList.toggle('is-active', item === chip));

    articleCards.forEach((card) => {
      const matches = selectedFilter === 'all' || card.dataset.category === selectedFilter;
      card.classList.toggle('is-hidden', !matches);
    });
  });
});

const printButton = document.querySelector('.print-button');
printButton?.addEventListener('click', () => {
  window.print();
});

window.addEventListener('beforeprint', () => {
  document.body.classList.add('is-printing');
});

window.addEventListener('afterprint', () => {
  document.body.classList.remove('is-printing');
});
