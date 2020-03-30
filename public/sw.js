const CACHE_NAME = `CINEMADDICT`;

self.addEventListener(`install`, (evt) => {
  console.log(`sw, install`, {evt});
  evt.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll([
          `/`,
          `/index.html`,
          `/bundle.js`,
          `./css/normalize.css`,
          `./css/main.css`,
          `./images/posters/accused.jpg`,
          `./images/posters/blackmail.jpg`,
          `./images/posters/blue-blazes.jpg`,
          `./images/posters/fuga-da-new-york.jpg`,
          `./images/posters/moonrise.jpg`,
          `./images/posters/three-friends.jpg`,
          `./images/background.png`,
          `./images/icon-favorite.png`,
          `./images/icon-watched.png`,
          `./images/icon-watchlist.png`
        ])
      })
      .catch((error) => console.log(error))
  );
});

self.addEventListener(`activate`, (evt) => {
  console.log(`sw, activate`, {evt});
});
