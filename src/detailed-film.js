import {KeyCode} from "./constants";
import {FilmStorage} from "./film-storage";
import {ElementBuilder} from './element-builder.js';
import moment from 'moment';

const setDetailedCardCommentsCount = (count) => {
  const commentsCountField = document.querySelector(`.film-details__comments-count`);
  commentsCountField.innerHTML = count;
};

function addComment(film) {
  return function () {
    const textInput = document.querySelector(`.film-details__comment-input`);
    const commentsList = document.querySelector(`.film-details__comments-list`);

    if (event.ctrlKey && event.keyCode === KeyCode.ENTER && textInput.value) {
      const storage = FilmStorage.get();
      const newComment = {};
      newComment.text = textInput.value;
      newComment.author = `Ivan Inanov`;
      newComment.emoji = document.querySelector(`.film-details__emoji-item:checked + label`).textContent;
      newComment.date = moment().toDate();
      storage.addComment(film.id, newComment);
      const comments = storage.getFilm(film.id).comments;
      document.querySelector(`.film-details__add-emoji`).checked = false;
      commentsList.innerHTML = ElementBuilder.templateForComments(film);
      setDetailedCardCommentsCount(comments.length);
      textInput.value = ``;
    }
  };
}

function changeEmoji(detailedFilmComponent) {
  return function () {
    const emoji = detailedFilmComponent.querySelector(`.film-details__emoji-item:checked + label`).textContent;
    detailedFilmComponent.querySelector(`.film-details__add-emoji-label`).innerHTML = emoji;
  };
}

function changeRating(detailedFilmComponent) {
  return function () {
    const userRating = detailedFilmComponent.querySelector(`.film-details__user-rating-input:checked`).value;
    detailedFilmComponent.querySelector(`.film-details__user-rating span`).innerHTML = userRating;
  };
}

function changeWatchlist(film) {
  return function () {
    console.log("[DETAILED_FILM] changeWatchlist");
    const storage = FilmStorage.get();
    storage.changeWatchlist(film.id, !film.isOnWatchlist);
  };
}

function changeWatched(film) {
  return function () {
    console.log("[DETAILED_FILM] changeWatched");
    const storage = FilmStorage.get();
    storage.changeWatched(film.id, !film.isWatched);
  };
}

function changeFavorite(film) {
  return function () {
    console.log("[DETAILED_FILM] changeFavorite");
    const storage = FilmStorage.get();
    storage.changeFavorite(film.id, !film.isFavorite);
  };
}

export {setDetailedCardCommentsCount, addComment, changeEmoji, changeRating, changeWatchlist, changeWatched, changeFavorite};
