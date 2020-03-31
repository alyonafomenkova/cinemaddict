import {ElementBuilder} from './element-builder.js';
import {Provider} from "./provider";

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
    isChecked: true
  },
  {
    id: FiltersId.WATCHLIST,
    name: `Watchlist`
  },
  {
    id: FiltersId.HISTORY,
    name: `History`
  },
  {
    id: FiltersId.FAVORITES,
    name: `Favorites`
  }
];

const filtersContainer = document.querySelector(`.main-navigation`);
export let filtersList;

export const setCountFilmForFilter = (films) => {
  const watchlistCountField = document.querySelector(`.watchlist-count`);
  const watchedCountField = document.querySelector(`.history-count`);
  const favoriteCountField = document.querySelector(`.favorites-count`);

  watchlistCountField.innerHTML = filterFilms(films, FiltersId.WATCHLIST).length;
  watchedCountField.innerHTML = filterFilms(films, FiltersId.HISTORY).length;
  favoriteCountField.innerHTML = filterFilms(films, FiltersId.FAVORITES).length;
};

export const renderFilters = (filters) => {
  filters.reverse().forEach((filter) => {
    let filterTemplate = ElementBuilder.templateForFilters(filter.id, filter.name, filter.isChecked);
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

export const observeCountFilms = () => {
  const films = Provider.get().getRenderedFilms();
  setCountFilmForFilter(films);
};
