export class DataStore extends Map {
  constructor() {
    super();
  }

  get(key) {
    if (!key)   throw new Error('No key provided to DataStore.set()');
    return super.get(key)
  }
  set(key, value) {
    if (!key)   throw new Error('No key provided to DataStore.set()');
    if (!value) throw new Error('No value provided to DataStore.set()');
    super.set(key, value);
    return this;
  }
}