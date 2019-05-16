import { VN } from './vnode-base';

export function wrapVN(name, type) {
  if (type === undefined) {
    return function wrapVN_common(attr, children) {
      return VN(name, attr, children);
    };
  }
  else {
    return function wrapVN_astype(attr, children) {
      return VN(name, { ...attr, type: type }, children);
    };
  }
  // return (attr, children) => h(name, attr, children);
}

function html_vnode(attr, children) {
  return VN('html', attr, children);
}

// #region html text elements
html_vnode.h1 = wrapVN('h1');
html_vnode.h2 = wrapVN('h2');
html_vnode.h3 = wrapVN('h3');
html_vnode.h4 = wrapVN('h4');
html_vnode.h5 = wrapVN('h5');
html_vnode.h6 = wrapVN('h6');
html_vnode.p = wrapVN('p');

html_vnode.i = wrapVN('i');
html_vnode.b = wrapVN('b');
html_vnode.u = wrapVN('u');
html_vnode.s = wrapVN('s');
html_vnode.q = wrapVN('q');
html_vnode.pre = wrapVN('pre');
html_vnode.sub = wrapVN('sub');
html_vnode.sup = wrapVN('sup');
html_vnode.wbr = wrapVN('wbr');
html_vnode.blockquote = wrapVN('blockquote');

html_vnode.bdi = wrapVN('bdi');
html_vnode.bdo = wrapVN('bdo');
// #endregion

// #region html semantic text elements
html_vnode.cite = wrapVN('cite');
html_vnode.abbr = wrapVN('abbr');
html_vnode.dfn = wrapVN('dfn');

html_vnode.del = wrapVN('del');
html_vnode.ins = wrapVN('ins');
html_vnode.mark = wrapVN('mark');

html_vnode.time = wrapVN('time');
html_vnode.data = wrapVN('data');
// #endregion

// #region html phrase elements
html_vnode.em = wrapVN('em');
html_vnode.code = wrapVN('code');
html_vnode.strong = wrapVN('strong');
html_vnode.kbd = wrapVN('kbd');
html_vnode.variable = wrapVN('var');
// #endregion

// #region html common elements (non-semantic)
html_vnode.div = wrapVN('div');
html_vnode.span = wrapVN('span');
html_vnode.hr = wrapVN('hr');
// #endregion

// #region html widget elements
html_vnode.progress = wrapVN('progress');
html_vnode.meter = wrapVN('meter');
// #endregion

// #region html semantic layout elements
html_vnode.main = wrapVN('main');
html_vnode.header = wrapVN('header');
html_vnode.nav = wrapVN('nav');
html_vnode.article = wrapVN('article');
html_vnode.section = wrapVN('section');
html_vnode.aside = wrapVN('aside');
html_vnode.footer = wrapVN('footer');

html_vnode.details = wrapVN('details');
html_vnode.summary = wrapVN('summary');

html_vnode.figure = wrapVN('figure');
html_vnode.figcaption = wrapVN('figcaption');
// #endregion

// #region table elements
// note: sort of in order of sequence
html_vnode.table = wrapVN('table');
html_vnode.caption = wrapVN('caption');
html_vnode.colgroup = wrapVN('colgroup');
html_vnode.col = wrapVN('col');

html_vnode.thead = wrapVN('thead');
html_vnode.tbody = wrapVN('tbody');
html_vnode.tfooter = wrapVN('tfooter');

html_vnode.tr = wrapVN('tr');
html_vnode.th = wrapVN('th');
html_vnode.td = wrapVN('td');
// #endregion

// #region html list elements
html_vnode.ul = wrapVN('ul');
html_vnode.ol = wrapVN('ol');
html_vnode.li = wrapVN('li');

html_vnode.dl = wrapVN('dl');
html_vnode.dt = wrapVN('dt');
html_vnode.dd = wrapVN('dd');
// #endregion

// #region html multimedia elements
html_vnode.img = wrapVN('img');
html_vnode.map = wrapVN('map');
html_vnode.area = wrapVN('area');

html_vnode.audio = wrapVN('audio');
html_vnode.picture = wrapVN('picture');
html_vnode.video = wrapVN('video');

html_vnode.source = wrapVN('source');
html_vnode.track = wrapVN('track');

html_vnode.object = wrapVN('object');
html_vnode.param = wrapVN('param');

html_vnode.embed = wrapVN('embed');
// #endregion

// #region simple html form elements
html_vnode.fieldset = wrapVN('fieldset');
html_vnode.legend = wrapVN('legend');

html_vnode.label = wrapVN('label');
html_vnode.output = wrapVN('output');

html_vnode.input = wrapVN('input');
html_vnode.button = wrapVN('button');

html_vnode.datalist = wrapVN('datalist');

html_vnode.select = wrapVN('select');
html_vnode.option = wrapVN('option');
html_vnode.optgroup = wrapVN('optgroup');
// #endregion

// #region html input type elements
html_vnode.defaultInputType = 'text';

function input_vnode(attr, children) {
  return VN('input', attr, children);
}

input_vnode.hidden = wrapVN('input', 'hidden');
input_vnode.submit = wrapVN('input', 'submit');
input_vnode.image = wrapVN('input', 'image');

input_vnode.text = wrapVN('input', 'text');
input_vnode.number = wrapVN('input', 'number');
input_vnode.password = wrapVN('input', 'password');

input_vnode.checkbox = wrapVN('input', 'checkbox');
input_vnode.radio = wrapVN('input', 'radio');


input_vnode.file = wrapVN('input', 'file');

input_vnode.email = wrapVN('input', 'email');
input_vnode.tel = wrapVN('input', 'tel');
input_vnode.url = wrapVN('input', 'url');

input_vnode.range = wrapVN('input', 'range');

input_vnode.color = wrapVN('input', 'color');

input_vnode.date = wrapVN('input', 'date');
input_vnode.datetime_local = wrapVN('input', 'datetime-local');
input_vnode.month = wrapVN('input', 'month');
input_vnode.week = wrapVN('input', 'week');
input_vnode.time = wrapVN('input', 'time');

// #endregion

//#region svg elements

function svg_vnode(attr, children) {
  return VN('svg', attr, children);
}

svg_vnode.a = wrapVN('a');

svg_vnode.animate = wrapVN('animate');
svg_vnode.animateMotion = wrapVN('animateMotion');
svg_vnode.animateTransform = wrapVN('animateTransform');
svg_vnode.circle = wrapVN('circle');
svg_vnode.clipPath = wrapVN('clipPath');
svg_vnode.defs = wrapVN('defs');
svg_vnode.desc = wrapVN('desc');
svg_vnode.discard = wrapVN('discard');
svg_vnode.ellipse = wrapVN('ellipse');

svg_vnode.feBlend = wrapVN('feBlend');
svg_vnode.feColorMatrix = wrapVN('feColorMatrix');
svg_vnode.feComponentTransfer = wrapVN('feComponentTransfer');
svg_vnode.feComposite = wrapVN('feComposite');
svg_vnode.feConvolveMatrix = wrapVN('feConvolveMatrix');
svg_vnode.feDiffuseLighting = wrapVN('feDiffuseLighting');
svg_vnode.feDisplacementMap = wrapVN('feDisplacementMap');
svg_vnode.feDistantLight = wrapVN('feDistantLight');
svg_vnode.feDropShadow = wrapVN('feDropShadow');
svg_vnode.feFlood = wrapVN('feFlood');
svg_vnode.feFuncA = wrapVN('feFuncA');
svg_vnode.feFuncB = wrapVN('feFuncB');
svg_vnode.feFuncG = wrapVN('feFuncG');
svg_vnode.feFuncR = wrapVN('feFuncR');
svg_vnode.feGaussianBlur = wrapVN('feGaussianBlur');
svg_vnode.feImage = wrapVN('feImage');
svg_vnode.feMerge = wrapVN('feMerge');
svg_vnode.feMergeNode = wrapVN('feMergeNode');
svg_vnode.feMorphology = wrapVN('feMorphology');
svg_vnode.feOffset = wrapVN('feOffset');
svg_vnode.fePointLight = wrapVN('fePointLight');
svg_vnode.feSpecularLighting = wrapVN('feSpecularLighting');
svg_vnode.feSpotLight = wrapVN('feSpotLight');
svg_vnode.feTile = wrapVN('feTile');
svg_vnode.feTurbulence = wrapVN('feTurbulence');

svg_vnode.filter = wrapVN('filter');
svg_vnode.foreignObject = wrapVN('foreignObject');
svg_vnode.g = wrapVN('g');
svg_vnode.image = wrapVN('image');
svg_vnode.line = wrapVN('line');
svg_vnode.linearGradient = wrapVN('linearGradient');
svg_vnode.marker = wrapVN('marker');
svg_vnode.mask = wrapVN('mask');
svg_vnode.metadata = wrapVN('metadata');
svg_vnode.mpath = wrapVN('mpath');
svg_vnode.path = wrapVN('path');
svg_vnode.pattern = wrapVN('pattern');
svg_vnode.polygon = wrapVN('polygon');
svg_vnode.polyline = wrapVN('polyline');
svg_vnode.radialGradient = wrapVN('radialGradient');
svg_vnode.rect = wrapVN('rect');
svg_vnode.set = wrapVN('set');
svg_vnode.stop = wrapVN('stop');
svg_vnode.symbol = wrapVN('symbol');
svg_vnode.text = wrapVN('text');
svg_vnode.textPath = wrapVN('textPath');

svg_vnode.title = wrapVN('title');
svg_vnode.tspan = wrapVN('tspan');
svg_vnode.use = wrapVN('use');
svg_vnode.view = wrapVN('view');

//#endregion

export default {
  html: html_vnode,
  form: input_vnode,
  svg: svg_vnode,
};
