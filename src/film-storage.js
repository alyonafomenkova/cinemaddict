import {KeyCode} from "./constants";
import moment from "moment";
import {ElementBuilder} from "./element-builder";

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

  changeEmoji(film) {
    return function () {
      const emoji = film.querySelector(`.film-details__emoji-item:checked + label`).textContent;
      film.querySelector(`.film-details__add-emoji-label`).innerHTML = emoji;
    };
  }

  addComments(film, template) {
    return function () {
      const commentsList = template.querySelector(`.film-details__comments-list`);
      const commentField = template.querySelector(`.film-details__comment-input`);

      if (event.ctrlKey && event.keyCode === KeyCode.ENTER && commentField.value) {
        const newComment = {};
        newComment.text = commentField.value;
        newComment.author = `Ivan Inanov`;
        newComment.emoji = template.querySelector(`.film-details__emoji-item:checked + label`).textContent;
        newComment.date = moment().toDate();

        film.comments.push(newComment);
        film.commentsCount++;
        template.querySelector(`.film-details__add-emoji`).checked = false;
        commentField.value = ``;
        commentsList.innerHTML = ElementBuilder.templateForComments(film);
      }
    };
  }
}

export {FilmStorage};
