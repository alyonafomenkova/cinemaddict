import {getRandomNumber, getShuffledSubarray, getSubarray, setUserRank} from './util.js';
import {FiltersId, FILTERS, filtersList, renderFilters, setCountFilmForFilter, changeClassForActiveFilter, filterFilms, observeCountFilms} from './filter.js';
import {clearSearchContainer, initSearch} from './search.js';
import {FilmStorage} from './film-storage.js';
import {Network} from './network';
import {ElementBuilder} from './element-builder.js';
import {Provider} from './provider.js';
import {Statistics} from './statistics/statistics.js';
import {hideStatistic} from './statistics/statistics-setup.js';
import {Group, KeyCode, ProviderEventType, Rating} from './constants';
import {createFilmComponent, observeProviderDetailedFilm, changeWatchlistOnSmallFilm, changeWatchedOnSmallFilm, changeFavoriteOnSmallFilm} from './small-film';
import {hideCommentControls, changeEmoji, addComment, changeRating, changeWatchlist, changeWatched, changeFavorite, observeProviderSmallFilm} from './detailed-film';
import moment from "moment";

const FILMS_PER_LOAD = 5;
const AUTHORIZATION = `Basic dXNlckBwYXNzdffysAo=${Math.random()}`;
const END_POINT = `https://es8-demo-srv.appspot.com/moowle`;
const FILMS_STORE_KEY = `films-store-key`;
const filmsContainers = document.querySelectorAll(`.films-list__container`);
export const commonFilmsContainer = filmsContainers[0];
const topRatedFilmsContainer = filmsContainers[1];
const mostCommentedFilmsContainer = filmsContainers[2];
const profileRating = document.querySelector(`.profile__rating`);
const footerStatistics = document.querySelector(`.footer__statistics p`);

export const network = new Network({endPoint: END_POINT, authorization: AUTHORIZATION});
export const storage = new FilmStorage({key: FILMS_STORE_KEY, storage: localStorage});

window.addEventListener(`offline`, () => {
  document.title = `${document.title}[OFFLINE]`;
});
window.addEventListener(`online`, () => {
  document.title = document.title.split(`[OFFLINE]`)[0];
  Provider.get().syncFilms();
});

const updateProfileRating = (films) => {
  profileRating.textContent = setUserRank(films);
};

const setupFooterStatistics = (allFilms) => {
  const filmsCount = allFilms.length;
  footerStatistics.textContent = `${filmsCount} movie${filmsCount === 1 ? `` : `s`} inside`;
};

export const renderFilms = (container, filmsArray, group) => {
  const body = document.querySelector(`body`);

  filmsArray.map((film) => (film.id)).forEach((filmId) => {
    const overlay = ElementBuilder.createOverlay();
    let filmComponent;
    let commentAddListener = null;
    let changeEmojiListener = null;
    let changeRatingListener = null;
    let changeWatchlistListener = null;
    let changeWatchedListener = null;
    let changeFavoriteListener = null;

    const removeDetailedFilmComponent = () => {
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

    const onEscPress = (evt) => {
      if (evt.keyCode === KeyCode.ESC) {
        removeDetailedFilmComponent();
      }
    };

    const onSmallFilmClick = () => {
      const film = allFilmsInProvider.find((x) => x.id == filmId);
      const emoji = detailedFilmComponent.querySelector(`.film-details__emoji-list`);
      const commentsArea = detailedFilmComponent.querySelector(`.film-details__new-comment`);
      const ratingArea = detailedFilmComponent.querySelector(`.film-details__user-rating-score`);
      const watchListInput = detailedFilmComponent.querySelector(`#addwatchlist`);
      const watchedInput = detailedFilmComponent.querySelector(`#watched`);
      const favoriteInput = detailedFilmComponent.querySelector(`#favorite`);
      body.appendChild(overlay);
      body.appendChild(detailedFilmComponent);
      hideCommentControls(detailedFilmComponent);

      changeEmojiListener = changeEmoji(detailedFilmComponent);
      commentAddListener = addComment(film);
      changeRatingListener = changeRating(film, detailedFilmComponent);
      changeWatchlistListener = changeWatchlist(film);
      changeWatchedListener = changeWatched(film);
      changeFavoriteListener = changeFavorite(film);

      document.addEventListener(`keydown`, onEscPress);
      emoji.addEventListener(`click`, changeEmojiListener);
      commentsArea.addEventListener(`keydown`, commentAddListener);
      ratingArea.addEventListener(`click`, changeRatingListener);
      watchListInput.addEventListener(`click`, changeWatchlistListener);
      watchedInput.addEventListener(`click`, changeWatchedListener);
      favoriteInput.addEventListener(`click`, changeFavoriteListener);
    };

    const film = allFilmsInProvider.find((x) => x.id == filmId);

    if (film) {
      filmComponent = ElementBuilder.buildSmallFilmElement(group, film, onSmallFilmClick);
    } else {
      console.error(`Film with ID  ${filmId} not found`);
    }

    const detailedFilmComponent = ElementBuilder.buildDetailedFilmElement(film, removeDetailedFilmComponent);
    const watchlistBtn = filmComponent.querySelector(`.film-card__controls-item--add-to-watchlist`);
    const watchedBtn = filmComponent.querySelector(`.film-card__controls-item--mark-as-watched`);
    const favoriteBtn = filmComponent.querySelector(`.film-card__controls-item--favorite`);
    changeWatchlistListener = changeWatchlistOnSmallFilm(film);
    changeWatchedListener = changeWatchedOnSmallFilm(film);
    changeFavoriteListener = changeFavoriteOnSmallFilm(film);
    container.appendChild(filmComponent);

    const listener = (evt) => {
      observeProviderDetailedFilm(evt, film, filmComponent);
      observeProviderSmallFilm(evt, film, detailedFilmComponent);
      observeCountFilms();
      updateProfileRating(filmsArray);
    };
    if (group === Group.TOP_RATED) {
      Provider.get().addListener(`rated_` + film.id, listener);
    } else if (group === Group.MOST_COMMENTED) {
      Provider.get().addListener(`commented_` + film.id, listener);
    } else {
      Provider.get().addListener(`small_` + film.id, listener);
    }
    watchlistBtn.addEventListener(`click`, changeWatchlistListener);
    watchedBtn.addEventListener(`click`, changeWatchedListener);
    favoriteBtn.addEventListener(`click`, changeFavoriteListener);
  });
};


// /// STATISTICS /////
import {statsBtn, showStatistic} from './statistics/statistics-setup.js';
import {Message} from './constants.js';


// /// SERVER /////


const filmsLoader = document.querySelector(`.films-list__show-more`);
const messageContainer = document.querySelector(`.films-list__title`);
let allFilmsInProvider;

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
    allFilmsInProvider = films;
    let visibleFilms = Provider.get().loadMoreFilms(films, FILMS_PER_LOAD);
    clearAndRenderFilms(visibleFilms);
    renderFilters(FILTERS);
    setCountFilmForFilter(visibleFilms);
    initSearch(visibleFilms);
    updateProfileRating(visibleFilms);
    initFilters(visibleFilms);
    setupFooterStatistics(allFilmsInProvider);
    filmsLoader.addEventListener(`click`, onLoaderClick(films));
  })
  .catch(() => {
    showLoadingMessage(Message.ERROR);
  });

function clearAndRenderFilms(visibleFilms) {
  commonFilmsContainer.innerHTML = ``;
  topRatedFilmsContainer.innerHTML = ``;
  mostCommentedFilmsContainer.innerHTML = ``;
  renderFilms(commonFilmsContainer, visibleFilms, Group.ALL);
  renderFilms(topRatedFilmsContainer, getRatedFilms(visibleFilms), Group.TOP_RATED);
  renderFilms(mostCommentedFilmsContainer, getCommentedFilms(visibleFilms), Group.MOST_COMMENTED);
}

const initFilters = (films) => {
  const onFiltersClick = (evt) => {
    evt.preventDefault();
    const target = evt.target;
    if (target.id !== FiltersId.STATS) {
      const filteredFilms = filterFilms(films, target.id);
      clearSearchContainer();
      changeClassForActiveFilter(target);
      hideStatistic();
      commonFilmsContainer.innerHTML = ``;
      renderFilms(commonFilmsContainer, filteredFilms, Group.ALL);
    }
  };

  filtersList.forEach((item) => {
    item.addEventListener(`click`, onFiltersClick);
  });
};

function onLoaderClick(films) {
  return function () {
    event.preventDefault();
    films.forEach((film) => {
      Provider.get().removeListener(`small_` + film.id);
    });
    const newVisibleFilms = Provider.get().loadMoreFilms(films, FILMS_PER_LOAD);
    clearSearchContainer();
    clearAndRenderFilms(newVisibleFilms);
    setCountFilmForFilter(newVisibleFilms);
    updateProfileRating(newVisibleFilms);
    if (newVisibleFilms.length === allFilmsInProvider.length) {
      filmsLoader.classList.add(`visually-hidden`);
    }
  };
}

statsBtn.addEventListener(`click`, showStatistic);
