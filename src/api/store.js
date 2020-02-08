export default class Store {
  constructor(key, storage) {
    this._storeKey = key;
    this._storage = storage;
  }

  getAll() {
    try {
      return JSON.parse(this._storage.getItem(this._storeKey));
    } catch (err) {
      return {};
    }
  }

  dropAll() {}

  setItem(key, value) {
    const store = this.getAll();

    this._storage.setItem(
        this._storeKey,
        JSON.stringify(
            Object.assign({}, store, {[key]: value})
        )
    );
  }

  setCommentItem(key, value) {
    const store = this.getAll();
    const newComment = store[key][`comments`].push(value);

    this._storage.setItem(
        this._storeKey,
        JSON.stringify(
            Object.assign({}, store, newComment)
        )
    );
  }

  removeItem(key) {
    const store = this.getAll();

    delete store[key];

    this._storage.setItem(
        this._storeKey,
        JSON.stringify(
            Object.assign({}, store)
        )
    );
  }
}
