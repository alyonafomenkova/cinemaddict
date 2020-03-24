import {CountOfFilms, generateFilms} from './data.js';
import {getRandomNumber, getShuffledSubarray, getSubarray} from './util.js';
import {FILTERS, filtersList, renderFilters, changeClassForActiveFilter, filterFilms} from './filter.js';
import {FilmStorage} from './film-storage.js';
import {ElementBuilder} from './element-builder.js';
import {Statistics} from './statistics/statistics.js';
import {hideStatistic} from './statistics/statistics-setup.js';
import {KeyCode, FilmStorageEventType} from './constants';
import {observeFilmStorageDetailedFilm, changeWatchlistOnSmallFilm, changeWatchedOnSmallFilm, changeFavoriteOnSmallFilm} from './small-film';
import {setDetailedCardCommentsCount, changeEmoji, addComment, changeRating, changeWatchlist, changeWatched, changeFavorite, observeFilmStorageSmallFilm} from './detailed-film';
import moment from "moment";

const FILMS_PER_LOAD = 5;
const filmsContainers = document.querySelectorAll(`.films-list__container`);
const commonFilmsContainer = filmsContainers[0];
const topRatedFilmsContainer = filmsContainers[1];
const mostCommentedFilmsContainer = filmsContainers[2];
const Group = {
  ALL: 0,
  TOP_RATED: 1,
  MOST_COMMENTED: 2
};
///// SERVER //////////////
import {Network} from './network';
const AUTHORIZATION = `Basic dXNlckBwYXNzd35yZAo=${Math.random()}`;
const END_POINT = `https://es8-demo-srv.appspot.com/moowle`;
export const network = new Network({endPoint: END_POINT, authorization: AUTHORIZATION});

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
      const watchListInput = detailedFilmComponent.querySelector(`#addwatchlist`);
      const watchedInput = detailedFilmComponent.querySelector(`#watched`);
      const favoriteInput = detailedFilmComponent.querySelector(`#favorite`);
      body.removeChild(detailedFilmComponent);
      body.removeChild(overlay);
      commentsArea.removeEventListener(`keydown`, commentAddListener);
      watchListInput.removeEventListener(`click`, changeWatchlistListener);
      watchedInput.removeEventListener(`click`, changeWatchedListener);
      favoriteInput.removeEventListener(`click`, changeFavoriteListener);
    };

    const onSmallFilmClick = () => {
      const film = FilmStorage.get().getFilm(filmId);
      const emoji = detailedFilmComponent.querySelector(`.film-details__emoji-list`);
      const commentsArea = detailedFilmComponent.querySelector(`.film-details__new-comment`);
      const ratingArea = detailedFilmComponent.querySelector(`.film-details__user-rating-score`);
      const watchListInput = detailedFilmComponent.querySelector(`#addwatchlist`);
      const watchedInput = detailedFilmComponent.querySelector(`#watched`);
      const favoriteInput = detailedFilmComponent.querySelector(`#favorite`);
      body.appendChild(overlay);
      body.appendChild(detailedFilmComponent);
      setDetailedCardCommentsCount(film.comments.length);

      changeEmojiListener = changeEmoji(detailedFilmComponent);
      commentAddListener = addComment(film);
      changeRatingListener = changeRating(film, detailedFilmComponent);
      changeWatchlistListener = changeWatchlist(film);
      changeWatchedListener = changeWatched(film);
      changeFavoriteListener = changeFavorite(film);

      emoji.addEventListener(`click`, changeEmojiListener);
      commentsArea.addEventListener(`keydown`, commentAddListener);
      ratingArea.addEventListener(`click`, changeRatingListener);
      watchListInput.addEventListener(`click`, changeWatchlistListener);
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
  const onFiltersClick = (evt) => {
    evt.preventDefault();
    const target = evt.target;
    const filteredFilms = filterFilms(films, target.id);
    changeClassForActiveFilter(target);
    hideStatistic();
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

renderFilters(FILTERS);
initFilters();

///// STATISTICS /////
import {statsBtn, showStatistic} from './statistics/statistics-setup.js';
import {Message} from './constants.js';
statsBtn.addEventListener(`click`, showStatistic);

///// SERVER /////

const FILMS_STEP = 5;

const filmsLoader = document.querySelector(`.films-list__show-more`);
const messageContainer = document.querySelector(`.films-list__title`);
let allFilms; //

const showLoadingMessage = (text) => {
  messageContainer.classList.remove(`visually-hidden`);
  messageContainer.textContent = text;
};

const hideLoadingMessage = () => {
  messageContainer.classList.add(`visually-hidden`);
};

const getRatedFilms = (films) => {
  return films.slice()
    .sort((left, right) => Number(right.totalRating) - Number(left.totalRating)).slice(0, 2);
};

const getCommentedFilms = (films) => {
  return films.slice()
    .sort((left, right) => right.comments.length - left.comments.length).slice(0, 2);
};

showLoadingMessage(Message.LOADING);

network.getFilms()
  .then((films) => {
    console.log("Фильмы с сервера: ", films);
    FilmStorage.get().addFilms(films);
    hideLoadingMessage();
    allFilms = films;
    let result = loadMoreFilms(FILMS_STEP);
    return result;
  })
  .catch(() => {
    showLoadingMessage(Message.ERROR);
  });

let renderedFilms = [];
let from = 0;

function loadMoreFilms(count) {
  let to = from + count - 1;

  if (to >= allFilms.length) {
    to = allFilms.length - 1;
  }

  if (from > allFilms.length) {
    return;
  }

  for (let i = from; i <= to; i++) {
    renderedFilms.push(allFilms[i]);
  }

  from = renderedFilms.length;

  if (renderedFilms.length === allFilms.length) {
    filmsLoader.classList.add(`visually-hidden`);
  }

  commonFilmsContainer.innerHTML = ``;
  topRatedFilmsContainer.innerHTML = ``;
  mostCommentedFilmsContainer.innerHTML = ``;
  renderFilms(commonFilmsContainer, renderedFilms, Group.ALL);
  renderFilms(topRatedFilmsContainer, getRatedFilms(renderedFilms), Group.TOP_RATED);
  renderFilms(mostCommentedFilmsContainer, getCommentedFilms(renderedFilms), Group.MOST_COMMENTED);
}

function onLoaderClick(evt) {
  evt.preventDefault();
  loadMoreFilms(FILMS_PER_LOAD);
}

filmsLoader.addEventListener(`click`, onLoaderClick);
