/* eslint-disable import/prefer-default-export */

export function createRun(func, loop, value) {
  func(value); // warm-up
  return function run() {
    const startTime = performance.now();
    for (let i = 0; i < loop; i++) {
      func(value);
    }
    const endTime = performance.now();
    return ((endTime - startTime) / loop).toFixed(4);
  };
}
