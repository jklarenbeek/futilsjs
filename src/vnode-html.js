/* eslint-disable import/prefer-default-export */
import { h, hwrap } from './vnode';

export const html = function html_vnode(attr, children) {
  return h('html', attr, children);
};

// #region html text elements
html.h1 = hwrap('h1');
html.h2 = hwrap('h2');
html.h3 = hwrap('h3');
html.h4 = hwrap('h4');
html.h5 = hwrap('h5');
html.h6 = hwrap('h6');
html.p = hwrap('p');

html.i = hwrap('i');
html.b = hwrap('b');
html.u = hwrap('u');
html.s = hwrap('s');
html.q = hwrap('q');
html.pre = hwrap('pre');
html.sub = hwrap('sub');
html.sup = hwrap('sup');
html.wbr = hwrap('wbr');
html.blockquote = hwrap('blockquote');

html.bdi = hwrap('bdi');
html.bdo = hwrap('bdo');
// #endregion

// #region html semantic text elements
html.cite = hwrap('cite');
html.abbr = hwrap('abbr');
html.dfn = hwrap('dfn');

html.del = hwrap('del');
html.ins = hwrap('ins');
html.mark = hwrap('mark');

html.time = hwrap('time');
html.data = hwrap('data');
// #endregion

// #region html phrase elements
html.em = hwrap('em');
html.code = hwrap('code');
html.strong = hwrap('strong');
html.kbd = hwrap('kbd');
html.variable = hwrap('var');
// #endregion

// #region html common elements (non-semantic)
html.div = hwrap('div');
html.span = hwrap('span');
html.hr = hwrap('hr');
// #endregion

// #region html widget elements
html.progress = hwrap('progress');
html.meter = hwrap('meter');
// #endregion

// #region html semantic layout elements
html.main = hwrap('main');
html.header = hwrap('header');
html.nav = hwrap('nav');
html.article = hwrap('article');
html.section = hwrap('section');
html.aside = hwrap('aside');
html.footer = hwrap('footer');

html.details = hwrap('details');
html.summary = hwrap('summary');

html.figure = hwrap('figure');
html.figcaption = hwrap('figcaption');
// #endregion

// #region table elements
// note: sort of in order of sequence
html.table = hwrap('table');
html.caption = hwrap('caption');
html.colgroup = hwrap('colgroup');
html.col = hwrap('col');

html.thead = hwrap('thead');
html.tbody = hwrap('tbody');
html.tfooter = hwrap('tfooter');

html.tr = hwrap('tr');
html.th = hwrap('th');
html.td = hwrap('td');
// #endregion

// #region html list elements
html.ul = hwrap('ul');
html.ol = hwrap('ol');
html.li = hwrap('li');

html.dl = hwrap('dl');
html.dt = hwrap('dt');
html.dd = hwrap('dd');
// #endregion

// #region html multimedia elements
html.img = hwrap('img');
html.map = hwrap('map');
html.area = hwrap('area');

html.audio = hwrap('audio');
html.picture = hwrap('picture');
html.video = hwrap('video');

html.source = hwrap('source');
html.track = hwrap('track');

html.object = hwrap('object');
html.param = hwrap('param');

html.embed = hwrap('embed');
// #endregion

// #region simple html form elements
html.fieldset = hwrap('fieldset');
html.legend = hwrap('legend');

html.label = hwrap('label');
html.output = hwrap('output');

html.input = hwrap('input');
html.button = hwrap('button');

html.datalist = hwrap('datalist');

html.select = hwrap('select');
html.option = hwrap('option');
html.optgroup = hwrap('optgroup');
// #endregion

// #region html input type elements
html.defaultInputType = 'text';

export const input = function input_vnode(attr, children) {
  return h('input', attr, children);
};

input.hidden = hwrap('input', 'hidden');
input.submit = hwrap('input', 'submit');
input.image = hwrap('input', 'image');

input.text = hwrap('input', 'text');
input.number = hwrap('input', 'number');
input.password = hwrap('input', 'password');

input.checkbox = hwrap('input', 'checkbox');
input.radio = hwrap('input', 'radio');


input.file = hwrap('input', 'file');

input.email = hwrap('input', 'email');
input.tel = hwrap('input', 'tel');
input.url = hwrap('input', 'url');

input.range = hwrap('input', 'range');

input.color = hwrap('input', 'color');

input.date = hwrap('input', 'date');
input.datetime_local = hwrap('input', 'datetime-local');
input.month = hwrap('input', 'month');
input.week = hwrap('input', 'week');
input.time = hwrap('input', 'time');

// #endregion
