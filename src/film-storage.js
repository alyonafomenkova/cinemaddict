class FilmStorage {

  constructor() {
    this.filmsMap = new Map();
  }

  static get() {
    if (!this._instance) {
      console.log("Creating FilmStorage singleton instance");
      this._instance = new FilmStorage();
    }
    return this._instance;
  }

  addFilms(films) {
    films.forEach((film) => {
      this.filmsMap.set(film.id, film);
    });
    console.log(`Add more ${films.length} films. Total: ${this.filmsMap.size} films.`);
  }

  changeRating(film) {
    return function () {
      const userRating = film.querySelector(`.film-details__user-rating-input:checked`).value;
      film.querySelector(`.film-details__user-rating span`).innerHTML = userRating;
    };
  }
}

export {FilmStorage};
