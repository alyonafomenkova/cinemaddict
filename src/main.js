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
const FILM = {
  title: `Moonrise`,
  rating: `6.1`,
  year: `1948`,
  duration: `1h 30m`,
  genre: `Nuar`,
  description: `Danny Hawkins, has a tragic past. He makes an unintentional murder,
                saving the girl from the hands of scoundrels. Facing a painful choice,
                he tries to flee not only from the police, but from himself.`,
  comments: 7
};
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

const renderCards = (container, count, film, isControls = false) => {
  for (let i = 0; i < count; i++) {
    container.insertAdjacentHTML(`beforeend`,
    makeCard(film.title, film.rating, film.year, film.duration, film.genre, film.description, film.comments, isControls));
  }
};

const updateCards = () => {
  const filtersList = filtersContainer.querySelectorAll(`.main-navigation__item`);
  const onFiltersClick = (evt) => {
    evt.preventDefault();
    const target = evt.target;
    const count = getRandomNumber(CountOfFilms.MIN, CountOfFilms.MAX);

    commonFilmsContainer.innerHTML = ``;
    renderCards(commonFilmsContainer, count, FILM, true);

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
renderCards(commonFilmsContainer, CountOfFilms.COMMON, FILM, true);
renderCards(topRatedFilmsContainer, CountOfFilms.EXTRA, FILM);
renderCards(mostCommentedFilmsContainer, CountOfFilms.EXTRA, FILM);
updateCards();
