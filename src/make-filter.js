export default (name, count, isChecked = false) => {
  return `
  <a
    href="#${name}"
    class="main-navigation__item ${isChecked ? ` main-navigation__item--active` : ``}">
      ${name}
      ${count ? `<span class="main-navigation__item-count">${count}</span>` : ``}
  </a>
  `;
};
