import {createElement} from './util.js';

class Film {
  constructor(data) {
    this._title = data.title;
    this._posters = data.posters;
    this._rating = data.rating;
    this._year = data.year;
    this._duration = data.duration;
    this._genre = data.genre;
    this._description = data.description;
    this._comments = data.comments;
    this._onCommentsClick = this._onCommentsClick.bind(this);
    this._element = null;
    this._onClick = null;
  }

  _onCommentsClick(evt) {
    evt.preventDefault();
    //console.log('_onCommentsClick');
    if (typeof this._onClick === `function`) {
      this._onClick();
    }
  }

  set onClick(fn) {
    //console.log('set onClick');
    this._onClick = fn;
  }

  get template() {
    return `
    <article class="film-card">
      <h3 class="film-card__title">${this._title}</h3>
      <p class="film-card__rating">${this._rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${this._year}</span>
        <span class="film-card__duration">${this._duration}</span>
        <span class="film-card__genre">${this._genre}</span>
      </p>
      <img src="./images/posters/${this._posters}" alt="" class="film-card__poster">
      <p class="film-card__description">${this._description}</p>
      <button class="film-card__comments">${this._comments} comments</button>
      <form class="film-card__controls">
        <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist">Add to watchlist</button>
        <button class="film-card__controls-item button film-card__controls-item--mark-as-watched">Mark as watched</button>
        <button class="film-card__controls-item button film-card__controls-item--favorite">Mark as favorite</button>
      </form>
   </article>`.trim();
  }

  bind() {
    //console.log('BIND');
    this._element.querySelector(`.film-card__comments`).addEventListener(`click`, this._onCommentsClick);
  }

  unbind() {
    //console.log('UNBIND');
    this._element.querySelector(`.film-card__comments`).removeEventListener(`click`, this._onCommentsClick);
  }

  render() {
    this._element = createElement(this.template);
    this.bind();
    return this._element;
  }

  unrender() {
    this.unbind();
    this._element = null;
  }
}

export {Film};
