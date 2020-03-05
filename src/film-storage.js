import {FilmStorageEventType} from "./constants";

class FilmStorage {

  constructor() {
    this._filmsMap = new Map();
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
    let film = this._filmsMap.get(filmId);

    if (film) {
      return film;
    } else {
      throw new Error(`Film with ID ${filmId} not found`);
    }
  }

  getFilms() {
    const filmsArray = Array.from(this._filmsMap.values());
    return filmsArray;
  }

  addListener(listener) {
    this._listeners.push(listener);
    console.log(`[STORAGE] Total ${this._listeners.length} listeners`);
  }

  addFilms(films) {
    films.forEach((film) => {
      this._filmsMap.set(film.id, film);
    });
    console.log(`Add more ${films.length} films. Total: ${this._filmsMap.size} films.`);
    console.log(`Films in map: `, this._filmsMap);
  }

  notifyFilmCommentAdded(filmId, comment) {
    this._listeners.forEach((listener) => {
      const evt = {
        type: FilmStorageEventType.COMMENT_ADDED,
        filmId,
        comment
      };
      listener(evt);
    });
  }

  addComment(filmId, comment) {
    let film = this._filmsMap.get(filmId);

    if (film) {
      film.comments.push(comment);
      this._filmsMap.set(filmId, film);
      this.notifyFilmCommentAdded(filmId, comment);
      console.log(`Comment has been updated for film with ID = ${filmId}`);
    } else {
      throw new Error(`Film with ID ${filmId} not found`);
    }
  }

  notifyWatchlistChange(filmId, isOnWatchlist) {
    this._listeners.forEach((listener) => {
      const evt = {
        type: FilmStorageEventType.WATCHLIST_CHANGED,
        filmId,
        isOnWatchlist
      };
      listener(evt);
    });
  }

  changeWatchlist(filmId, isOnWatchlist) {
    let film = this._filmsMap.get(filmId);

    if (film) {
      film.isOnWatchlist = !film.isOnWatchlist;
      this._filmsMap.set(filmId, film);
      this.notifyWatchlistChange(filmId, isOnWatchlist);
      console.log(`film with ID = ${filmId}`);
    } else {
      throw new Error(`Film with ID ${filmId} not found`);
    }
  }

  notifyWatchedChange(filmId, isWatched) {
    this._listeners.forEach((listener) => {
      const evt = {
        type: FilmStorageEventType.WATCHED_CHANGED,
        filmId,
        isWatched
      };
      listener(evt);
    });
  }

  changeWatched(filmId, isWatched) {
    let film = this._filmsMap.get(filmId);

    if (film) {
      film.isWatched = !film.isWatched;
      this._filmsMap.set(filmId, film);
      this.notifyWatchedChange(filmId, isWatched);
      console.log(`film with ID = ${filmId}`);
    } else {
      throw new Error(`Film with ID ${filmId} not found`);
    }
  }

  notifyFavoriteChange(filmId, isFavorite) {
    this._listeners.forEach((listener) => {
      const evt = {
        type: FilmStorageEventType.FAVORITE_CHANGED,
        filmId,
        isFavorite
      };
      listener(evt);
    });
  }

  changeFavorite(filmId, isFavorite) {
    let film = this._filmsMap.get(filmId);

    if (film) {
      film.isFavorite = !film.isFavorite;
      this._filmsMap.set(filmId, film);
      this.notifyFavoriteChange(filmId, isFavorite);
      console.log(`film with ID = ${filmId}`);
    } else {
      throw new Error(`Film with ID ${filmId} not found`);
    }
  }
}

export {FilmStorage};
