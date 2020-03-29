import {Adapter} from "./adapter";
import {objectToArray} from "./util.js";
import {network} from "./main";
import {storage} from "./main";
import {ProviderEventType} from "./constants";

const Provider = class {
  constructor({network, storage, generateId}) {
    this._network = network;
    this._storage = storage;
    this._generateId = generateId;
    this._needSync = false;
    this._listeners = [];
    this.addListener = this.addListener.bind(this);
  }

  static get() {
    if (!this._instance) {
      console.log(`Creating Provider singleton instance`);
      this._instance = new Provider({network, storage, generateId: () => String(Date.now())});
    }
    return this._instance;
  }

  addListener(listener) {
    this._listeners.push(listener);
    console.log(`[PROVIDER] Total ${this._listeners.length} listeners`);
  }

  notifyWatchlistChange(filmId, isOnWatchlist) {
    this._listeners.forEach((listener) => {
      const evt = {
        type: ProviderEventType.WATCHLIST_CHANGED,
        filmId,
        isOnWatchlist
      };
      listener(evt);
    });
  }

  changeWatchlist(filmId) {
    let film = this.getFilm(filmId);
    console.log(`>>>>>>>>>>>> 111: Из storage: ${film.isOnWatchlist}`);

    if (film) {
      film.isOnWatchlist = !film.isOnWatchlist;
      console.log(`>>>>>>>>>>>> 222: Обновили: ${film.isOnWatchlist}`);
      return this.updateFilm({id: film.id, data: film})
        .then(() => {
          this.notifyWatchlistChange(filmId, film.isOnWatchlist);
          console.log(`Watchlist has been changed for film with ID = ${filmId}`);
          console.log("Провайдер возвращает film.isOnWatchlist: ", film.isOnWatchlist);
          return film;
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      throw new Error(`Film with ID ${filmId} not found`);
    }
  }

  notifyUserRatingChange(filmId, userRating) {
    this._listeners.forEach((listener) => {
      const evt = {
        type: ProviderEventType.USER_RATING_CHANGED,
        filmId,
        userRating
      };
      listener(evt);
    });
  }

  changeUserRating(filmId, userRating) {
    let film = this.getFilm(filmId);

    if (film) {
      return this.updateFilm({id: film.id, data: film})
        .then(() => {
          this.notifyUserRatingChange(filmId, userRating);
          console.log(`Rating has been updated for film with ID = ${filmId}`);
          return film;
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      throw new Error(`Film with ID ${filmId} not found`);
    }
  }

  notifyFilmCommentAdded(filmId, comment) {
    this._listeners.forEach((listener) => {
      const evt = {
        type: ProviderEventType.COMMENT_ADDED,
        filmId,
        comment
      };
      listener(evt);
    });
  }

  addComment(filmId, comment) {
    let film = this.getFilm(filmId);

    if (film) {
      film.comments.push(comment);
      return this.updateFilm({id: film.id, data: film})
        .then(() => {
          this.notifyFilmCommentAdded(filmId, comment);
          console.log(`Comment has been updated for film with ID = ${filmId}`);
          return film;
        })
        .catch((error) => {
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
      console.log("[PROVIDER] getFilms rawFilms: ", rawFilms);
      const films = Adapter.parseFilms(rawFilms);
      console.log("[PROVIDER] getFilm films: ", films);
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
          return film;
        });
    } else {
      const film = data;
      this._needSync = true;
      this._storage.setItem({key: film.id, item: film});
      return Promise.resolve(Adapter.parseFilm(film));
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
    console.log("[PROVIDER] syncFilms objectToArray(this._storage.getAll()", objectToArray(this._storage.getAll()));
    return this._network.syncFilms({films: objectToArray(this._storage.getAll())});
  }

  _isOnline() {
    return window.navigator.onLine;
  }
};

export {Provider};
