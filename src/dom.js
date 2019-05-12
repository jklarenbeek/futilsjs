
export function copyAttributes(src, dst) {
  if (src.hasAttributes()) {
    const attr = src.attributes;
    const l = attr.length;
    for (let i = 0; i < l; ++i) {
      dst.setAttribute(attr[i].name, attr[i].value);
    }
  }
}

// a dummy function to mimic the CSS-Paint-Api-1 specification
const myRegisteredPaint__store__ = {};
export const myRegisterPaint = typeof registerPaint !== 'undefined'
  ? registerPaint
  : (function () {
    return function __registerPaint__(name, paintClass) {
      if (!myRegisteredPaint__store__.hasOwnProperty(name)) {
        myRegisteredPaint__store__[name] = paintClass;
      }
    }        
  })();

export function fetchImage(htmlElement, clientWidth, clientHeight) {
  return new Promise(function(resolve, reject) {
    if (typeof htmlElement === 'string') {
      htmlElement = htmlElement.replace(/[\s\"\']+/g, '');
      htmlElement = htmlElement.replace(/^url\(/, '');
      htmlElement = htmlElement.replace(/\)$/, '');
      const img = new Image()
      img.onload = function() { resolve(img); };
      img.onerror = function(err) { reject(err);}
      img.src = htmlElement;
    }
    else if (typeof htmlElement !== 'object') {
    }
    else if (htmlElement instanceof HTMLImageElement) {
      if (htmlElement.complete) {
        resolve(htmlElement);
      }
      else {
        htmlElement.onload = function() { resolve(htmlElement); }
        htmlElement.onerror = function(err) { reject(err); }
      }
    }
    else if (htmlElement instanceof Promise) {
      htmlElement
        .then(function(imageElement) { 
          if (imageElement instanceof HTMLImageElement)
            resolve(imageElement); 
          else
            reject('ERR: fetchImage: Promise of first argument must resolve in HTMLImageElement!');
        })
        .catch(function(err) { reject(err); });
    }
    else if (htmlElement instanceof SVGSVGElement) {
      if ("foreignObject" == htmlElement.firstElementChild.nodeName) {
        let width = htmlElement.clientWidth;
        let height = htmlElement.clientHeight;
        
        width = htmlElement.firstElementChild.firstElementChild.clientWidth;
        height = htmlElement.firstElementChild.firstElementChild.clientHeight;
        // set the svg element size to match our canvas size.
        htmlElement.setAttribute('width',  width);
        htmlElement.setAttribute('height', height);
        // now copy a string of the complete element and its children
        const svg = htmlElement.outerHTML;

        const blob = new Blob([svg], {type: 'image/svg+xml'});
        const url = window.URL.createObjectURL(blob);
        
        const img = new Image();
        img.onload = function() {
          window.URL.revokeObjectURL(url);
          resolve(img);
        }
        img.onerror = function(err) {
          window.URL.revokeObjectURL(url);
          reject(err);
        }
        // trigger render of object url.
        img.src = url;
  
      }          
    }
    else if (htmlElement instanceof HTMLElement) {
      let width = htmlElement.clientWidth;
      let height = htmlElement.clientHeight;

      width = clientWidth ? clientWidth : width;
      height = clientHeight ? clientHeight : height;

      width = width === 0 ? 300 : width;
      height = height === 0 ? 200 : height;

      const svg = ('<svg xmlns="http://www.w3.org/2000/svg"' +
          ' width="' + width + '"' +
          ' height="' + height + '">' +
        '<foreignObject width="100%" height="100%">' + 
          htmlElement.outerHTML + 
        '</foreignObject>' +
        '</svg>');
      
      const blob = new Blob([svg], {type: 'image/svg+xml'});
      const url = window.URL.createObjectURL(blob);
      
      const img = new Image();
      img.onload = function() {
        window.URL.revokeObjectURL(url);
        resolve(img);
      }
      img.onerror = function(err) {
        window.URL.revokeObjectURL(url);
        reject(err);
      }
      // trigger render of object url.
      img.src = url;
    }  
    else {
      reject('ERR: fetchImage: first argument MUST be of type url, HTMLElement or Promise!');
      return;
    }
  })
}
