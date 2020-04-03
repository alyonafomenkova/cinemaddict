import {ProviderEventType, KeyCode, Message} from './constants';
import {setSmallCardCommentsCount} from './small-film';
import {Provider} from './provider.js';
import {ElementBuilder} from './element-builder.js';
import moment from 'moment';

const setDetailedCardCommentsCount = (count) => {
  const commentsCountField = document.querySelector(`.film-details__comments-count`);
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

export const hideCommentControls = (detailedFilmComponent) => {
  const statusUserControl = detailedFilmComponent.querySelector(`.film-details__watched-status`);
  const undoCommentButton = detailedFilmComponent.querySelector(`.film-details__watched-reset`);
  statusUserControl.innerHTML = ``;
  undoCommentButton.classList.add(`visually-hidden`);
};

const addComment = (film) => {
  return function () {
    const textInput = document.querySelector(`.film-details__comment-input`);
    const commentsList = document.querySelector(`.film-details__comments-list`);

    if (event.ctrlKey && event.keyCode === KeyCode.ENTER && textInput.value) {
      const statusUserControl = document.querySelector(`.film-details__watched-status`);
      const undoCommentButton = document.querySelector(`.film-details__watched-reset`);
      const provider = Provider.get();
      const newComment = {};
      const emoji = document.querySelector(`.film-details__add-emoji`);
      newComment.comment = textInput.value;
      newComment.author = `Ivan Inanov`;
      newComment.emotion = document.querySelector(`.film-details__emoji-item:checked`).value;
      newComment.date = moment().toDate();
      textInput.disabled = true;
      textInput.style.border = `none`;
      provider.addComment(film.id, newComment)
      // eslint-disable-next-line no-shadow
        .then((film) => {
          emoji.checked = false;
          commentsList.innerHTML = ElementBuilder.templateForComments(film);
          setDetailedCardCommentsCount(film.comments.length);
          textInput.value = ``;
          textInput.disabled = false;
          statusUserControl.innerHTML = Message.COMMENT_ADDED;
          undoCommentButton.classList.remove(`visually-hidden`);
          undoCommentButton.addEventListener(`click`, deleteLastComment(film, statusUserControl));
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.log(error);
          textInput.style.border = `5px solid red`;
          shake(textInput);
          textInput.disabled = false;
        });
    }
  };
};

const deleteLastComment = (film, statusUserControl) => {
  return function () {
    const commentsList = document.querySelector(`.film-details__comments-list`);
    const undoCommentButton = document.querySelector(`.film-details__watched-reset`);
    film.comments.pop();
    Provider.get().updateFilm({id: film.id, data: film})
      .then(() => {
        commentsList.innerHTML = ElementBuilder.templateForComments(film);
        setDetailedCardCommentsCount(film.comments.length);
        setSmallCardCommentsCount(film, film.comments.length);
        statusUserControl.innerHTML = Message.COMMENT_DELETED;
        undoCommentButton.classList.add(`visually-hidden`);
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log(error);
      });
  };
};

const getEmoji = (emo) => {
  const emoji = {
    "grinning": `😀`,
    "sleeping": `😴`,
    "neutral": `😐`,
    "neutral-face": `😐`,
  };
  return emoji[emo];
};

const changeEmoji = (detailedFilmComponent) => {
  return function () {
    const emoji = detailedFilmComponent.querySelector(`.film-details__emoji-item:checked + label`).textContent;
    detailedFilmComponent.querySelector(`.film-details__add-emoji-label`).innerHTML = emoji;
  };
};

const toggleCheckedButton = (detailedFilmComponent, targetInput) => {
  const buttons = detailedFilmComponent.querySelectorAll(`.film-details__user-rating-label`);
  buttons.forEach((button) => button.style.backgroundColor = `#d8d8d8`);
  targetInput.style.backgroundColor = (`#ffe800`);
};

const changeRating = (film, detailedFilmComponent) => {
  return function () {
    event.preventDefault();
    const targetButton = event.target;
    const userRating = targetButton.textContent;
    const userRatingForm = detailedFilmComponent.querySelector(`.film-details__user-rating-score`);

    userRatingForm.style.pointerEvents = `none`;
    userRatingForm.style.opacity = `0.5`;
    userRatingForm.style.border = `none`;

    Provider.get().changeUserRating(film.id, userRating)
      .then(() => {
        targetButton.checked = true;
        toggleCheckedButton(detailedFilmComponent, targetButton);
        detailedFilmComponent.querySelector(`.film-details__user-rating span`).innerHTML = targetButton.textContent;
        userRatingForm.style.opacity = `1`;
        userRatingForm.style.pointerEvents = `auto`;
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log(error);
        userRatingForm.style.border = `1px solid red`;
        shake(userRatingForm);
        userRatingForm.style.opacity = `1`;
        userRatingForm.style.pointerEvents = `auto`;
      });
  };
};

const changeWatchlist = (film) => {
  return function () {
    Provider.get().changeWatchlist(film.id);
  };
};

const changeWatched = (film) => {
  return function () {
    Provider.get().changeWatched(film.id);
  };
};

const changeFavorite = (film) => {
  return function () {
    Provider.get().changeFavorite(film.id);
  };
};

const observeProviderSmallFilm = (evt, film, detailedFilmComponent) => {
  if (evt.type === ProviderEventType.WATCHLIST_CHANGED && evt.filmId === film.id) {
    const status = evt.isOnWatchlist;
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

export {setDetailedCardCommentsCount, getEmoji, addComment, changeEmoji, changeRating, changeWatchlist, changeWatched, changeFavorite, observeProviderSmallFilm};
