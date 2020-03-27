import {ProviderEventType} from "./constants";
import {FilmStorage} from "./film-storage";//
import {Provider} from "./provider.js";

export const setSmallCardCommentsCount = (film, count) => {
  const commentsCountField = document.querySelector(`.film-card__comments`);
  commentsCountField.innerHTML = count + ` comments`;
};

export function changeWatchlistOnSmallFilm(film) {
  return function () {
    event.preventDefault();
    const storage = FilmStorage.get();
    storage.changeWatchlist(film.id, !film.isOnWatchlist);
  };
}

export function changeWatchedOnSmallFilm(film) {
  return function () {
    event.preventDefault();
    const storage = FilmStorage.get();
    storage.changeWatched(film.id, !film.isWatched);
  };
}

export function changeFavoriteOnSmallFilm(film) {
  return function () {
    event.preventDefault();
    const storage = FilmStorage.get();
    storage.changeFavorite(film.id, !film.isFavorite);
  };
}

const updateBtnStatus = (status, btn) => {
  if (status) {
    btn.classList.add(`film-card__controls-item--active`);
  } else {
    btn.classList.remove(`film-card__controls-item--active`);
  }
};

export const observeFilmStorageDetailedFilm = (evt, film, filmComponent) => {// filmComponent удалить
  if (evt.type === ProviderEventType.COMMENT_ADDED && evt.filmId === film.id) {
    const count = Provider.get().getFilm(film.id).comments.length;
    setSmallCardCommentsCount(film, count);
  }

  if (evt.type === ProviderEventType.WATCHLIST_CHANGED && evt.filmId === film.id) {
    const status = Provider.get().getFilm(film.id).isOnWatchlist;
    const watchlistBtn = filmComponent.querySelector(`.film-card__controls-item--add-to-watchlist`);// filmComponent удалить
    updateBtnStatus(status, watchlistBtn);
  }

  if (evt.type === ProviderEventType.WATCHED_CHANGED && evt.filmId === film.id) {
    const status = Provider.get().getFilm(film.id).isWatched;
    const watchedBtn = filmComponent.querySelector(`.film-card__controls-item--mark-as-watched`);// filmComponent удалить
    updateBtnStatus(status, watchedBtn);
  }

  if (evt.type === ProviderEventType.FAVORITE_CHANGED && evt.filmId === film.id) {
    const status = Provider.get().getFilm(film.id).isFavorite;
    const favoriteBtn = filmComponent.querySelector(`.film-card__controls-item--favorite`);// filmComponent удалить
    updateBtnStatus(status, favoriteBtn);
  }
};
