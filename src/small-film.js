const setSmallCardCommentsCount = (filmComponent, count) => {
  const commentsCountField = filmComponent.querySelector(`.film-card__comments`);
  commentsCountField.innerHTML = count + ` comments`;
};

const updateWatchlist = (filmComponent, status) => {
  const watchlistBtn = filmComponent.querySelector(`.film-card__controls-item--add-to-watchlist`);
  if (status) {
    watchlistBtn.classList.add(`film-card__controls-item--active`);
  } else {
    watchlistBtn.classList.remove(`film-card__controls-item--active`);
  }
};

export {setSmallCardCommentsCount, updateWatchlist};
