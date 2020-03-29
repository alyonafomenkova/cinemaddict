import {ProviderEventType} from "./constants";
import {Provider} from "./provider.js";

export const setSmallCardCommentsCount = (film, count) => {
  const commentsCountField = document.querySelector(`.film-card__comments`);
  commentsCountField.innerHTML = count + ` comments`;
};

export function changeWatchlistOnSmallFilm(film) {
  return function () {
    event.preventDefault();
    Provider.get().changeWatchlist(film.id);
  };
}

export function changeWatchedOnSmallFilm(film) {
  return function () {
    event.preventDefault();
    Provider.get().changeWatched(film.id);
  };
}

export function changeFavoriteOnSmallFilm(film) {
  return function () {
    event.preventDefault();
    Provider.get().changeFavorite(film.id);
  };
}

const updateBtnStatus = (status, btn) => {
  if (status) {
    btn.classList.add(`film-card__controls-item--active`);
  } else {
    btn.classList.remove(`film-card__controls-item--active`);
  }
};

export const observeProviderDetailedFilm = (evt, film, filmComponent) => {
  if (evt.type === ProviderEventType.COMMENT_ADDED && evt.filmId === film.id) {
    const count = Provider.get().getFilm(film.id).comments.length;
    setSmallCardCommentsCount(film, count);
  }

  if (evt.type === ProviderEventType.WATCHLIST_CHANGED && evt.filmId === film.id) {
    const status = evt.isOnWatchlist;
    const watchlistBtn = filmComponent.querySelector(`.film-card__controls-item--add-to-watchlist`);
    updateBtnStatus(status, watchlistBtn);
  }

  if (evt.type === ProviderEventType.WATCHED_CHANGED && evt.filmId === film.id) {
    const status = Provider.get().getFilm(film.id).isWatched;
    const watchedBtn = filmComponent.querySelector(`.film-card__controls-item--mark-as-watched`);
    updateBtnStatus(status, watchedBtn);
  }

  if (evt.type === ProviderEventType.FAVORITE_CHANGED && evt.filmId === film.id) {
    const status = Provider.get().getFilm(film.id).isFavorite;
    const favoriteBtn = filmComponent.querySelector(`.film-card__controls-item--favorite`);
    updateBtnStatus(status, favoriteBtn);
  }
};
