/* eslint-disable no-undef */
// a dummy function to mimic the CSS-Paint-Api-1 specification
const myRegisteredPaint__store__ = {};
export const myRegisterPaint = typeof registerPaint !== 'undefined'
  ? registerPaint
  : (function myRegisterPaint_initFunction() {
    return function myRegisterPaint_registerPaint__(name, paintClass) {
      if (!myRegisteredPaint__store__.hasOwnProperty(name)) {
        myRegisteredPaint__store__[name] = paintClass;
      }
    };
  })();

export const workletState = Object.freeze(Object.seal({
  init: 0,
  loading: 1,
  preparing: 2,
  running: 3,
  exiting: 4,
  ended: 5,
}));
