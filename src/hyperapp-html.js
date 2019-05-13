import { h } from './hyperapp';

// #region html text elements
export const h1 = (attr, children) => h('h1', attr, children);
export const h2 = (attr, children) => h('h2', attr, children);
export const h3 = (attr, children) => h('h3', attr, children);
export const h4 = (attr, children) => h('h4', attr, children);
export const h5 = (attr, children) => h('h5', attr, children);
export const h6 = (attr, children) => h('h6', attr, children);
export const p = (attr, children) => h('p', attr, children);

export const i = (attr, children) => h('i', attr, children);
export const b = (attr, children) => h('b', attr, children);
export const u = (attr, children) => h('u', attr, children);
export const s = (attr, children) => h('s', attr, children);
export const q = (attr, children) => h('q', attr, children);
export const pre = (attr, children) => h('pre', attr, children);
export const sub = (attr, children) => h('sub', attr, children);
export const sup = (attr, children) => h('sup', attr, children);
export const wbr = (attr, children) => h('wbr', attr, children);
export const blockquote = (attr, children) => h('blockquote', attr, children);

export const bdi = (attr, children) => h('bdi', attr, children);
export const bdo = (attr, children) => h('bdo', attr, children);
// #endregion

// #region html semantic text elements
export const cite = (attr, children) => h('cite', attr, children);
export const abbr = (attr, children) => h('abbr', attr, children);
export const dfn = (attr, children) => h('dfn', attr, children);

export const del = (attr, children) => h('del', attr, children);
export const ins = (attr, children) => h('ins', attr, children);
export const mark = (attr, children) => h('mark', attr, children);

export const time = (attr, children) => h('time', attr, children);
export const data = (attr, children) => h('data', attr, children);
// #endregion

// #region html phrase elements
export const em = (attr, children) => h('em', attr, children);
export const code = (attr, children) => h('code', attr, children);
export const strong = (attr, children) => h('strong', attr, children);
export const kbd = (attr, children) => h('kbd', attr, children);
export const variable = (attr, children) => h('var', attr, children);
// #endregion

// #region html common elements (non-semantic)
export const div = (attr, children) => h('div', attr, children);
export const span = (attr, children) => h('span', attr, children);
export const hr = (attr, children) => h('hr', attr, children);
// #endregion

// #region html widget elements
export const progress = (attr, children) => h('progress', attr, children);
export const meter = (attr, children) => h('meter', attr, children);
// #endregion

// #region html semantic layout elements
export const main = (attr, children) => h('main', attr, children);
export const header = (attr, children) => h('header', attr, children);
export const nav = (attr, children) => h('nav', attr, children);
export const article = (attr, children) => h('article', attr, children);
export const section = (attr, children) => h('section', attr, children);
export const aside = (attr, children) => h('aside', attr, children);
export const footer = (attr, children) => h('footer', attr, children);

export const details = (attr, children) => h('details', attr, children);
export const summary = (attr, children) => h('summary', attr, children);

export const figure = (attr, children) => h('figure', attr, children);
export const figcaption = (attr, children) => h('figcaption', attr, children);
// #endregion

// #region table elements
// note: sort of in order of sequence
export const table = (attr, children) => h('table', attr, children);
export const caption = (attr, children) => h('caption', attr, children);
export const colgroup = (attr, children) => h('colgroup', attr, children);
export const col = (attr, children) => h('col', attr, children);

export const thead = (attr, children) => h('thead', attr, children);
export const tbody = (attr, children) => h('tbody', attr, children);
export const tfooter = (attr, children) => h('tfooter', attr, children);

export const tr = (attr, children) => h('tr', attr, children);
export const th = (attr, children) => h('th', attr, children);
export const td = (attr, children) => h('td', attr, children);
// #endregion

// #region html list elements
export const ul = (attr, children) => h('ul', attr, children);
export const ol = (attr, children) => h('ol', attr, children);
export const li = (attr, children) => h('li', attr, children);

export const dl = (attr, children) => h('dl', attr, children);
export const dt = (attr, children) => h('dt', attr, children);
export const dd = (attr, children) => h('dd', attr, children);
// #endregion

// #region html multimedia elements
export const img = (attr, children) => h('img', attr, children);
export const map = (attr, children) => h('map', attr, children);
export const area = (attr, children) => h('area', attr, children);

export const audio = (attr, children) => h('audio', attr, children);
export const picture = (attr, children) => h('picture', attr, children);
export const video = (attr, children) => h('video', attr, children);

export const source = (attr, children) => h('source', attr, children);
export const track = (attr, children) => h('track', attr, children);

export const object = (attr, children) => h('object', attr, children);
export const param = (attr, children) => h('param', attr, children);

export const embed = (attr, children) => h('embed', attr, children);
// #endregion

// #region simple html form elements
export const fieldset = (attr, children) => h('fieldset', attr, children);
export const legend = (attr, children) => h('legend', attr, children);

export const label = (attr, children) => h('label', attr, children);
export const output = (attr, children) => h('output', attr, children);

export const input = (attr, children) => h('input', attr, children);
export const button = (attr, children) => h('button', attr, children);

export const datalist = (attr, children) => h('datalist', attr, children);

export const select = (attr, children) => h('select', attr, children);
export const option = (attr, children) => h('option', attr, children);
export const optgroup = (attr, children) => h('optgroup', attr, children);
// #endregion

// #region html input type elements
export const defaultInputType = 'text';
export const inputTypes = {
  hidden: (attr, children) => h('input', { ...attr, type: 'hidden' }, children),
  submit: (attr, children) => h('input', { ...attr, type: 'submit' }, children),
  image: (attr, children) => h('input', { ...attr, type: 'image' }, children),

  text: (attr, children) => h('input', { ...attr, type: 'text' }, children),
  number: (attr, children) => h('input', { ...attr, type: 'number' }, children),
  password: (attr, children) => h('input', { ...attr, type: 'password' }, children),

  checkbox: (attr, children) => h('input', { ...attr, type: 'checkbox' }, children),
  radio: (attr, children) => h('input', { ...attr, type: 'radio' }, children),


  file: (attr, children) => h('input', { ...attr, type: 'file' }, children),

  email: (attr, children) => h('input', { ...attr, type: 'email' }, children),
  tel: (attr, children) => h('input', { ...attr, type: 'tel' }, children),
  url: (attr, children) => h('input', { ...attr, type: 'url' }, children),

  range: (attr, children) => h('input', { ...attr, type: 'range' }, children),

  color: (attr, children) => h('input', { ...attr, type: 'color' }, children),

  date: (attr, children) => h('input', { ...attr, type: 'date' }, children),
  'datetime-local': (attr, children) => h('input', { ...attr, type: 'datetime-local' }, children),
  month: (attr, children) => h('input', { ...attr, type: 'month' }, children),
  week: (attr, children) => h('input', { ...attr, type: 'week' }, children),
  time: (attr, children) => h('input', { ...attr, type: 'time' }, children),
};

// #endregion
