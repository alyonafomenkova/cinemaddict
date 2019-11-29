import {generatedFilms, CountOfFilms} from './data.js';
import {getRandomNumber, getShuffledSubarray, getSubarray, createElement} from './util.js';
import makeFilter from './make-filter.js';
import {Film} from './film.js';
import {FilmDetails} from './film-details.js';
import {FilmStorage} from './film-storage.js';
import {ElementBuilder} from './element-builder.js';

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
const filtersContainer = document.querySelector(`.main-navigation`);
const filmsContainers = document.querySelectorAll(`.films-list__container`);
const commonFilmsContainer = filmsContainers[0];
const topRatedFilmsContainer = filmsContainers[1];
const mostCommentedFilmsContainer = filmsContainers[2];

const Group = {
  ALL: 0,
  TOP_RATED: 1,
  MOST_COMMENTED: 2
};

const renderFilters = (filters) => {
  filters.reverse().forEach((item) => {
    filtersContainer.insertAdjacentHTML(`afterbegin`, makeFilter(item.name, item.count, item.isChecked));
  });
};

const updateFilms = () => {
  const filtersList = filtersContainer.querySelectorAll(`.main-navigation__item`);
  const onFiltersClick = (evt) => {
    evt.preventDefault();
    const target = evt.target;
    const count = getRandomNumber(CountOfFilms.MIN, CountOfFilms.MAX);
    const newArray = getSubarray(generatedFilms, count);

    commonFilmsContainer.innerHTML = ``;
    renderFilms(commonFilmsContainer, newArray);

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
// updateFilms();

const films = new FilmStorage();
console.log(typeof films);
console.log(`films: `, films);

const renderFilms = (container, films, group) => {
  const body = document.querySelector(`body`);

  films.forEach(film => {
    const overlay = ElementBuilder.createOverlay();

    const onDetailedFilmClick = () => {
      body.removeChild(detailedFilmComponent);
      body.removeChild(overlay);
    };

    const onSmallFilmClick = () => {
      body.appendChild(overlay);
      body.appendChild(detailedFilmComponent);
    }

    let filmComponent;

    switch (group) {
      case Group.ALL:
        filmComponent = ElementBuilder.buildSmallFilmElement(film, onSmallFilmClick)
        break;
      case Group.TOP_RATED:
        filmComponent = ElementBuilder.buildExtraSmallFilmElement(film, onSmallFilmClick);
        break;
      case Group.MOST_COMMENTED:
        filmComponent = ElementBuilder.buildExtraSmallFilmElement(film, onSmallFilmClick);
        break;
      default:
        throw new Error(`Unknown group type: ${group}`);
    }

    const detailedFilmComponent = ElementBuilder.buildDetailedFilmElement(film, onDetailedFilmClick);
    container.appendChild(filmComponent);
  });
}

const onError = () => {
  console.log(`ERROR LOADING`);
}

const onSuccess = (films) => {
  const topRatedFilms = getShuffledSubarray(films, CountOfFilms.EXTRA);
  const mostCommentedFilms = getShuffledSubarray(films, CountOfFilms.EXTRA);

  renderFilms(commonFilmsContainer, films, Group.ALL);
  renderFilms(topRatedFilmsContainer, topRatedFilms, Group.TOP_RATED);
  renderFilms(mostCommentedFilmsContainer, mostCommentedFilms, Group.MOST_COMMENTED);
}

films.load(onError, onSuccess);
