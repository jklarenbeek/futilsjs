

import {
  collapseShallowArray,
} from '../types/arrays';

import {
  isFn,
} from '../types/core';

import {
  cloneObject,
} from '../types/objects';

import {
  collapseCssClass,
} from '../browser/css';

const map = Array.prototype.map;

function eventListener(event) {
  return event.currentTarget.events[event.type](event);
}

function removeVNodeChildren(element, vnode) {
  const vattr = vnode.attributes;
  if (vattr) {
    const vcdn = vnode.children;
    for (let i = 0; i < vcdn.length; ++i)
      removeVNodeChildren(element.childNodes[i], vcdn[i]);

    if (vattr.ondestroy)
      vattr.ondestroy(element);
  }
  return element;
}

export class VNode {
  static fromElement(element) {
    if (element == null) return undefined;
    const nodeName = element.nodeName.toLowerCase();
    const children = map.call(element.childNodes, function fromElement_map(el) {
      return el.nodeType === 3 // Node.TEXT_NODE
        ? el.nodeValue
        : VNode.fromElement(el);
    });

    return new VNode(
      nodeName,
      {},
      children,
    );
  }

  static updateDOMAttribute(element, attrName, newValue, oldValue, isSvg) {
    if (attrName === 'key');
    else if (newValue == null || newValue === false)
      element.removeAttribute(attrName);
    else if (attrName === 'style') {
      if (typeof newValue === 'string') {
        element.style.cssText = newValue;
      }
      else {
        if (typeof oldValue === 'string') {
          oldValue = element.style.cssText = '';
        }
        const lval = cloneObject(oldValue, newValue);
        for (const i in lval) {
          if (lval.hasOwnProperty(i)) {
            const style = (newValue == null || newValue[i] == null) ? '' : newValue[i];
            if (i[0] === '-') {
              element.style.setProperty(i, style);
            }
            else {
              element.style[i] = style;
            }
          }
        }
      }
    }
    else if (attrName.indexOf('on') === 0) {
      attrName = attrName.slice(2);

      if (element.events) {
        if (!oldValue) oldValue = element.events[attrName];
      }
      else {
        element.events = {};
      }

      element.events[attrName] = newValue;

      if (newValue) {
        if (!oldValue) {
          element.addEventListener(attrName, eventListener);
        }
      }
      else {
        element.removeEventListener(attrName, eventListener);
      }
    }
    else if (attrName === 'class') {
      const cls = collapseCssClass(newValue);
      if (cls !== '')
        element.className = collapseCssClass(newValue);
      else
        element.removeAttribute('class');
    }
    else if (attrName in element
      && attrName !== 'list'
      && attrName !== 'type'
      && attrName !== 'draggable'
      && attrName !== 'spellcheck'
      && attrName !== 'translate'
      && !isSvg) {
      element[attrName] = newValue == null ? '' : newValue;
    }
    else {
      element.setAttribute(attrName, newValue === true ? '' : newValue);
    }
  }

  static removeElement(parent, element, vnode) {
    function done() {
      parent.removeChild(removeVNodeChildren(element, vnode));
    }

    const cb = vnode.attributes
      && vnode.attributes.onremove;
    if (cb)
      cb(element, done);
    else
      done();
  }

  static getVKey(vnode) {
    return vnode ? vnode.key : undefined;
  }

  constructor(name, attributes, children) {
    if (name.constructor !== String) throw new Error('ERROR: new VNode without a nodeName');
    attributes = attributes || {};
    this.nodeName = name;
    this.key = attributes.key;
    this.attributes = attributes;
    this.children = children;
  }
}

export function VN(name, attributes, ...rest) {
  attributes = attributes || {};
  const children = collapseShallowArray(rest);
  return isFn(name)
    ? name(attributes, children)
    : new VNode(name, attributes, children);
}

export const h = VN;
