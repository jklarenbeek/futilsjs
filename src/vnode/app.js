/* eslint-disable object-shorthand */
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
import { cloneObject } from '../types/objects';
import { VNode } from './base';
import { isFn } from '../types/core';

function Path_getValue(path, source) {
  let i = 0;
  const l = path.length;
  while (i < l) {
    source = source[path[i++]];
  }
  return source;
}

function Path_setValue(path, value, source) {
  const target = {};
  if (path.length) {
    target[path[0]] = path.length > 1
      ? Path_setValue(path.slice(1), value, source[path[0]])
      : value;
    return cloneObject(source, target);
  }
  return value;
}

export function app(state, actions, view, container) {
  let rootElement = (container && container.children[0]) || null;
  let _oldNode = VNode.fromElement(rootElement);
  const lifecycle = [];
  let skipRender = false;
  let isRecycling = true;
  let globalState = cloneObject(state);
  const wiredActions = wireStateToActions([], globalState, cloneObject(actions));

  scheduleRender();

  return wiredActions;

  function resolveNode(node) {
    if (isFn(node))
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

  function wireStateToActions(path, myState, myActions) {
    // action proxy for each action in myActions.
    function createActionProxy(action) {
      return function actionProxy(data) {
        const slice = Path_getValue(path, globalState);

        let result = action(data);
        if (isFn(result)) {
          result = result(slice, myActions);
        }

        if (result && result !== slice && !result.then) {
          globalState = Path_setValue(
            path,
            cloneObject(slice, result),
            globalState,
          );
          scheduleRender(globalState);
        }

        return result;
      };
    }

    // eslint-disable-next-line guard-for-in
    for (const key in myActions) {
      const act = myActions[key];
      if (isFn(act)) {
        myActions[key] = createActionProxy(act);
      }
      else {
        // wire slice/namespace of state to actions
        wireStateToActions(
          path.concat(key),
          (myState[key] = cloneObject(myState[key])),
          (myActions[key] = cloneObject(myActions[key])),
        );
      }
    }

    return myActions;
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
        lifecycle.push(function hyperapp_lifecycle_createElement() {
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
          VNode.updateDOMAttribute(element, name, value, null, isSvg);
        }
      }
    }

    return element;
  }

  function updateElement(element, oldAttributes, attributes, isSvg) {
    for (const name in cloneObject(oldAttributes, attributes)) {
      // eslint-disable-next-line operator-linebreak
      if (attributes[name] !==
        (name === 'value' || name === 'checked'
          ? element[name]
          : oldAttributes[name])) {
        VNode.updateDOMAttribute(
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

  function patch(parent, element, oldNode, node, isSvg) {
    if (node !== oldNode) {
      if (oldNode == null || oldNode.nodeName !== node.nodeName) {
        const newElement = createElement(node, isSvg);
        parent.insertBefore(newElement, element);

        if (oldNode != null) {
          VNode.removeElement(parent, element, oldNode);
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

          const oldKey = VNode.getVKey(oldChildren[i]);
          if (oldKey != null) {
            oldKeyed[oldKey] = [oldElements[i], oldChildren[i]];
          }
        }

        let i = 0;
        let k = 0;
        const l = children.length;
        while (k < l) {
          const oldKey = VNode.getVKey(oldChildren[i]);
          const newKey = VNode.getVKey((children[k] = resolveNode(children[k])));

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
          if (VNode.getVKey(oldChildren[i]) == null) {
            VNode.removeElement(element, oldElements[i], oldChildren[i]);
          }
          i++;
        }

        for (const ik in oldKeyed) {
          if (oldKeyed.hasOwnProperty(ik)) {
            if (!newKeyed[ik]) {
              VNode.removeElement(element, oldKeyed[ik][0], oldKeyed[ik][1]);
            }
          }
        }
      }
    }
    return element;
  }
}
