import {Adapter} from "./adapter";
import {objectToArray} from "./util.js";

const Provider = class {
  constructor({network, storage, generateId}) {
    this._network = network;
    this._storage = storage;
    this._generateId = generateId;
    this._needSync = false;
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
      console.log("[PROVIDER] getFilm rawFilms: ", rawFilms);
      //const films = Adapter.parseFilms(rawFilms);
      //console.log("[PROVIDER] getFilm films: ", films);
      //return Promise.resolve(films);
      return Promise.resolve(rawFilms);
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
    return this._network.updateFilm({id, data})
      .then((film) => {
        this._storage.setItem({key: film.id, item: film.toRAW()});
        return film;
      });
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
