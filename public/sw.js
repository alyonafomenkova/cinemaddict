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
          `./css/*`
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

self.addEventListener(`fetch`, (evt) => {
  console.log(`sw, fetch`, {evt, request: evt.request});
  evt.respondWith(
    caches.match(evt.request)
      .then((response) => {
        console.log("Find in cache: ", response);
          return fetch(evt.request)
            .then(function(response) {
              caches.open(CACHE_NAME)
                .then((cache) => cache.put(evt.request, response.clone()));
              return response.clone();
            })
            .catch(() => {
              caches.match();
            })
      })
      .catch((err) => console.error({err}))
  );
});
