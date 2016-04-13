function isDate(val) {
  return Object.prototype.toString.call(val) === '[object Date]';
}

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.deepmerge = factory();
  }
}(this, function () {

  return function deepmerge(target, src) {
    if (Array.isArray(src)) {
      return src.reduce(function(sofar, curr, i) {
        if (typeof sofar[i] === 'undefined' || isDate(sofar[i])) {
          sofar[i] = curr;
        } else if (typeof curr === 'object') {
          sofar[i] = deepmerge(target[i], curr);
        } else {
          if (target.indexOf(curr) === -1) {
            sofar.push(curr);
          }
        }
        return sofar;
      }, [].concat(target || []));
    } else {
      var dest = {};
      if (target && typeof target === 'object') {
        Object.keys(target).forEach(function (key) {
          dest[key] = target[key];
        });
      }
      return Object.keys(src).reduce(function(sofar, key) {
        if (typeof src[key] !== 'object' || !src[key] || isDate(src[key])) {
          sofar[key] = src[key];
        } else {
          if (!target[key]) {
            sofar[key] = src[key];
          } else {
            sofar[key] = deepmerge(target[key], src[key]);
          }
        }
        return sofar;
      }, dest);
    }
  }
}));
