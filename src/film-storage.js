import {FilmStorageEventType} from "./constants";

const FILMS_STORE_KEY = `films-store-key`;

class FilmStorage {

  constructor({key, storage}) {
    //this._filmsMap = new Map();
    this._storeKey = key; // имя ячейки в localStorage в которую он будет записывать данные
    this._storage = storage;
    this._listeners = [];
    this.addListener = this.addListener.bind(this);
  }

  static get() {
    if (!this._instance) {
      console.log(`Creating FilmStorage singleton instance`);
      this._instance = new FilmStorage({key: FILMS_STORE_KEY, storage: localStorage});
    }
    return this._instance;
  }

  //
  setItem({key, item}) {
    const items = this.getAll();
    items[key] = item;

    this._storage.setItem(this._storeKey, JSON.stringify(items));
  }

  getItem({key}) {
    const items = this.getAll();
    return items[key];
  }

  removeItem({key}) {
    const items = this.getAll();
    delete items[key];

    this._storage.setItem(this._storeKey, JSON.stringify(items));
  }

  getAll() {
    const emptyItems = {};
    const items = this._storage.getItem(this._storeKey);

    if (!items) {
      return emptyItems;
    }

    try {
      return JSON.parse(items);
    } catch (e) {
      console.error(`Error parse items. Error: ${e}. Items: ${items}`);
      return emptyItems;
    }
  }
  //

  // getFilm(filmId) {
  //   let film = this._filmsMap.get(filmId);
  //
  //   if (film) {
  //     return film;
  //   } else {
  //     throw new Error(`Film with ID ${filmId} not found`);
  //   }
  //
  //   /*
  //     const rawTasksMap = this._store.getAll();
  //     const rawTasks = objectToArray(rawTasksMap);
  //     const tasks = ModelTask.parseTasks(rawTasks);
  //   */
  // }

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

  notifyUserRatingChange(filmId, userRating) {
    this._listeners.forEach((listener) => {
      const evt = {
        type: FilmStorageEventType.USER_RATING_CHANGED,
        filmId,
        userRating
      };
      listener(evt);
    });
  }

  changeUserRating(filmId, userRating) {
    let film = this._filmsMap.get(filmId);

    if (film) {
      this._filmsMap.set(filmId, film);
      this.notifyUserRatingChange(filmId, userRating);
      console.log(`film with ID = ${filmId}`);
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
