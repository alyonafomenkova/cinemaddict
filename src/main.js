//import {getRandomNumber} from './util.js';
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
  EXTRA: 2
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

renderFilters(FILTERS);
renderCards(commonFilmsContainer, CountOfFilms.COMMON, FILM, true);
renderCards(topRatedFilmsContainer, CountOfFilms.EXTRA, FILM);
renderCards(mostCommentedFilmsContainer, CountOfFilms.EXTRA, FILM);

//getRandomNumber();
