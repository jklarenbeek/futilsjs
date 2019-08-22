/* eslint-disable class-methods-use-this */

export function createStorageCache() {
  const cache = {};
  class StorageCache {
    getCache(key) {
      if (!cache[key]) {
        cache[key] = localStorage[key];
      }
      return cache[key];
    }

    setCache(key, value) {
      cache[key] = value;
    }

    syncCache() {
      const keys = Object.keys(cache);
      for (let i = 0; i < keys.length; ++i) {
        const key = keys[i];
        localStorage[key] = cache[key];
      }
    }
  }
  return StorageCache;
}
