import {CountOfFilms, generateFilms} from './data.js';
import {getRandomNumber, getShuffledSubarray, getSubarray} from './util.js';
import {FILTERS, filtersList, renderFilters, changeClassForActiveFilter, filterFilms} from './filter.js';
import {FilmStorage} from './film-storage.js';
import {Network} from './network';
import {ElementBuilder} from './element-builder.js';
import {Provider} from './provider.js';
import {Statistics} from './statistics/statistics.js';
import {hideStatistic} from './statistics/statistics-setup.js';
import {KeyCode, ProviderEventType} from './constants';
import {filmComponent, Group, createFilmComponent, observeFilmStorageDetailedFilm, changeWatchlistOnSmallFilm, changeWatchedOnSmallFilm, changeFavoriteOnSmallFilm} from './small-film';
import {setDetailedCardCommentsCount, changeEmoji, addComment, changeRating, changeWatchlist, changeWatched, changeFavorite, observeFilmStorageSmallFilm} from './detailed-film';
import moment from "moment";

const FILMS_PER_LOAD = 5;
const AUTHORIZATION = `Basic dXNlckBwYXNzdffysAo=${Math.random()}`;
const END_POINT = `https://es8-demo-srv.appspot.com/moowle`;
const FILMS_STORE_KEY = `films-store-key`;
const filmsContainers = document.querySelectorAll(`.films-list__container`);
const commonFilmsContainer = filmsContainers[0];
const topRatedFilmsContainer = filmsContainers[1];
const mostCommentedFilmsContainer = filmsContainers[2];

export const network = new Network({endPoint: END_POINT, authorization: AUTHORIZATION});
export const storage = new FilmStorage({key: FILMS_STORE_KEY, storage: localStorage});

window.addEventListener(`offline`, () => {
  console.log("offline document.title: ", document.title);
  document.title = `${document.title}[OFFLINE]`;
});
window.addEventListener(`online`, () => {
  document.title = document.title.split(`[OFFLINE]`)[0];
  Provider.get().syncFilms(); // bad request
});

const renderFilms = (container, filmsArray, group) => {
  const body = document.querySelector(`body`);
  console.log("[renderFilms] filmsArray: ", filmsArray);

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
      const film = allFilms.find((x) => x.id == filmId);
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

    const film = allFilms.find((x) => x.id == filmId);

    if (film) {
      createFilmComponent(group, film, onSmallFilmClick);
    } else {
      console.error(`Film with ID  ${filmId} not found`);
    }

    const detailedFilmComponent = ElementBuilder.buildDetailedFilmElement(film, onDetailedFilmClick);
    const watchlistBtn = filmComponent.querySelector(`.film-card__controls-item--add-to-watchlist`);
    const watchedBtn = filmComponent.querySelector(`.film-card__controls-item--mark-as-watched`);
    const favoriteBtn = filmComponent.querySelector(`.film-card__controls-item--favorite`);
    changeWatchlistListener = changeWatchlistOnSmallFilm(film);
    changeWatchedListener = changeWatchedOnSmallFilm(film);
    changeFavoriteListener = changeFavoriteOnSmallFilm(film);
    container.appendChild(filmComponent);

    Provider.get().addListener((evt) => {
      observeFilmStorageDetailedFilm(evt, film, filmComponent);
      observeFilmStorageSmallFilm(evt, film, detailedFilmComponent);
    });
    watchlistBtn.addEventListener(`click`, changeWatchlistListener);
    watchedBtn.addEventListener(`click`, changeWatchedListener);
    favoriteBtn.addEventListener(`click`, changeFavoriteListener);
  });
};

renderFilters(FILTERS);

// /// STATISTICS /////
import {statsBtn, showStatistic} from './statistics/statistics-setup.js';
import {Message} from './constants.js';
statsBtn.addEventListener(`click`, showStatistic);

// /// SERVER /////


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

Provider.get().getFilms()
  .then((films) => {
    console.log(`Фильмы с сервера: `, films);
    hideLoadingMessage();
    allFilms = films;
    let result = loadMoreFilms(FILMS_PER_LOAD);
    console.log("result: ", result);
    initFilters(films);
    //return result;//
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
  return renderedFilms;//
}

const initFilters = (films) => {
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

function onLoaderClick(evt) {
  evt.preventDefault();
  loadMoreFilms(FILMS_PER_LOAD);
}

filmsLoader.addEventListener(`click`, onLoaderClick);
