export class Queue {
  constructor() {
    this.data = [];
  }

  enqueue(element) {
    this.data.push(element);
  }

  dequeue() {
    return this.data.shift();
  }

  front() {
    return this.data[0];
  }

  back() {
    const data = this.data;
    return data[data.length - 1];
  }
}
