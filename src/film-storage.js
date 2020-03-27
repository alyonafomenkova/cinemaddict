import {ProviderEventType} from "./constants";

class FilmStorage {

  constructor({key, storage}) {
    //this._filmsMap = new Map();
    this._storeKey = key; // имя ячейки в localStorage в которую он будет записывать данные
    this._storage = storage;
    // this._listeners = [];
    // this.addListener = this.addListener.bind(this);
  }

  setItem({key, item}) {
    const items = this.getAll();
    items[key] = item;

    this._storage.setItem(this._storeKey, JSON.stringify(items));
  }

  getItem({key}) {
    const items = this.getAll();
    console.log("[STPRAGE getItem items: ]", items);
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
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`Error parse items. Error: ${error}. Items: ${items}`);
      return emptyItems;
    }
  }

  //
  // getFilm(filmId) {
  //   const films = this.getFilms();
  //   console.log("films: ", films);
  //   console.log("film: ", films[filmId]);
  //   return films[filmId];
  // }
  //

  // getFilms() {
  //   const filmsArray = Array.from(this._filmsMap.values());
  //   return filmsArray;
  // }

  // addFilms(films) {
  //   films.forEach((film) => {
  //     this._filmsMap.set(film.id, film);
  //   });
  //   console.log(`Add more ${films.length} films. Total: ${this._filmsMap.size} films.`);
  //   console.log(`Films in map: `, this._filmsMap);
  // }

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
        type: ProviderEventType.WATCHED_CHANGED,
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
        type: ProviderEventType.FAVORITE_CHANGED,
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
