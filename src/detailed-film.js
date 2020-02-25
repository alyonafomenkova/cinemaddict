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

export {setDetailedCardCommentsCount, addComment, changeEmoji};
