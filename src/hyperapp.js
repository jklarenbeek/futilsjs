// Fork of hyperapp version 1 under MIT License
// at https://github.com/JorgeBucaran/hyperapp
// Copyright © Jorge Bucaran < https://jorgebucaran.com>
// on 14/05/2019 at https://github.com/jklarenbeek/futilsjs
// Copyright © Joham <https://jklarenbeek@gmail.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files(the 'Software'), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and / or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
// DEALINGS IN THE SOFTWARE.
//

import { collapseCssClass } from './css';

export class vnode {
  constructor(name, attributes, children) {
    this.key = attributes.key;
    this.attributes = attributes;
    this.nodeName = name;
    this.children = children;
  }
}

export function h(name, attributes = {}, ...rest) {
  // the jsx transpiler sets null on the attributes parameter
  // when no parameter is defined, instead of 'undefined'.
  // therefor the default operator doesn't kick in,
  attributes = attributes || {}; //  and do we need this kind of stuff.

  const children = [];
  let ic = 0;

  const lenx = rest.length;
  let itemx = null;
  let ix = 0;


  let leny = 0;
  let itemy = null;
  let iy = 0;

  // fill the children array with the rest parameters
  while (ix < lenx) {
    itemx = rest[ix];
    ix++;
    if (itemx === undefined || itemx === null || itemx === false || itemx === true) continue;
    if (itemx.pop) {
      // this is an array so fill the children array with the items of this one
      // we do not go any deeper!
      leny = itemx.length;
      iy = 0;
      while (iy < leny) {
        itemy = itemx[iy];
        iy++;
        if (itemy === undefined || itemy === null || itemy === false || itemy === true) continue;
        children[ic++] = itemy;
      }
    }
    else {
      children[ic++] = itemx;
    }
  }

  return typeof name === 'function'
    ? name(attributes, children)
    : new vnode(name, attributes, children);
}

export function _h(name, attributes, ...rest) {
  const children = [];
  let length = arguments.length;

  while (rest.length) {
    const node = rest.pop();
    if (node && node.pop) {
      for (length = node.length; length--;) {
        rest.push(node[length]);
      }
    }
    else if (node != null && node !== true && node !== false) {
      children.push(node);
    }
  }

  attributes = attributes || {};
  return typeof name === 'function'
    ? name(attributes, children)
    : new vnode(name, attributes, children);
}

export function clone(target, source) {
  const out = {};

  for (const t in target) {
    if (target.hasOwnProperty(t)) out[t] = target[t];
  }
  for (const s in source) {
    if (source.hasOwnProperty(s)) out[s] = source[s];
  }
  return out;
}

export function app(state, actions, view, container) {
  const map = [].map;
  let rootElement = (container && container.children[0]) || null;
  let _oldNode = rootElement && recycleElement(rootElement);
  const lifecycle = [];
  let skipRender = false;
  let isRecycling = true;
  let globalState = clone(state);
  const wiredActions = wireStateToActions([], globalState, clone(actions));

  scheduleRender();

  return wiredActions;

  function recycleElement(element) {
    return {
      nodeName: element.nodeName.toLowerCase(),
      attributes: {},
      children: map.call(element.childNodes, function hyperapp_recycleElement(el) {
        return el.nodeType === 3 // Node.TEXT_NODE
          ? el.nodeValue
          : recycleElement(el);
      }),
    };
  }

  function resolveNode(node) {
    if (typeof node === 'function')
      return resolveNode(node(globalState, wiredActions));
    else
      return node || '';
    // : node != null ? node : '';
  }

  function render() {
    skipRender = !skipRender;

    const node = resolveNode(view);

    if (container && !skipRender) {
      rootElement = patch(container, rootElement, _oldNode, node);
      _oldNode = node;
    }

    isRecycling = false;

    while (lifecycle.length) lifecycle.pop()();
  }

  function scheduleRender() {
    if (!skipRender) {
      skipRender = true;
      setTimeout(render);
    }
  }

  function set(path, value, source) {
    const target = {};
    if (path.length) {
      target[path[0]] = path.length > 1
        ? set(path.slice(1), value, source[path[0]])
        : value;
      return clone(source, target);
    }
    return value;
  }

  function get(path, source) {
    let i = 0;
    const l = path.length;
    while (i < l) {
      source = source[path[i++]];
    }
    return source;
  }

  function wireStateToActions(path, myState, myActions) {
    function createActionProxy(key, action) {
      myActions[key] = function actionProxy(data) {
        const slice = get(path, globalState);

        let result = action(data);
        if (typeof result === 'function') {
          result = result(slice, myActions);
        }

        if (result && result !== slice && !result.then) {
          globalState = set(path, clone(slice, result), globalState);
          scheduleRender(globalState);
        }

        return result;
      };
    }

    for (const key in myActions) {
      if (typeof myActions[key] === 'function') {
        createActionProxy(key, myActions[key]);
      }
      else {
        // wire slice/namespace of state to actions
        wireStateToActions(
          path.concat(key),
          (myState[key] = clone(myState[key])),
          (myActions[key] = clone(myActions[key])),
        );
      }
    }

    return myActions;
  }

  function getKey(node) {
    return node ? node.key : null;
  }

  function eventListener(event) {
    return event.currentTarget.events[event.type](event);
  }

  function updateAttribute(element, name, value, oldValue, isSvg) {
    if (name === 'style') {
      if (typeof value === 'string') {
        element.style.cssText = value;
      }
      else {
        if (typeof oldValue === 'string') {
          oldValue = element.style.cssText = '';
        }
        const lval = clone(oldValue, value);
        for (const i in lval) {
          if (lval.hasOwnProperty(i)) {
            const style = (value == null || value[i] == null) ? '' : value[i];
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
    else if (name !== 'key') {
      if (name.indexOf('on') === 0) {
        name = name.slice(2);

        if (element.events) {
          if (!oldValue) oldValue = element.events[name];
        }
        else {
          element.events = {};
        }

        element.events[name] = value;

        if (value) {
          if (!oldValue) {
            element.addEventListener(name, eventListener);
          }
        }
        else {
          element.removeEventListener(name, eventListener);
        }
      }
      else if (value != null && value !== false) {
        if (name === 'class') {
          const cls = collapseCssClass(value);
          if (cls !== '')
            element.className = collapseCssClass(value);
          else
            element.removeAttribute('class');
        }
        else if (name in element
          && name !== 'list'
          && name !== 'type'
          && name !== 'draggable'
          && name !== 'spellcheck'
          && name !== 'translate'
          && !isSvg) {
          element[name] = value == null ? '' : value;
        }
        else {
          element.setAttribute(name, value === true ? '' : value);
        }
      }
      else {
        element.removeAttribute(name);
      }
    }
  }

  // eslint-disable-next-line no-unused-vars
  function updateAttribute1(element, name, value, oldValue, isSvg) {
    if (name !== 'key') {
      if (name === 'style') {
        const lval = clone(oldValue, value);
        for (const i in lval) {
          if (lval.hasOwnProperty(i)) {
            const style = (value == null || value[i] == null) ? '' : value[i];
            if (i[0] === '-') {
              element[name].setProperty(i, style);
            }
            else {
              element[name][i] = style;
            }
          }
        }
      }
      else if (name.indexOf('on') === 0) {
        name = name.slice(2);

        if (element.events) {
          if (!oldValue) oldValue = element.events[name];
        }
        else {
          element.events = {};
        }

        element.events[name] = value;

        if (value) {
          if (!oldValue) {
            element.addEventListener(name, eventListener);
          }
        }
        else {
          element.removeEventListener(name, eventListener);
        }
      }
      else if (name === 'selected' && value != null && value !== false) {
        element.setAttribute('selected', '');
        element.selected = true;
      }
      else if (value && value.length > 0) {
        if (name === 'class') {
          element.className = collapseCssClass(value);
        }
        else if (name in element
          && name !== 'list'
          && name !== 'type'
          && name !== 'draggable'
          && name !== 'spellcheck'
          && name !== 'translate'
          && !isSvg
        ) {
          element[name] = value;
        }
        else {
          element.setAttribute(name, value);
        }
      }
      else {
        element.removeAttribute(name);
      }
    }
  }

  function createElement(node, isSvg) {
    const element = (typeof node === 'string' || typeof node === 'number')
      ? document.createTextNode(node)
      : (isSvg || node.nodeName === 'svg')
        ? document.createElementNS('http://www.w3.org/2000/svg', node.nodeName)
        : document.createElement(node.nodeName);

    const attributes = node.attributes;
    if (attributes) {
      if (attributes.oncreate) {
        lifecycle.push(function hyperapp_createElement_lifecycle() {
          attributes.oncreate(element);
        });
      }

      for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i] = resolveNode(node.children[i]);
        element.appendChild(createElement(child, isSvg));
      }

      for (const name in attributes) {
        if (attributes.hasOwnProperty(name)) {
          const value = attributes[name];
          updateAttribute(element, name, value, null, isSvg);
        }
      }
    }

    return element;
  }

  function updateElement(element, oldAttributes, attributes, isSvg) {
    for (const name in clone(oldAttributes, attributes)) {
      // eslint-disable-next-line operator-linebreak
      if (attributes[name] !==
        (name === 'value' || name === 'checked'
          ? element[name]
          : oldAttributes[name])) {
        updateAttribute(
          element,
          name,
          attributes[name],
          oldAttributes[name],
          isSvg,
        );
      }
    }

    const cb = isRecycling ? attributes.oncreate : attributes.onupdate;
    if (cb) {
      lifecycle.push(function hyperapp_updateElement_lifecycle() {
        cb(element, oldAttributes);
      });
    }
  }

  function removeChildren(element, node) {
    const attributes = node.attributes;
    if (attributes) {
      for (let i = 0; i < node.children.length; i++) {
        removeChildren(element.childNodes[i], node.children[i]);
      }

      if (attributes.ondestroy) {
        attributes.ondestroy(element);
      }
    }
    return element;
  }

  function removeElement(parent, element, node) {
    function done() {
      parent.removeChild(removeChildren(element, node));
    }

    const cb = node.attributes && node.attributes.onremove;
    if (cb) {
      cb(element, done);
    }
    else {
      done();
    }
  }

  function patch(parent, element, oldNode, node, isSvg) {
    if (node !== oldNode) {
      if (oldNode == null || oldNode.nodeName !== node.nodeName) {
        const newElement = createElement(node, isSvg);
        parent.insertBefore(newElement, element);

        if (oldNode != null) {
          removeElement(parent, element, oldNode);
        }

        element = newElement;
      }
      else if (oldNode.nodeName == null) {
        element.nodeValue = node;
      }
      else {
        updateElement(
          element,
          oldNode.attributes,
          node.attributes,
          (isSvg = isSvg || node.nodeName === 'svg'),
        );

        const oldKeyed = {};
        const newKeyed = {};
        const oldElements = [];
        const oldChildren = oldNode.children;
        const children = node.children;

        for (let i = 0; i < oldChildren.length; i++) {
          oldElements[i] = element.childNodes[i];

          const oldKey = getKey(oldChildren[i]);
          if (oldKey != null) {
            oldKeyed[oldKey] = [oldElements[i], oldChildren[i]];
          }
        }

        let i = 0;
        let k = 0;
        const l = children.length;
        while (k < l) {
          const oldKey = getKey(oldChildren[i]);
          const newKey = getKey((children[k] = resolveNode(children[k])));

          if (newKeyed[oldKey]) {
            i++;
            continue;
          }

          if (newKey == null || isRecycling) {
            if (oldKey == null) {
              patch(element, oldElements[i], oldChildren[i], children[k], isSvg);
              k++;
            }
            i++;
          }
          else {
            const keyedNode = oldKeyed[newKey] || [];

            if (oldKey === newKey) {
              patch(element, keyedNode[0], keyedNode[1], children[k], isSvg);
              i++;
            }
            else if (keyedNode[0]) {
              patch(
                element,
                element.insertBefore(keyedNode[0], oldElements[i]),
                keyedNode[1],
                children[k],
                isSvg,
              );
            }
            else {
              patch(element, oldElements[i], null, children[k], isSvg);
            }

            newKeyed[newKey] = children[k];
            k++;
          }
        }

        while (i < oldChildren.length) {
          if (getKey(oldChildren[i]) == null) {
            removeElement(element, oldElements[i], oldChildren[i]);
          }
          i++;
        }

        for (const ik in oldKeyed) {
          if (oldKeyed.hasOwnProperty(ik)) {
            if (!newKeyed[ik]) {
              removeElement(element, oldKeyed[ik][0], oldKeyed[ik][1]);
            }
          }
        }
      }
    }
    return element;
  }
}
