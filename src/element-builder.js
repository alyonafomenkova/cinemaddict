import {createElement, checkExists} from './util.js';
import {getEmoji} from './detailed-film.js';
import moment from 'moment';

class ElementBuilder {
  static templateForSmallFilm(film) {
    return `
    <article class="film-card">
      <h3 class="film-card__title">${film.title}</h3>
      <p class="film-card__rating">${film.totalRating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${moment(film.date).format(`YYYY`)}</span>
        <span class="film-card__duration">${moment.duration(film.duration * 1000 * 60).hours()}:${moment.duration(film.duration * 1000 * 60).minutes()}</span>
        <span class="film-card__genre">${film.genre.join(` `)}</span>
      </p>
      <img src="./${film.poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${film.description}</p>
      <button class="film-card__comments">${film.comments.length} comments</button>
      <form class="film-card__controls">
        <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${film.isOnWatchlist && `film-card__controls-item--active`}">Add to watchlist</button>
        <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${film.isWatched && `film-card__controls-item--active`}">Mark as watched</button>
        <button class="film-card__controls-item button film-card__controls-item--favorite ${film.isFavorite && `film-card__controls-item--active`}">Mark as favorite</button>
      </form>
   </article>`.trim();
  }

  static templateForExtraSmallFilm(film) {
    return `
    <article class="film-card film-card--no-controls">
      <h3 class="film-card__title">${film.title}</h3>
      <p class="film-card__rating">${film.totalRating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${moment(film.date).format(`YYYY`)}</span>
        <span class="film-card__duration">${moment.duration(film.duration).hours()}:${moment.duration(film.duration).minutes()}</span>
        <span class="film-card__genre">${film.genre.join(` `)}</span>
      </p>
      <img src="./${film.poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${film.description}</p>
      <button class="film-card__comments">${film.comments.length} comments</button>
   </article>`.trim();
  }

  static templateForDetailedFilm(film) {
    return `
    <section class="film-details">
    <form class="film-details__inner" action="" method="get">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="./${film.poster}" alt="${film.poster}">

          <p class="film-details__age">${film.restriction}+</p>
        </div>

        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${film.title}</h3>
              <p class="film-details__title-original">Original: ${film.title}</p>
            </div>

            <div class="film-details__rating">
              <p class="film-details__total-rating">${film.totalRating}</p>
              <p class="film-details__user-rating">Your rate <span>${film.userRating}</span></p>
            </div>
          </div>

          <table class="film-details__table">
            <tr class="film-details__row">
              <td class="film-details__term">Director</td>
              <td class="film-details__cell">${film.director}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Writers</td>
              <td class="film-details__cell">${film.writers.join(`, `)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${film.actors}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${moment(film.date).format(`DD MMMM YYYY`)} (${film.country})</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">${Math.floor(moment.duration(film.duration * 1000 * 60).asMinutes())} min</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${film.country}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Genres</td>
              <td class="film-details__cell">
                <span class="film-details__genre">${film.genre.join(` `)}</span>
              </td>
            </tr>
          </table>

          <p class="film-details__film-description">${film.description}</p>
        </div>
      </div>

      <section class="film-details__controls">      
        <input type="checkbox" class="film-details__control-input visually-hidden" id="addwatchlist" name="addwatchlist" ${film.isOnWatchlist && `checked`}>
        <label for="addwatchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

        <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${film.isWatched && `checked`}>
        <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

        <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${film.isFavorite && `checked`}>
        <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
      </section>

      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${film.comments.count}</span></h3>

        <ul class="film-details__comments-list">${this.templateForComments(film)}</ul>

        <div class="film-details__new-comment">
          <div>
            <label for="add-emoji" class="film-details__add-emoji-label">😐</label>
            <input type="checkbox" class="film-details__add-emoji visually-hidden" id="add-emoji">

            <div class="film-details__emoji-list">
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
              <label class="film-details__emoji-label" for="emoji-sleeping">😴</label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-neutral-face" value="neutral-face" checked>
              <label class="film-details__emoji-label" for="emoji-neutral-face">😐</label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-grinning" value="grinning">
              <label class="film-details__emoji-label" for="emoji-grinning">😀</label>
            </div>
          </div>
          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="← Select reaction, add comment here" name="comment"></textarea>
          </label>
        </div>
      </section>

      <section class="film-details__user-rating-wrap">
        <div class="film-details__user-rating-controls">
          <span class="film-details__watched-status film-details__watched-status--active">Already watched</span>
          <button class="film-details__watched-reset" type="button">undo</button>
        </div>

        <div class="film-details__user-score">
          <div class="film-details__user-rating-poster">
            <img src="./${film.poster}" alt="film-poster" class="film-details__user-rating-img">
          </div>

          <section class="film-details__user-rating-inner">
            <h3 class="film-details__user-rating-title">${film.title}</h3>

            <p class="film-details__user-rating-feelings">How you feel it?</p>

            <div class="film-details__user-rating-score">
                <input type="radio" name="score" class="film-details__user-rating-input visually-hidden"
                value="1" id="rating-1" ${film.userRating === 1 && `checked`}>
                <label class="film-details__user-rating-label" for="rating-1">1</label>
                
                <input type="radio" name="score" class="film-details__user-rating-input visually-hidden"
                value="2" id="rating-2" ${film.userRating === 2 && `checked`}>
                <label class="film-details__user-rating-label" for="rating-2">2</label>
                
                <input type="radio" name="score" class="film-details__user-rating-input visually-hidden"
                value="3" id="rating-3" ${film.userRating === 3 && `checked`}>
                <label class="film-details__user-rating-label" for="rating-3">3</label>
                
                <input type="radio" name="score" class="film-details__user-rating-input visually-hidden"
                value="4" id="rating-4" ${film.userRating === 4 && `checked`}>
                <label class="film-details__user-rating-label" for="rating-4">4</label>
                
                <input type="radio" name="score" class="film-details__user-rating-input visually-hidden"
                value="5" id="rating-5" ${film.userRating === 5 && `checked`}>
                <label class="film-details__user-rating-label" for="rating-5">5</label>
                
                <input type="radio" name="score" class="film-details__user-rating-input visually-hidden"
                value="6" id="rating-6" ${film.userRating === 6 && `checked`}>
                <label class="film-details__user-rating-label" for="rating-6">6</label>
                
                <input type="radio" name="score" class="film-details__user-rating-input visually-hidden"
                value="7" id="rating-7" ${film.userRating === 7 && `checked`}>
                <label class="film-details__user-rating-label" for="rating-7">7</label>
                
                <input type="radio" name="score" class="film-details__user-rating-input visually-hidden"
                value="8" id="rating-8" ${film.userRating === 8 && `checked`}>
                <label class="film-details__user-rating-label" for="rating-8">8</label>
                
                <input type="radio" name="score" class="film-details__user-rating-input visually-hidden"
                value="9" id="rating-9" ${film.userRating === 9 && `checked`}>
                <label class="film-details__user-rating-label" for="rating-9">9</label>

            </div>
          </section>
        </div>
      </section>
    </form>
  </section>`.trim();
  }

  static templateForComments(film) {
    return film.comments.map((comment) => `
      <li class="film-details__comment">
        <span class="film-details__comment-emoji">${getEmoji(comment.emotion)}</span>
        <div>
          <p class="film-details__comment-text">${comment.comment}</p>
          <p class="film-details__comment-info">
            <span class="film-details__comment-author">${comment.author}</span>
            <span class="film-details__comment-day">${moment(comment.date).startOf(`min`).fromNow()}</span>
          </p>
        </div>
      </li>`).join(``);
  }

  static templateForFilters(id, name, count, isChecked = false) {
    return `
      <a id=${id} href="#${name.toLowerCase().split(` `).slice(0, 1)}" class="main-navigation__item ${isChecked ? ` main-navigation__item--active` : ``}">
        ${name}
        ${count ? `<span class="main-navigation__item-count">${count}</span>` : ``}
      </a>`.trim();
  }

  static buildSmallFilmElement(film, clickListener) {
    const template = this.templateForSmallFilm(film);
    const element = createElement(template);
    this.setClickListener(element, `.film-card__comments`, clickListener);
    return element;
  }

  static buildDetailedFilmElement(film, clickListener) {
    const template = this.templateForDetailedFilm(film);
    const element = createElement(template);
    this.setClickListener(element, `.film-details__close`, clickListener);
    return element;
  }

  static buildExtraSmallFilmElement(film, clickListener) {
    const template = this.templateForExtraSmallFilm(film);
    const element = createElement(template);
    this.setClickListener(element, `.film-card__comments`, clickListener);
    return element;
  }

  static setClickListener(element, clickableAreaName, clickListener) {
    const clickableArea = element.querySelector(clickableAreaName);
    element.clickableArea = checkExists(clickableArea, `Clickable area '${clickableAreaName}' not found`);
    element.clickableArea.addEventListener(`click`, clickListener);
    element.areaClickListener = clickListener;
  }

  static removeClickListener(element) {
    const clickListener = element.areaClickListener;
    const clickableArea = element.clickableArea;
    checkExists(clickableArea, `Clickable area '${clickableArea}' not found`).removeEventListener(`click`, clickListener);
  }

  static createOverlay() {
    const template = `<div style="position:absolute;opacity:0.5;width:100%;height:100%;top:0;left:0;z-index:2;background:transparent;"></div>`;
    const overlay = createElement(template);
    return overlay;
  }
}

export {ElementBuilder};
