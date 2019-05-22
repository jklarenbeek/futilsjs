/* eslint-disable no-extend-native */
const Map_prototype_set = Map.prototype.set;
export function BetterMap_prototype_set(key, value) {
  this._keys = undefined;
  Map_prototype_set.call(this, key, value);
}

export function BetterMap_prototype_getItem(index = 0) {
  if (this._keys === undefined) {
    this._keys = Array.from(this.keys());
  }
  return this.get(this._keys[index | 0]);
}

export function BetterMap_prototype_setItem(index = 0, value) {
  const len = this.size;
  const ret = Map_prototype_set.call(this, this._keys[index | 0], value);
  if (len !== this.size) {
    this._keys = undefined;
  }
  return ret;
}

export function Map_patchPrototype() {
  Map.prototype.set = BetterMap_prototype_set;
  Map.prototype.getItem = BetterMap_prototype_getItem;
  Map.prototype.setItem = BetterMap_prototype_setItem;
}

export class BetterMap extends Map {
  constructor(iterable) {
    super(iterable);
    this._keys = undefined;
  }

  set(key, value) {
    return BetterMap_prototype_set.call(this, key, value);
  }

  getItem(index = 0) {
    return BetterMap_prototype_getItem.call(this, index | 0);
  }

  setItem(index = 0, value) {
    return BetterMap_prototype_setItem.call(this, index | 0, value);
  }
}
