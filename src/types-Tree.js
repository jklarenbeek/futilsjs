import { Queue } from './type-Queue.js';

export function Tree_traverseDF(currentNode, callback) {
  const children = currentNode.children;
  const len = children.length;
  let i = 0;
  let child = null;
  for (i = 0; i < len; ++i) {
    child = children[i];
    JSONPointer_traverseDF(child, callback);
  }
  callback(currentNode);
}

export function Tree_traverseBF(currentNode, callback) {
  const queue = new Queue();
  queue.enqueue(currentNode);

  let children = null;
  let len = 0;
  let i = 0;
  let child = null;

  currentNode = queue.dequeue();
  while (currentNode) {
    children = currentNode.children;
    len = children.length;
    for (i = 0; i < len; i++) {
      child = children[i];
      queue.enqueue(child);
    }

    callback(currentNode);
    currentNode = queue.dequeue();
  }
}

export function Tree_findIndex(arr, data) {
  let index = -1;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].data === data) {
      index = i;
    }
  }
  return index;
}

export class TreeNode {
  constructor(data) {
    this.data = data;
    this.parent = null;
    this.children = [];
  }
}

export class Tree {
  constructor(data) {
    this.root = new TreeNode(data);
  }

  contains(callback, traversal = Tree_traverseBF) {
    traversal(this.root, callback);
  }

  add(data, toParent, traversal = Tree_traverseBF) {
    const child = new TreeNode(data);
    let parent = null;
    const callback = function(node) {
      if (node.data === toParent) {
        parent = node;
      }
    };

    this.contains(callback, traversal);

    if (parent) {
      parent.children.push(child);
      child.parent = parent;
    } else {
      throw new Error('Cannot add node to a non-existent parent.');
    }
  }

  remove(data, fromParent, traversal) {
    const tree = this;
    let parent = null;
    let childToRemove = null;
    let index = 0;

    const callback = function(node) {
      if (node.data === fromParent) {
        parent = node;
      }
    };

    this.contains(callback, traversal);

    if (parent) {
      index = Tree_findIndex(parent.children, data);

      if (index === -1) {
        throw new Error('Node to remove does not exist.');
      } else {
        childToRemove = parent.children.splice(index, 1);
      }
    } else {
      throw new Error('Parent does not exist.');
    }

    return childToRemove;
  }
}
