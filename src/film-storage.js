import {KeyCode, FilmStorageEventType} from "./constants";
import moment from "moment";
import {ElementBuilder} from "./element-builder";

// /////////////////////////////////////////////////////////////
// ////////////  НИКАКОГО UI ЗДЕСЬ НЕ ДОЛЖНО БЫТЬ //////////////
// /////////////////////////////////////////////////////////////
class FilmStorage {

  constructor() {
    this.filmsMap = new Map();
    this._listeners = [];
    this.addListener = this.addListener.bind(this);
  }

  static get() {
    if (!this._instance) {
      console.log(`Creating FilmStorage singleton instance`);
      this._instance = new FilmStorage();
    }
    return this._instance;
  }

  getFilm(filmId) {
    let film = this.filmsMap.get(filmId);

    if (film) {
      return film;
    } else {
      throw new Error(`Film with ID ${filmId} not found`);
    }
  }

  addListener(listener) {
    this._listeners.push(listener);
    console.log(`[STORAGE] Total ${this._listeners.length} listeners`);
  }

  notifyFilmCommentAdded(filmId, comment) {
    this._listeners.forEach((listener) => {
      const evt = {
        type: FilmStorageEventType.COMMENT_ADDED,
        filmId: filmId,
        comment: comment
      };
      listener(evt);
    });
  }

  addFilms(films) {
    films.forEach((film) => {
      this.filmsMap.set(film.id, film);
    });
    console.log(`Add more ${films.length} films. Total: ${this.filmsMap.size} films.`);
  }

  addComment(filmId, comment) {
    let film = this.filmsMap.get(filmId);

    if (film) {
      film.comments.push(comment);
      this.filmsMap.set(filmId, film);
      this.notifyFilmCommentAdded(filmId, comment);
      console.log(`Comment has been updated for film with ID = ${filmId}`);
    } else {
      throw new Error(`Film with ID ${filmId} not found`);
    }
  }


  //
  notifyWatchlistChange(filmId, isOnWatchlist) {
    this._listeners.forEach((listener) => {
      const evt = {
        type: FilmStorageEventType.WATCHLIST_CHANGED,
        filmId: filmId,
        isOnWatchlist: isOnWatchlist
      };
      listener(evt);
    });
  }

  changeWatchlist(filmId, isOnWatchlist) {
    let film = this.filmsMap.get(filmId);

    if (film) {
      film.isOnWatchlist = !film.isOnWatchlist;
      this.filmsMap.set(filmId, film);
      console.log("что в storage после клика: ", film.isOnWatchlist);
      this.notifyWatchlistChange(filmId, isOnWatchlist);
      console.log(`film with ID = ${filmId}`);
    } else {
      throw new Error(`Film with ID ${filmId} not found`);
    }
  }

  // watchlistChange(film) {
  //   return function () {
  //     console.log(`watchlistChange: `, film);
  //     film.isOnWatchlist = !film.isOnWatchlist;
  //   };
  // }
  //
  // watchedChange(film) {
  //   return function () {
  //     console.log(`watchedChange: `, film);
  //     film.isWatched = !film.isWatched;
  //   };
  // }
  //
  // favoriteChange(film) {
  //   return function () {
  //     console.log(`favoriteChange: `, film);
  //     film.isFavorite = !film.isFavorite;
  //   };
  // }
}

export {FilmStorage};
