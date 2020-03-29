import {ElementBuilder} from './element-builder.js';

const FiltersId = {
  ALL: `all`,
  WATCHLIST: `watchlist`,
  HISTORY: `history`,
  FAVORITES: `favorites`
};

export const FILTERS = [
  {
    id: FiltersId.ALL,
    name: `All movies`,
    count: null,
    isChecked: true
  },
  {
    id: FiltersId.WATCHLIST,
    name: `Watchlist`,
    count: 13
  },
  {
    id: FiltersId.HISTORY,
    name: `History`,
    count: 4
  },
  {
    id: FiltersId.FAVORITES,
    name: `Favorites`,
    count: 8
  }
];

const filtersContainer = document.querySelector(`.main-navigation`);
export let filtersList;

export const renderFilters = (filters) => {
  filters.reverse().forEach((filter) => {
    let filterTemplate = ElementBuilder.templateForFilters(filter.id, filter.name, filter.count, filter.isChecked);
    filtersContainer.insertAdjacentHTML(`afterbegin`, filterTemplate);
    filtersList = filtersContainer.querySelectorAll(`.main-navigation__item`);
  });
};

export const changeClassForActiveFilter = (filter) => {
  filtersList.forEach((item) => {
    item.classList.remove(`main-navigation__item--active`);
  });
  filter.classList.add(`main-navigation__item--active`);
};

export const filterFilms = (films, filterName) => {
  switch (filterName) {
    case FiltersId.ALL:
      return films;
    case FiltersId.WATCHLIST:
      return films.filter((film) => film.isOnWatchlist);
    case FiltersId.HISTORY:
      return films.filter((film) => film.isWatched);
    case FiltersId.FAVORITES:
      return films.filter((film) => film.isFavorite);
    default:
      return [];
  }
};
