import {Adapter} from './adapter';
import {objectToArray} from './util.js';
import {network, storage} from './main';
import {ProviderEventType} from './constants';

const Provider = class {
  // eslint-disable-next-line no-shadow
  constructor({network, storage, generateId}) {
    this._network = network;
    this._storage = storage;
    this._generateId = generateId;
    this._renderedFilms = [];
    this._from = 0;
    this._needSync = false;
    this._listeners = new Map();
    this.addListener = this.addListener.bind(this);
  }

  static get() {
    if (!this._instance) {
      // eslint-disable-next-line no-console
      console.log(`Creating Provider singleton instance`);
      this._instance = new Provider({network, storage, generateId: () => String(Date.now())});
    }
    return this._instance;
  }

  addListener(name, listener) {
    this._listeners.set(name, listener);
    // eslint-disable-next-line no-console
    console.log(`[PROVIDER] Total ${this._listeners.size} listeners`);
  }

  removeListener(name) {
    if (this._listeners.has(name)) {
      this._listeners.delete(name);
      // eslint-disable-next-line no-console
      console.log(`[PROVIDER] Total ${this._listeners.size} listeners`);
    } else {
      // eslint-disable-next-line no-console
      console.log(`[PROVIDER] Unknown name: ${name}`);
    }
  }

  getRenderedFilms() {
    return this._renderedFilms;
  }

  loadMoreFilms(allFilms, count) {
    let to = this._from + count - 1;

    if (to >= allFilms.length) {
      to = allFilms.length - 1;
    }

    if (this._from > allFilms.length) {
      return;
    }

    for (let i = this._from; i <= to; i++) {
      this._renderedFilms.push(allFilms[i]);
    }

    this._from = this._renderedFilms.length;
    return this._renderedFilms;
  }

  notifyWatchlistChange(filmId, isOnWatchlist) {
    for (let listener of this._listeners.values()) {
      const evt = {
        type: ProviderEventType.WATCHLIST_CHANGED,
        filmId,
        isOnWatchlist
      };
      listener(evt);
    }
  }

  changeWatchlist(filmId) {
    let film = this.getFilm(filmId);

    if (film) {
      film.isOnWatchlist = !film.isOnWatchlist;
      return this.updateFilm({id: film.id, data: film})
        .then(() => {
          this.notifyWatchlistChange(filmId, film.isOnWatchlist);
          return film;
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.log(error);
        });
    } else {
      throw new Error(`Film with ID ${filmId} not found`);
    }
  }

  notifyWatchedChange(filmId, isWatched) {
    for (let listener of this._listeners.values()) {
      const evt = {
        type: ProviderEventType.WATCHED_CHANGED,
        filmId,
        isWatched
      };
      listener(evt);
    }
  }

  changeWatched(filmId) {
    let film = this.getFilm(filmId);

    if (film) {
      film.isWatched = !film.isWatched;
      return this.updateFilm({id: film.id, data: film})
        .then(() => {
          this.notifyWatchedChange(filmId, film.isWatched);
          return film;
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.log(error);
        });
    } else {
      throw new Error(`Film with ID ${filmId} not found`);
    }
  }

  notifyFavoriteChange(filmId, isFavorite) {
    for (let listener of this._listeners.values()) {
      const evt = {
        type: ProviderEventType.FAVORITE_CHANGED,
        filmId,
        isFavorite
      };
      listener(evt);
    }
  }

  changeFavorite(filmId) {
    let film = this.getFilm(filmId);

    if (film) {
      film.isFavorite = !film.isFavorite;
      return this.updateFilm({id: film.id, data: film})
        .then(() => {
          this.notifyFavoriteChange(filmId, film.isFavorite);
          return film;
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.log(error);
        });
    } else {
      throw new Error(`Film with ID ${filmId} not found`);
    }
  }

  notifyUserRatingChange(filmId, userRating) {
    for (let listener of this._listeners.values()) {
      const evt = {
        type: ProviderEventType.USER_RATING_CHANGED,
        filmId,
        userRating
      };
      listener(evt);
    }
  }

  changeUserRating(filmId, userRating) {
    let film = this.getFilm(filmId);

    if (film) {
      return this.updateFilm({id: film.id, data: film})
        .then(() => {
          this.notifyUserRatingChange(filmId, userRating);
          return film;
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.log(error);
        });
    } else {
      throw new Error(`Film with ID ${filmId} not found`);
    }
  }

  notifyFilmCommentAdded(filmId, comment) {
    for (let listener of this._listeners.values()) {
      const evt = {
        type: ProviderEventType.COMMENT_ADDED,
        filmId,
        comment
      };
      listener(evt);
    }
  }

  addComment(filmId, comment) {
    let film = this.getFilm(filmId);

    if (film) {
      film.comments.push(comment);
      return this.updateFilm({id: film.id, data: film})
        .then(() => {
          this.notifyFilmCommentAdded(filmId, comment);
          return film;
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.log(error);
        });
    } else {
      throw new Error(`Film with ID ${filmId} not found`);
    }
  }

  getFilm(filmId) {
    const films = Adapter.parseFilms(objectToArray(this._storage.getAll()));
    return films[filmId];
  }

  getFilms() {
    if (this._isOnline()) {
      return this._network.getFilms()
        .then((films) => {
          films.map((it) => {
            this._storage.setItem({key: it.id, item: it.toRAW()});
          });
          return films;
        });
    } else {
      const rawFilmsMap = this._storage.getAll();
      const rawFilms = objectToArray(rawFilmsMap);
      const films = Adapter.parseFilms(rawFilms);
      return Promise.resolve(films);
    }
  }

  createFilm({film}) {
    if (this._isOnline()) {
      return this._network.createFilm({film})
        .then((film) => {
          this._storage.setItem({key: film.id, item: film.toRAW()});
          return film;
        });
    } else {
      film.id = this._generateId();
      this._needSync = true;
      this._storage.setItem({key: film.id, item: film.toRAW()});
      return Promise.resolve(Adapter.parseFilm(film));
    }
  }

  updateFilm({id, data}) {
    if (this._isOnline()) {
      return this._network.updateFilm({id, data})
        .then((film) => {
          this._storage.setItem({key: data.id, item: data.toRAW()});
          this._renderedFilms[data.id] = data;
          return film;
        });
    } else {
      const film = data;
      this._needSync = true;
      this._storage.setItem({key: film.id, item: film.toRAW()});
      this._renderedFilms[data.id] = data;
      return Promise.resolve(film);
    }
  }

  deleteFilm({id}) {
    if (this._isOnline()) {
      return this._network.deleteFilm({id})
        .then(() => {
          this._storage.removeItem({key: id});
        });
    } else {
      this._needSync = true;
      this._storage.removeItem({key: id});
      return Promise.resolve(true);
    }
  }

  syncFilms() {
    return this._network.syncFilms({films: objectToArray(this._storage.getAll())});
  }

  _isOnline() {
    return window.navigator.onLine;
  }
};

export {Provider};
