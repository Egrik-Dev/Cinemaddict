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

  setItem(key, value) {
    const store = this.getAll();

    if (store !== null && store[key]) {
      const comments = store[key][`comments`];
      value.comments = comments;
    }

    this._storage.setItem(
        this._storeKey,
        JSON.stringify(
            Object.assign({}, store, {[key]: value})
        )
    );
  }

  setComments(key, value) {
    const store = this.getAll();
    store[key][`comments`] = value;

    this._storage.setItem(
        this._storeKey,
        JSON.stringify(
            Object.assign({}, store)
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

  removeComment(key, value) {
    const store = this.getAll();

    const indexComment = store[key][`comments`].findIndex((comment) => comment.id === value);
    store[key][`comments`][indexComment][`state`] = `deleted`;

    this._storage.setItem(
        this._storeKey,
        JSON.stringify(
            Object.assign({}, store)
        )
    );
  }

  getComments(key) {
    const store = this.getAll();
    return store[key][`comments`];
  }
}
