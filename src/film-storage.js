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

  // changeRating(film) {
  //   return function () {
  //     const userRating = film.querySelector(`.film-details__user-rating-input:checked`).value;
  //     film.querySelector(`.film-details__user-rating span`).innerHTML = userRating;
  //   };
  // }
  //
  // changeEmoji(film) {
  //   return function () {
  //     const emoji = film.querySelector(`.film-details__emoji-item:checked + label`).textContent;
  //     film.querySelector(`.film-details__add-emoji-label`).innerHTML = emoji;
  //   };
  // }

  // static updateSmallFilm(film) {
  //   console.log(`updateSmallFilm: `, film);
  // }

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

  // addComments(film, template) {
  //   return function () {
  //     const commentsList = template.querySelector(`.film-details__comments-list`);
  //     const commentField = template.querySelector(`.film-details__comment-input`);
  //     const commentsCountField = template.querySelector(`.film-details__comments-count`);
  //
  //     if (event.ctrlKey && event.keyCode === KeyCode.ENTER && commentField.value) {
  //       const newComment = {};
  //       newComment.text = commentField.value;
  //       newComment.author = `Ivan Inanov`;
  //       newComment.emoji = template.querySelector(`.film-details__emoji-item:checked + label`).textContent;
  //       newComment.date = moment().toDate();
  //
  //       film.comments.push(newComment);
  //       const commentsCount = ++film.commentsCount;
  //       template.querySelector(`.film-details__add-emoji`).checked = false;
  //       commentField.value = ``;
  //       commentsList.innerHTML = ElementBuilder.templateForComments(film);
  //       commentsCountField.innerHTML = commentsCount;
  //       this.notifyFilmUpdated(film);
  //     }
  //   };
  // }

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
