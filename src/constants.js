export const KeyCode = {
  ENTER: 13
};

export const Group = {
  ALL: 0,
  TOP_RATED: 1,
  MOST_COMMENTED: 2
};

export const Rating = {
  low: {
    count: {
      min: 1,
      max: 10
    },
    name: `novice`,
  },
  medium: {
    count: 20,
    name: `fan`,
  },
  high: {
    name: `movie buff`,
  },
};

export const ProviderEventType = {
  COMMENT_ADDED: `comment_added`,
  USER_RATING_CHANGED: `user_rating_changed`,
  WATCHLIST_CHANGED: `watchlist_changed`,
  WATCHED_CHANGED: `watched_changed`,
  FAVORITE_CHANGED: `favorite_changed`
};

export const Message = {
  LOADING: `Loading moovies…`,
  ERROR: `Something went wrong while loading movies. Check your connection or try again later`,
  COMMENT_ADDED: `Comment added`,
  COMMENT_DELETED: `Comment deleted`
};
