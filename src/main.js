import {CountOfFilms, generateFilms} from './data.js';
import {getRandomNumber, getShuffledSubarray, getSubarray} from './util.js';
import {FILTERS, filtersList, renderFilters, changeClassForActiveFilter, filterFilms} from './filter.js';
import {FilmStorage} from './film-storage.js';
import {ElementBuilder} from './element-builder.js';
import {KeyCode, FilmStorageEventType} from './constants';
import {observeFilmStorageDetailedFilm, changeWatchlistOnSmallFilm, changeWatchedOnSmallFilm, changeFavoriteOnSmallFilm} from './small-film';
import {setDetailedCardCommentsCount, changeEmoji, addComment, changeRating, changeWatchlist, changeWatched, changeFavorite, observeFilmStorageSmallFilm} from './detailed-film';
import moment from "moment";

const FILMS_PER_LOAD = 5;
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

  filmsArray.map((film) => (film.id)).forEach((filmId) => {
    const overlay = ElementBuilder.createOverlay();
    let commentAddListener = null;
    let changeEmojiListener = null;
    let changeRatingListener = null;
    let changeWatchlistListener = null;
    let changeWatchedListener = null;
    let changeFavoriteListener = null;

    const onDetailedFilmClick = () => {
      const commentsArea = detailedFilmComponent.querySelector(`.film-details__new-comment`);
      const watchlistInput = detailedFilmComponent.querySelector(`#watchlist`);
      const watchedInput = detailedFilmComponent.querySelector(`#watched`);
      const favoriteInput = detailedFilmComponent.querySelector(`#favorite`);
      body.removeChild(detailedFilmComponent);
      body.removeChild(overlay);
      commentsArea.removeEventListener(`keydown`, commentAddListener);
      watchlistInput.removeEventListener(`click`, changeWatchlistListener);
      watchedInput.removeEventListener(`click`, changeWatchedListener);
      favoriteInput.removeEventListener(`click`, changeFavoriteListener);
    };

    const onSmallFilmClick = () => {
      const film = FilmStorage.get().getFilm(filmId);
      const emoji = detailedFilmComponent.querySelector(`.film-details__emoji-list`);
      const commentsArea = detailedFilmComponent.querySelector(`.film-details__new-comment`);
      const ratingArea = detailedFilmComponent.querySelector(`.film-details__user-rating-score`);
      const watchlistInput = detailedFilmComponent.querySelector(`#watchlist`);
      const watchedInput = detailedFilmComponent.querySelector(`#watched`);
      const favoriteInput = detailedFilmComponent.querySelector(`#favorite`);
      body.appendChild(overlay);
      body.appendChild(detailedFilmComponent);
      setDetailedCardCommentsCount(film.comments.length);

      changeEmojiListener = changeEmoji(detailedFilmComponent);
      commentAddListener = addComment(film);
      changeRatingListener = changeRating(detailedFilmComponent);
      changeWatchlistListener = changeWatchlist(film);
      changeWatchedListener = changeWatched(film);
      changeFavoriteListener = changeFavorite(film);

      emoji.addEventListener(`click`, changeEmojiListener);
      commentsArea.addEventListener(`keydown`, commentAddListener);
      ratingArea.addEventListener(`click`, changeRatingListener);
      watchlistInput.addEventListener(`click`, changeWatchlistListener);
      watchedInput.addEventListener(`click`, changeWatchedListener);
      favoriteInput.addEventListener(`click`, changeFavoriteListener);
    };

    const film = FilmStorage.get().getFilm(filmId);
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
    const watchlistBtn = filmComponent.querySelector(`.film-card__controls-item--add-to-watchlist`);
    const watchedBtn = filmComponent.querySelector(`.film-card__controls-item--mark-as-watched`);
    const favoriteBtn = filmComponent.querySelector(`.film-card__controls-item--favorite`);
    changeWatchlistListener = changeWatchlistOnSmallFilm(film);
    changeWatchedListener = changeWatchedOnSmallFilm(film);
    changeFavoriteListener = changeFavoriteOnSmallFilm(film);
    container.appendChild(filmComponent);

    FilmStorage.get().addListener((evt) => {
      observeFilmStorageDetailedFilm(evt, film, filmComponent);
      observeFilmStorageSmallFilm(evt, film, detailedFilmComponent);
    });
    watchlistBtn.addEventListener(`click`, changeWatchlistListener);
    watchedBtn.addEventListener(`click`, changeWatchedListener);
    favoriteBtn.addEventListener(`click`, changeFavoriteListener);
  });
};

const initFilters = () => {
  const films = FilmStorage.get().getFilms();
  console.log("films: ", films);
  const onFiltersClick = (evt) => {
    evt.preventDefault();
    const target = evt.target;
    changeClassForActiveFilter(target);

    const filteredFilms = filterFilms(films, target.id);
    console.log("filteredFilms: ", filteredFilms);

    commonFilmsContainer.innerHTML = ``;
    renderFilms(commonFilmsContainer, filteredFilms, Group.ALL);
  };

  filtersList.forEach((item) => {
    item.addEventListener(`click`, onFiltersClick);
  });
};

const onError = () => {
  throw new Error(`ERROR LOADING`);
};

const onSuccess = (filmsArray) => {
  const topRatedFilms = getShuffledSubarray(filmsArray, CountOfFilms.EXTRA);
  const mostCommentedFilms = getShuffledSubarray(filmsArray, CountOfFilms.EXTRA);

  // renderFilms(commonFilmsContainer, filmsArray, Group.ALL);
  // renderFilms(topRatedFilmsContainer, topRatedFilms, Group.TOP_RATED);
  // renderFilms(mostCommentedFilmsContainer, mostCommentedFilms, Group.MOST_COMMENTED);
};

const loadMoreFilms = () => {
  const films = generateFilms(FILMS_PER_LOAD);
  FilmStorage.get().addFilms(films);
  renderFilms(commonFilmsContainer, films, Group.ALL);
};

loadMoreFilms();
showMoreBtn.addEventListener(`click`, loadMoreFilms);

//////////////////////////////////////////////////////////////////////

renderFilters(FILTERS);
// initFilmCardFilters();
initFilters();

