/**
 * @example
 *  const fns_all = [ isStrictNumberType_asNumber, isStrictNumberType_asParseFloat ];
 *  const test_stringi = ['12345', '54321', '12358', '85321'];
 *  const test_stringf = ['12.345', '54.321', '12.358', '85.321'];
 *  const test_nan = ['abcde', 'edcba', 'abceh', 'hecba'];
 *  const test_number = [13.234, 21.123, 34.456, 55.223];
 *  const test_integer = [13, 21, 34, 55];
 *  const pref_idx = getPerformanceIndexOfUnaryBool(fns_all, [ test_number, test_integer ]);
 *  const pref_fn = pref_idx >= 0 ? fns_all[pref_idx] : undefined;
 *
 * @param {*} functionList
 * @param {*} testList
 */
export function getPerformanceIndexOfUnaryBool(functionList, testList) {
  let index = -1;
  let start = 0.0;
  let end = 0.0;
  let delta = 0.0;
  // eslint-disable-next-line no-unused-vars
  let tmp = false;

  // eslint-disable-next-line func-names
  let fn = function () { };

  for (let i = 0; i < functionList.length; ++i) {
    fn = functionList[i];
    end = 0.0;
    for (let j = 0; j < testList.length; ++j) {
      const test = testList[j];
      start = performance.now();
      for (let k = 0; k < 1000; ++k) {
        tmp |= fn(test % k);
      }
      end += performance.now() - start;
    }
    end /= testList.length;

    if (delta > end) {
      delta = end;
      index = i;
    }
  }
  return index;
}

export function createPerformanceRun(func, loop, value) {
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

//#region isStrictNumberType

function isStrictNumberType_asType(obj) {
  // eslint-disable-next-line no-restricted-globals
  return obj != null && typeof obj === 'number';
}

function isStrictNumberType_asNaN(obj) {
  // eslint-disable-next-line no-restricted-globals
  return isNaN(obj) === false;
}

function isStrictNumberType_asNumber(obj) {
  return (Number(obj) || false) !== false;
}

function isStrictNumberType_asParseInt(obj) {
  // eslint-disable-next-line radix
  const n = parseInt(obj);
  // eslint-disable-next-line no-self-compare
  return n === n;
}

function isStrictNumberType_asParseFloat(obj) {
  // eslint-disable-next-line radix
  const n = parseFloat(obj);
  // eslint-disable-next-line no-self-compare
  return n === n; // we equal NaN with NaN here.
}

function isStrictNumberType_asMathRound(obj) {
  const n = Math.round(obj);
  // eslint-disable-next-line no-self-compare
  return n === n; // we equal NaN with NaN here.
}

function isStrictNumberType_asCastFloat(obj) {
  // eslint-disable-next-line no-self-compare
  return +obj === +obj; // we equal NaN with NaN here.
}

export const isStrictNumberType = (function calibrate(doit = false) {
  if (!doit) return isStrictNumberType_asNumber;
  const floats = [Math.PI, 13.234, 21.123, 34.456, 55.223];
  const integers = [13, 21, 34, 55, 108];
  const fns = [
    isStrictNumberType_asType,
    isStrictNumberType_asNaN,
    isStrictNumberType_asNumber,
    isStrictNumberType_asParseInt,
    isStrictNumberType_asParseFloat,
    isStrictNumberType_asMathRound,
    isStrictNumberType_asCastFloat,
  ];
  const idx = getPerformanceIndexOfUnaryBool(fns, [floats, integers]);
  return fns[idx];
})(false);

//#endregion
