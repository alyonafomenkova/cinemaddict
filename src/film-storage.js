class FilmStorage {

  constructor({key, storage}) {
    this._storeKey = key; // имя ячейки, например, localStorage, в которую он будет записывать данные
    this._storage = storage;
  }

  setItem({key, item}) {
    const items = this.getAll();
    items[key] = item;
    this._storage.setItem(this._storeKey, JSON.stringify(items));
  }

  getItem({key}) {
    const items = this.getAll();
    return items[key];
  }

  removeItem({key}) {
    const items = this.getAll();
    delete items[key];
    this._storage.setItem(this._storeKey, JSON.stringify(items));
  }

  getAll() {
    const emptyItems = {};
    const items = this._storage.getItem(this._storeKey);

    if (!items) {
      return emptyItems;
    }

    try {
      return JSON.parse(items);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`Error parse items. Error: ${error}. Items: ${items}`);
      return emptyItems;
    }
  }
}

export {FilmStorage};
