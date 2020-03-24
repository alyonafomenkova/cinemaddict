const KeyCode = {
  ENTER: 13
};

const FilmStorageEventType = {
  COMMENT_ADDED: `comment_added`,
  USER_RATING_CHANGED: `user_rating_changed`,
  WATCHLIST_CHANGED: `watchlist_changed`,
  WATCHED_CHANGED: `watched_changed`,
  FAVORITE_CHANGED: `favorite_changed`
};

const Message = {
  LOADING: `Loading moovies…`,
  ERROR: `Something went wrong while loading movies. Check your connection or try again later`,
  FILTER: `Maybe at firs you'll add some films to this list?`,
  SEARCH: `Unable to find ani movies on your request`,
};

export {KeyCode, FilmStorageEventType, Message};
