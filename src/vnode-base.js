

import { collapseArrayShallow } from './object';

export class vnode {
  constructor(name, attributes, children) {
    this.key = attributes.key;
    this.attributes = attributes;
    this.nodeName = name;
    this.children = children;
  }
}

export function VN(name, attributes, ...rest) {
  attributes = attributes || {};
  const children = collapseArrayShallow(rest);
  return typeof name === 'function'
    ? name(attributes, children)
    : new vnode(name, attributes, children);
}

export const h = VN;
