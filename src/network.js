import {Adapter} from './adapter.js';

const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

const ResponseStatus = {
  OK: 200,
  REDIRECTION: 300
};

const Resource = {
  MOVIES: `movies`,
};

const checkStatus = (response) => {
  if (response.status >= ResponseStatus.OK && response.status < ResponseStatus.REDIRECTION) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

const toJSON = (response) => {
  return response.json();
};

class Network {
  constructor({endPoint, authorization}) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getFilms() {
    return this._load({url: Resource.MOVIES})
      .then(toJSON)
      .then(Adapter.parseFilms);
  }

  createFilm({film}) {
    return this._load({
      url: Resource.MOVIES,
      method: Method.POST,
      body: JSON.stringify(film),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then(toJSON)
      .then(Adapter.parseFilms);
  }

  updateFilm({id, data}) {
    return this._load({
      url: `movies/${id}`,
      method: Method.PUT,
      body: JSON.stringify(data),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then(toJSON)
      .then(Adapter.parseFilms);
  }

  deleteFilm({id}) {
    return this._load({url: `movies/${id}`, method: Method.DELETE});
  }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((err) => {
        console.error(`fetch error: ${err}`);
        throw err;
      });
  }
}

export {Network};
