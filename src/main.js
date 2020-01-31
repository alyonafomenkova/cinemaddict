import {CountOfFilms, generateFilms} from './data.js';
import {getRandomNumber, getShuffledSubarray, getSubarray} from './util.js';
import makeFilter from './make-filter.js';
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
const FILMS_PER_LOAD = 5;
const filtersContainer = document.querySelector(`.main-navigation`);
const filmsContainers = document.querySelectorAll(`.films-list__container`);
const showMoreBtn = document.querySelector(`.films-list__show-more`);
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

// const initFilmCardFilters = () => {
//   const filtersList = filtersContainer.querySelectorAll(`.main-navigation__item`);
//   const onFiltersClick = (evt) => {
//     evt.preventDefault();
//     const target = evt.target;
//     const count = getRandomNumber(CountOfFilms.MIN, CountOfFilms.MAX);
//     const newArray = getSubarray(films._films, count);
//
//     commonFilmsContainer.innerHTML = ``;
//     renderFilms(commonFilmsContainer, newArray, Group.ALL);
//
//     filtersList.forEach((item) => {
//       item.classList.remove(`main-navigation__item--active`);
//     });
//     target.classList.add(`main-navigation__item--active`);
//   };
//
//   filtersList.forEach((item) => {
//     item.addEventListener(`click`, onFiltersClick);
//   });
// };

const renderFilms = (container, filmsArray, group) => {
  const body = document.querySelector(`body`);

  filmsArray.forEach((film) => {
    const overlay = ElementBuilder.createOverlay();

    const onDetailedFilmClick = () => {
      body.removeChild(detailedFilmComponent);
      body.removeChild(overlay);
    };

    const onSmallFilmClick = () => {
      const ratingArea = detailedFilmComponent.querySelector(`.film-details__user-rating-score`);
      const emoji = detailedFilmComponent.querySelector(`.film-details__emoji-list`);
      const commentsArea = detailedFilmComponent.querySelector(`.film-details__new-comment`);
      body.appendChild(overlay);
      body.appendChild(detailedFilmComponent);
      ratingArea.addEventListener(`click`, FilmStorage.get().changeRating(detailedFilmComponent));
      emoji.addEventListener(`click`, FilmStorage.get().changeEmoji(detailedFilmComponent));
      //commentsArea.addEventListener(`keydown`, FilmStorage.get().addComments(detailedFilmComponent));
      commentsArea.addEventListener(`keydown`, FilmStorage.get().addComments(film, detailedFilmComponent));
    };

    let filmComponent;

    switch (group) {
      case Group.ALL:
        filmComponent = ElementBuilder.buildSmallFilmElement(film, onSmallFilmClick);
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
};

const onError = () => {
  throw new Error(`ERROR LOADING`);
};

const onSuccess = (filmsArray) => {
  const topRatedFilms = getShuffledSubarray(filmsArray, CountOfFilms.EXTRA);
  const mostCommentedFilms = getShuffledSubarray(filmsArray, CountOfFilms.EXTRA);

  renderFilms(commonFilmsContainer, filmsArray, Group.ALL);
  renderFilms(topRatedFilmsContainer, topRatedFilms, Group.TOP_RATED);
  renderFilms(mostCommentedFilmsContainer, mostCommentedFilms, Group.MOST_COMMENTED);
};

const loadMoreFilms = () => {
  const films = generateFilms(FILMS_PER_LOAD);
  FilmStorage.get().addFilms(films);
  renderFilms(commonFilmsContainer, films, Group.ALL);
};

renderFilters(FILTERS);
// initFilmCardFilters();

loadMoreFilms();
showMoreBtn.addEventListener(`click`, loadMoreFilms);
