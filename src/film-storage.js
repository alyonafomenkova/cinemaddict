import {generatedFilms} from "./data";
console.log(`generatedFilms: `, generatedFilms);

class FilmStorage {
  constructor() {
    this._films = [];
  }

  load(onError, onSuccess) {
    this._films = generatedFilms;
    onSuccess(this._films)
  }
}

export {FilmStorage};
