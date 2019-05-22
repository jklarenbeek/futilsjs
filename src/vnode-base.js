

import { Array_collapseShallow } from './object-Array';

export class VNode {
  constructor(name, attributes, children) {
    this.key = attributes.key;
    this.attributes = attributes;
    if (name.constructor !== String) throw new Error('ERROR: new VNode without a nodeName');
    this.nodeName = name;
    this.children = children;
  }
}

export function VN(name, attributes, ...rest) {
  attributes = attributes || {};
  const children = Array_collapseShallow(rest);
  return typeof name === 'function'
    ? name(attributes, children)
    : new VNode(name, attributes, children);
}

export const h = VN;
