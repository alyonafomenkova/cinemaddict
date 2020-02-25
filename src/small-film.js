const setSmallCardCommentsCount = (filmComponent, count) => {
  const commentsCountField = filmComponent.querySelector(`.film-card__comments`);
  commentsCountField.innerHTML = count + ` comments`;
};

export {setSmallCardCommentsCount};
