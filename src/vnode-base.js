

import { Array_collapseShallow } from './types-Array';
import { isFn } from './types-base';

export class VNode {
  constructor(name, attributes, children) {
    if (name.constructor !== String) throw new Error('ERROR: new VNode without a nodeName');
    this.nodeName = name;
    this.key = attributes.key;
    this.attributes = attributes;
    this.children = children;
  }
}

export function VN(name, attributes, ...rest) {
  attributes = attributes || {};
  const children = Array_collapseShallow(rest);
  return isFn(name)
    ? name(attributes, children)
    : new VNode(name, attributes, children);
}

export const h = VN;
