const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');
const searchToggle = document.querySelector('.search-toggle');
const searchBar = document.querySelector('.search-bar');
const subscribeForm = document.querySelector('.subscribe-form');
const formMessage = document.querySelector('.form-message');

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
