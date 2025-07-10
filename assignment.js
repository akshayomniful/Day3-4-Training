function debounce(func, wait, immediate = false) {
  let timeout;

  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func.apply(this, args);
    };

    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);

    if (callNow) func.apply(this, args);
  };
}

function throttle(func, limit) {
  let inThrottle;

  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

function deepMerge(target, ...sources) {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        deepMerge(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return deepMerge(target, ...sources);
}

function isString(value) {
  return typeof value === "string" || value instanceof String;
}

function isNumber(value) {
  return typeof value === "number" && !isNaN(value) && isFinite(value);
}

function isBoolean(value) {
  return typeof value === "boolean";
}

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isArray(value) {
  return Array.isArray(value);
}

function isFunction(value) {
  return typeof value === "function";
}

function isNull(value) {
  return value === null;
}

function isUndefined(value) {
  return value === undefined;
}

// For ES6 modules
export {
  debounce,
  throttle,
  deepMerge,
  isString,
  isNumber,
  isBoolean,
  isObject,
  isArray,
  isFunction,
  isNull,
  isUndefined,
};

// For CommonJS (Node.js)
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    debounce,
    throttle,
    deepMerge,
    isString,
    isNumber,
    isBoolean,
    isObject,
    isArray,
    isFunction,
    isNull,
    isUndefined,
  };
}

// For browser global ( included via script tag)
if (typeof window !== "undefined") {
  window.Utils = {
    debounce,
    throttle,
    deepMerge,
    isString,
    isNumber,
    isBoolean,
    isObject,
    isArray,
    isFunction,
    isNull,
    isUndefined,
  };
}
