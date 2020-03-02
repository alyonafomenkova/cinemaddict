import {FilmStorageEventType} from "./constants";
import {FilmStorage} from "./film-storage";

const setSmallCardCommentsCount = (filmComponent, count) => {
  const commentsCountField = filmComponent.querySelector(`.film-card__comments`);
  commentsCountField.innerHTML = count + ` comments`;
};

const updateBtnStatus = (status, btn) => {
  if (status) {
    console.log("status: ", status);
    console.log("btn: ", btn);
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

export {setSmallCardCommentsCount, observeFilmStorageDetailedFilm};
