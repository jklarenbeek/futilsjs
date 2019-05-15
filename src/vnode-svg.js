/* eslint-disable import/prefer-default-export */
import { h, hwrap } from './vnode';

export const svg = function svg_vnode(attr, children) {
  return h('svg', attr, children);
};

svg.a = hwrap('a');

svg.animate = hwrap('animate');
svg.animateMotion = hwrap('animateMotion');
svg.animateTransform = hwrap('animateTransform');
svg.circle = hwrap('circle');
svg.clipPath = hwrap('clipPath');
svg.defs = hwrap('defs');
svg.desc = hwrap('desc');
svg.discard = hwrap('discard');
svg.ellipse = hwrap('ellipse');

svg.feBlend = hwrap('feBlend');
svg.feColorMatrix = hwrap('feColorMatrix');
svg.feComponentTransfer = hwrap('feComponentTransfer');
svg.feComposite = hwrap('feComposite');
svg.feConvolveMatrix = hwrap('feConvolveMatrix');
svg.feDiffuseLighting = hwrap('feDiffuseLighting');
svg.feDisplacementMap = hwrap('feDisplacementMap');
svg.feDistantLight = hwrap('feDistantLight');
svg.feDropShadow = hwrap('feDropShadow');
svg.feFlood = hwrap('feFlood');
svg.feFuncA = hwrap('feFuncA');
svg.feFuncB = hwrap('feFuncB');
svg.feFuncG = hwrap('feFuncG');
svg.feFuncR = hwrap('feFuncR');
svg.feGaussianBlur = hwrap('feGaussianBlur');
svg.feImage = hwrap('feImage');
svg.feMerge = hwrap('feMerge');
svg.feMergeNode = hwrap('feMergeNode');
svg.feMorphology = hwrap('feMorphology');
svg.feOffset = hwrap('feOffset');
svg.fePointLight = hwrap('fePointLight');
svg.feSpecularLighting = hwrap('feSpecularLighting');
svg.feSpotLight = hwrap('feSpotLight');
svg.feTile = hwrap('feTile');
svg.feTurbulence = hwrap('feTurbulence');

svg.filter = hwrap('filter');
svg.foreignObject = hwrap('foreignObject');
svg.g = hwrap('g');
svg.image = hwrap('image');
svg.line = hwrap('line');
svg.linearGradient = hwrap('linearGradient');
svg.marker = hwrap('marker');
svg.mask = hwrap('mask');
svg.metadata = hwrap('metadata');
svg.mpath = hwrap('mpath');
svg.path = hwrap('path');
svg.pattern = hwrap('pattern');
svg.polygon = hwrap('polygon');
svg.polyline = hwrap('polyline');
svg.radialGradient = hwrap('radialGradient');
svg.rect = hwrap('rect');
svg.set = hwrap('set');
svg.stop = hwrap('stop');
svg.symbol = hwrap('symbol');
svg.text = hwrap('text');
svg.textPath = hwrap('textPath');

svg.title = hwrap('title');
svg.tspan = hwrap('tspan');
svg.use = hwrap('use');
svg.view = hwrap('view');
