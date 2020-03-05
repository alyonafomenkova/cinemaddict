import {FilmStorageEventType} from "./constants";
import {FilmStorage} from "./film-storage";
import {checkExists} from "./util";

const setSmallCardCommentsCount = (filmComponent, count) => {
  const commentsCountField = filmComponent.querySelector(`.film-card__comments`);
  commentsCountField.innerHTML = count + ` comments`;
};

function changeWatchlistOnSmallFilm(film) {
  return function () {
    event.preventDefault();
    const storage = FilmStorage.get();
    storage.changeWatchlist(film.id, !film.isOnWatchlist);
  };
}

function changeWatchedOnSmallFilm(film) {
  return function () {
    event.preventDefault();
    const storage = FilmStorage.get();
    storage.changeWatched(film.id, !film.isWatched);
  };
}

function changeFavoriteOnSmallFilm(film) {
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

const observeFilmStorageDetailedFilm = (evt, film, filmComponent) => {
  if (evt.type === FilmStorageEventType.COMMENT_ADDED && evt.filmId === film.id) {
    const count = FilmStorage.get().getFilm(film.id).comments.length;
    setSmallCardCommentsCount(filmComponent, count);
  }

  if (evt.type === FilmStorageEventType.WATCHLIST_CHANGED && evt.filmId === film.id) {
    const status = FilmStorage.get().getFilm(film.id).isOnWatchlist;
    const watchlistBtn = filmComponent.querySelector(`.film-card__controls-item--add-to-watchlist`);
    updateBtnStatus(status, watchlistBtn);
  }

  if (evt.type === FilmStorageEventType.WATCHED_CHANGED && evt.filmId === film.id) {
    const status = FilmStorage.get().getFilm(film.id).isWatched;
    const watchedBtn = filmComponent.querySelector(`.film-card__controls-item--mark-as-watched`);
    updateBtnStatus(status, watchedBtn);
  }

  if (evt.type === FilmStorageEventType.FAVORITE_CHANGED && evt.filmId === film.id) {
    const status = FilmStorage.get().getFilm(film.id).isFavorite;
    const favoriteBtn = filmComponent.querySelector(`.film-card__controls-item--favorite`);
    updateBtnStatus(status, favoriteBtn);
  }
};

export {setSmallCardCommentsCount, changeWatchlistOnSmallFilm, changeWatchedOnSmallFilm, changeFavoriteOnSmallFilm, observeFilmStorageDetailedFilm};
