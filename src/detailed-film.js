import {ProviderEventType, KeyCode} from "./constants";
import {FilmStorage} from "./film-storage";
import {Provider} from "./provider.js";
import {ElementBuilder} from './element-builder.js';
import {network} from './main.js';
import moment from 'moment';
import {Adapter} from "./adapter";

const setDetailedCardCommentsCount = (count) => {
  const commentsCountField = document.querySelector(`.film-details__comments-count`);
  console.log("setDetailedCardCommentsCount: ", count);
  commentsCountField.innerHTML = count;
};

const updateInputControl = (status, input) => {
  status ? input.checked = true : input.checked = false;
};

const shake = (element) => {
  const ANIMATION_TIMEOUT = 600;
  element.style.animation = `shake ${ANIMATION_TIMEOUT / 1000}s`;

  setTimeout(() => {
    element.style.animation = ``;
  }, ANIMATION_TIMEOUT);
};

function addComment(film) {
  return function () {
    const textInput = document.querySelector(`.film-details__comment-input`);
    const commentsList = document.querySelector(`.film-details__comments-list`);

    if (event.ctrlKey && event.keyCode === KeyCode.ENTER && textInput.value) {
      const provider = Provider.get();
      const newComment = {};
      const emoji = document.querySelector(`.film-details__add-emoji`);
      console.log("emoji: ", emoji);
      newComment.comment = textInput.value;
      newComment.author = `Ivan Inanov`;
      newComment.emotion = document.querySelector(`.film-details__emoji-item:checked`).value;
      newComment.date = moment().toDate();
      textInput.disabled = true;
      textInput.style.border = `none`;
      provider.addComment(film.id, newComment)
        .then((film) => {
          emoji.checked = false;
          commentsList.innerHTML = ElementBuilder.templateForComments(film);
          setDetailedCardCommentsCount(film.comments.length);
          textInput.value = ``;
          textInput.disabled = false;
        })
        .catch((error) => {
          console.log(error);
          textInput.style.border = `5px solid red`;
          shake(textInput);
          textInput.disabled = false;
        });
    }
  };
}

function getEmoji(emo) {
  const emoji = {
    "grinning": `😀`,
    "sleeping": `😴`,
    "neutral": `😐`,
    "neutral-face": `😐`,
  };
  return emoji[emo];
}

function changeEmoji(detailedFilmComponent) {
  return function () {
    const emoji = detailedFilmComponent.querySelector(`.film-details__emoji-item:checked + label`).textContent;
    detailedFilmComponent.querySelector(`.film-details__add-emoji-label`).innerHTML = emoji;
  };
}

function toggleCheckedButton(detailedFilmComponent, targetInput) {
  const buttons = detailedFilmComponent.querySelectorAll(`.film-details__user-rating-label`);
  buttons.forEach((button) => button.style.backgroundColor = `#d8d8d8`);
  targetInput.style.backgroundColor = (`#ffe800`);
}

function changeRating(film, detailedFilmComponent) {
  return function () {
    event.preventDefault();
    const targetButton = event.target;
    const userRatingForm = detailedFilmComponent.querySelector(`.film-details__user-rating-score`);

    userRatingForm.style.pointerEvents = `none`;
    userRatingForm.style.opacity = `0.5`;
    userRatingForm.style.border = `none`;

    Provider.get().updateFilm({id: film.id, data: film})
      .then(() => {
        targetButton.checked = true;
        toggleCheckedButton(detailedFilmComponent, targetButton);
        detailedFilmComponent.querySelector(`.film-details__user-rating span`).innerHTML = targetButton.textContent;
        userRatingForm.style.opacity = `1`;
        userRatingForm.style.pointerEvents = `auto`;
      })
      .catch(() => {
        userRatingForm.style.border = `1px solid red`;
        shake(userRatingForm);
        userRatingForm.style.opacity = `1`;
        userRatingForm.style.pointerEvents = `auto`;
      });
  };
}

function changeWatchlist(film) {
  return function () {
    const storage = FilmStorage.get();
    storage.changeWatchlist(film.id, !film.isOnWatchlist);
  };
}

function changeWatched(film) {
  return function () {
    const storage = FilmStorage.get();
    storage.changeWatched(film.id, !film.isWatched);
  };
}

function changeFavorite(film) {
  return function () {
    const storage = FilmStorage.get();
    storage.changeFavorite(film.id, !film.isFavorite);
  };
}

const observeFilmStorageSmallFilm = (evt, film, detailedFilmComponent) => {
  if (evt.type === ProviderEventType.WATCHLIST_CHANGED && evt.filmId === film.id) {
    const status = Provider.get().getFilm(film.id).isOnWatchlist;
    const watchlistInput = detailedFilmComponent.querySelector(`#addwatchlist`);
    updateInputControl(status, watchlistInput);
  }

  if (evt.type === ProviderEventType.WATCHED_CHANGED && evt.filmId === film.id) {
    const status = Provider.get().getFilm(film.id).isWatched;
    const watchedInput = detailedFilmComponent.querySelector(`#watched`);
    updateInputControl(status, watchedInput);
  }

  if (evt.type === ProviderEventType.FAVORITE_CHANGED && evt.filmId === film.id) {
    const status = Provider.get().getFilm(film.id).isFavorite;
    const favoriteInput = detailedFilmComponent.querySelector(`#favorite`);
    updateInputControl(status, favoriteInput);
  }
};

export {setDetailedCardCommentsCount, getEmoji, addComment, changeEmoji, changeRating, changeWatchlist, changeWatched, changeFavorite, observeFilmStorageSmallFilm};
