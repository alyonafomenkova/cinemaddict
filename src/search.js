import {ElementBuilder} from './element-builder.js';
import {createElement} from './util.js';
import {commonFilmsContainer, renderFilms} from './main.js';
import {Group} from "./constants";

const searchContainer = document.querySelector(`.header__search`);

const searchFilms = (films, query) => films.filter((film) => film.title.toLowerCase().includes(query.toLowerCase()));

export const clearSearchContainer = () => {
  searchContainer.querySelector(`.search__field`).value = ``;
};

const onSearch = (films) => {
  return function () {
    const query = event.target.value;
    const result = searchFilms(films, query);
    commonFilmsContainer.innerHTML = ``;
    renderFilms(commonFilmsContainer, result, Group.ALL);
  };
};

const renderSearchField = () => {
  const searchElement = createElement(ElementBuilder.templateForSearch());
  searchContainer.append(searchElement);
};


export const initSearch = (films) => {
  renderSearchField();
  const searchInput = document.querySelector(`.search__field`);
  searchInput.addEventListener(`keyup`, onSearch(films));
};
