import {generateCard} from './data.js';
import {getRandomNumber} from './util.js';
import makeFilter from './make-filter.js';
import makeCard from './make-card.js';

const FILTERS = [
  {
    name: `All movies`,
    count: null,
    isChecked: true
  },
  {
    name: `Watchlist`,
    count: 13
  },
  {
    name: `History`,
    count: 4
  },
  {
    name: `Favorites`,
    count: 8
  }
];
const CountOfFilms = {
  COMMON: 7,
  EXTRA: 2,
  MIN: 0,
  MAX: 14
};
const filtersContainer = document.querySelector(`.main-navigation`);
const filmsContainers = document.querySelectorAll(`.films-list__container`);
const commonFilmsContainer = filmsContainers[0];
const topRatedFilmsContainer = filmsContainers[1];
const mostCommentedFilmsContainer = filmsContainers[2];

const renderFilters = (filters) => {
  filters.reverse().forEach((item) => {
    filtersContainer.insertAdjacentHTML(`afterbegin`, makeFilter(item.name, item.count, item.isChecked));
  });
};

const renderCards = (container, count, isControls = false) => {
  for (let i = 0; i < count; i++) {
    container.insertAdjacentHTML(`beforeend`,
    makeCard(generateCard(), isControls));
  }
};

const updateCards = () => {
  const filtersList = filtersContainer.querySelectorAll(`.main-navigation__item`);
  const onFiltersClick = (evt) => {
    evt.preventDefault();
    const target = evt.target;
    const count = getRandomNumber(CountOfFilms.MIN, CountOfFilms.MAX);

    commonFilmsContainer.innerHTML = ``;
    renderCards(commonFilmsContainer, count, true);

    filtersList.forEach((item) => {
      item.classList.remove(`main-navigation__item--active`);
    });
    target.classList.add(`main-navigation__item--active`);
  };

  filtersList.forEach((item) => {
    item.addEventListener(`click`, onFiltersClick);
  });
};

renderFilters(FILTERS);
renderCards(commonFilmsContainer, CountOfFilms.COMMON, true);
renderCards(topRatedFilmsContainer, CountOfFilms.EXTRA);
renderCards(mostCommentedFilmsContainer, CountOfFilms.EXTRA);
updateCards();
