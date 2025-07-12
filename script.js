// Utility Library

// 1. Debounce Function
function debounce(func, delay) {
  let timeout;
  return function (...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(context, args);
    }, delay);
  };
}

// 2. Deep Clone Function
function deepClone(obj) {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  if (obj instanceof Array) {
    return obj.map((item) => deepClone(item));
  }

  if (obj instanceof Object) {
    const copy = {};
    Object.keys(obj).forEach((key) => {
      copy[key] = deepClone(obj[key]);
    });
    return copy;
  }

  return obj;
}

// 3. Promise Chain
function sequentialPromises(promiseFunctions) {
  return promiseFunctions.reduce(
    (chain, promiseFn) =>
      chain.then((results) =>
        promiseFn().then((result) => [...results, result])
      ),
    Promise.resolve([])
  );
}

// 4. Event Emitter
class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(event, listener) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
    return () => this.off(event, listener);
  }

  off(event, listener) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter((l) => l !== listener);
  }

  emit(event, ...args) {
    if (!this.events[event]) return;
    this.events[event].forEach((listener) => {
      listener.apply(this, args);
    });
  }

  once(event, listener) {
    const remove = this.on(event, (...args) => {
      remove();
      listener.apply(this, args);
    });
  }
}

// 5. Throttle Function
function throttle(func, limit) {
  let inThrottle = false;
  return function (...args) {
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

// 6. Curry Function
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    return function (...moreArgs) {
      return curried.apply(this, [...args, ...moreArgs]);
    };
  };
}

// 7. Array Methods
const arrayMethods = {
  map(arr, callback) {
    const result = [];
    for (let i = 0; i < arr.length; i++) {
      result.push(callback(arr[i], i, arr));
    }
    return result;
  },

  filter(arr, callback) {
    const result = [];
    for (let i = 0; i < arr.length; i++) {
      if (callback(arr[i], i, arr)) {
        result.push(arr[i]);
      }
    }
    return result;
  },

  reduce(arr, callback, initialValue) {
    let accumulator = initialValue !== undefined ? initialValue : arr[0];
    const startIndex = initialValue !== undefined ? 0 : 1;

    for (let i = startIndex; i < arr.length; i++) {
      accumulator = callback(accumulator, arr[i], i, arr);
    }

    return accumulator;
  },
};

// 8. Local Storage Manager
class StorageManager {
  constructor(prefix = "app_") {
    this.prefix = prefix;
  }

  setItem(key, value) {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(this.prefix + key, serializedValue);
      return true;
    } catch (error) {
      console.error("Error setting localStorage item:", error);
      return false;
    }
  }

  getItem(key) {
    try {
      const serializedValue = localStorage.getItem(this.prefix + key);
      if (serializedValue === null) return null;
      return JSON.parse(serializedValue);
    } catch (error) {
      console.error("Error getting localStorage item:", error);
      return null;
    }
  }

  removeItem(key) {
    try {
      localStorage.removeItem(this.prefix + key);
      return true;
    } catch (error) {
      console.error("Error removing localStorage item:", error);
      return false;
    }
  }

  clear() {
    try {
      Object.keys(localStorage)
        .filter((key) => key.startsWith(this.prefix))
        .forEach((key) => localStorage.removeItem(key));
      return true;
    } catch (error) {
      console.error("Error clearing localStorage items:", error);
      return false;
    }
  }

  getAllItems() {
    const items = {};
    try {
      Object.keys(localStorage)
        .filter((key) => key.startsWith(this.prefix))
        .forEach((key) => {
          const pureKey = key.slice(this.prefix.length);
          items[pureKey] = this.getItem(pureKey);
        });
      return items;
    } catch (error) {
      console.error("Error getting all localStorage items:", error);
      return items;
    }
  }
}

// Initialize demos when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Debounce Demo
  const debounceInput = document.getElementById("debounce-input");
  const debounceOutput = document.getElementById("debounce-output");

  const updateDebounceOutput = debounce((value) => {
    debounceOutput.textContent = value;
  }, 500);

  debounceInput.addEventListener("input", (e) => {
    updateDebounceOutput(e.target.value);
  });

  // Deep Clone Demo
  const cloneBtn = document.getElementById("clone-btn");
  const originalObjectEl = document.getElementById("original-object");
  const clonedObjectEl = document.getElementById("cloned-object");

  cloneBtn.addEventListener("click", () => {
    const original = {
      name: "Test Object",
      nested: {
        value: 42,
        array: [1, 2, { text: "nested" }],
      },
      date: new Date(),
    };

    const cloned = deepClone(original);

    // Modify cloned object to show it's a deep copy
    cloned.nested.value = 99;
    cloned.nested.array[2].text = "modified";

    originalObjectEl.textContent = JSON.stringify(original, null, 2);
    clonedObjectEl.textContent = JSON.stringify(cloned, null, 2);
  });

  // Promise Chain Demo
  const promiseBtn = document.getElementById("promise-btn");
  const promiseOutput = document.getElementById("promise-output");

  promiseBtn.addEventListener("click", () => {
    promiseOutput.textContent = "Running sequential promises...";

    // Simulate API calls
    const api1 = () =>
      new Promise((resolve) => {
        setTimeout(() => resolve("API 1 data"), 500);
      });

    const api2 = () =>
      new Promise((resolve) => {
        setTimeout(() => resolve("API 2 data"), 700);
      });

    const api3 = () =>
      new Promise((resolve) => {
        setTimeout(() => resolve("API 3 data"), 300);
      });
    sequentialPromises([api1, api2, api3])
      .then((results) => {
        promiseOutput.textContent = JSON.stringify(results, null, 2);
      })
      .catch((error) => {
        promiseOutput.textContent = `Error: ${error.message}`;
      });
  });

  // Event Emitter Demo
  const emitEvent1Btn = document.getElementById("emit-event1");
  const emitEvent2Btn = document.getElementById("emit-event2");
  const eventOutput = document.getElementById("event-output");

  const eventEmitter = new EventEmitter();
  let eventLog = [];

  const logEvent = (message) => {
    eventLog.push(`${new Date().toLocaleTimeString()}: ${message}`);
    eventOutput.textContent = eventLog.join("\n");
  };

  eventEmitter.on("event1", (data) => {
    logEvent(`Event1 triggered with data: ${data}`);
  });

  eventEmitter.on("event2", (data) => {
    logEvent(`Event2 triggered with data: ${data}`);
  });

  emitEvent1Btn.addEventListener("click", () => {
    eventEmitter.emit("event1", "Button 1 clicked");
  });

  emitEvent2Btn.addEventListener("click", () => {
    eventEmitter.emit("event2", "Button 2 clicked");
  });

  // Throttle Function Demo
  const scrollArea = document.getElementById("scroll-area");
  const scrollCount = document.getElementById("scroll-count");
  const throttledCount = document.getElementById("throttled-count");

  let normalScrolls = 0;
  let throttledScrolls = 0;

  scrollArea.addEventListener("scroll", () => {
    normalScrolls++;
    scrollCount.textContent = normalScrolls;
  });

  const throttledScroll = throttle(() => {
    throttledScrolls++;
    throttledCount.textContent = throttledScrolls;
  }, 300);

  scrollArea.addEventListener("scroll", throttledScroll);

  // Curry Function Demo
  const curryBtn = document.getElementById("curry-btn");
  const curryOutput = document.getElementById("curry-output");

  curryBtn.addEventListener("click", () => {
    const add = (a, b, c) => a + b + c;
    const curriedAdd = curry(add);

    const results = [
      `add(1, 2, 3) = ${add(1, 2, 3)}`,
      `curriedAdd(1)(2)(3) = ${curriedAdd(1)(2)(3)}`,
      `curriedAdd(1, 2)(3) = ${curriedAdd(1, 2)(3)}`,
      `curriedAdd(1)(2, 3) = ${curriedAdd(1)(2, 3)}`,
      `curriedAdd(1, 2, 3) = ${curriedAdd(1, 2, 3)}`,
    ];

    curryOutput.textContent = results.join("\n");
  });

  // Array Methods Demo
  const arrayBtn = document.getElementById("array-btn");
  const arrayOutput = document.getElementById("array-output");

  arrayBtn.addEventListener("click", () => {
    const numbers = [1, 2, 3, 4, 5];

    const mappedResult = arrayMethods.map(numbers, (x) => x * 2);
    const filteredResult = arrayMethods.filter(numbers, (x) => x % 2 === 0);
    const reducedResult = arrayMethods.reduce(numbers, (acc, x) => acc + x, 0);

    const results = [
      `Original array: ${JSON.stringify(numbers)}`,
      `Custom map (x * 2): ${JSON.stringify(mappedResult)}`,
      `Custom filter (even numbers): ${JSON.stringify(filteredResult)}`,
      `Custom reduce (sum): ${reducedResult}`,
    ];

    arrayOutput.textContent = results.join("\n");
  });

  // Local Storage Manager Demo
  const storageKey = document.getElementById("storage-key");
  const storageValue = document.getElementById("storage-value");
  const storageSetBtn = document.getElementById("storage-set");
  const storageGetBtn = document.getElementById("storage-get");
  const storageRemoveBtn = document.getElementById("storage-remove");
  const storageClearBtn = document.getElementById("storage-clear");
  const storageOutput = document.getElementById("storage-output");

  const storageManager = new StorageManager("demo_");

  function updateStorageDisplay() {
    const allItems = storageManager.getAllItems();
    storageOutput.textContent = JSON.stringify(allItems, null, 2) || "{}";
  }

  storageSetBtn.addEventListener("click", () => {
    const key = storageKey.value.trim();
    const value = storageValue.value.trim();

    if (!key) {
      alert("Please enter a key");
      return;
    }

    storageManager.setItem(key, value);
    updateStorageDisplay();
  });

  storageGetBtn.addEventListener("click", () => {
    const key = storageKey.value.trim();

    if (!key) {
      alert("Please enter a key");
      return;
    }

    const value = storageManager.getItem(key);
    storageValue.value = value !== null ? value : "";
    updateStorageDisplay();
  });

  storageRemoveBtn.addEventListener("click", () => {
    const key = storageKey.value.trim();

    if (!key) {
      alert("Please enter a key");
      return;
    }

    storageManager.removeItem(key);
    updateStorageDisplay();
  });

  storageClearBtn.addEventListener("click", () => {
    storageManager.clear();
    updateStorageDisplay();
  });

  // Initialize storage display
  updateStorageDisplay();

  // Type Checkers
  const typeCheckers = {
    isString(value) {
      return typeof value === "string";
    },
    isNumber(value) {
      return typeof value === "number" && !isNaN(value);
    },
    isBoolean(value) {
      return typeof value === "boolean";
    },
    isObject(value) {
      return (
        value !== null && typeof value === "object" && !Array.isArray(value)
      );
    },
    isArray(value) {
      return Array.isArray(value);
    },
    isFunction(value) {
      return typeof value === "function";
    },
    isNull(value) {
      return value === null;
    },
    isUndefined(value) {
      return value === undefined;
    },
    isDate(value) {
      return value instanceof Date;
    },
    isEmpty(value) {
      if (value === null || value === undefined) return true;
      if (typeof value === "string" || Array.isArray(value))
        return value.length === 0;
      if (typeof value === "object") return Object.keys(value).length === 0;
      return false;
    },
  };

  // Deep Merge Function
  function deepMerge(target, source) {
    const output = Object.assign({}, target);

    if (typeCheckers.isObject(target) && typeCheckers.isObject(source)) {
      Object.keys(source).forEach((key) => {
        if (typeCheckers.isObject(source[key])) {
          if (!(key in target)) {
            Object.assign(output, { [key]: source[key] });
          } else {
            output[key] = deepMerge(target[key], source[key]);
          }
        } else {
          Object.assign(output, { [key]: source[key] });
        }
      });
    }

    return output;
  }

  // Export utility library
  window.Utils = {
    debounce,
    deepClone,
    sequentialPromises,
    EventEmitter,
    throttle,
    curry,
    arrayMethods,
    StorageManager,
    typeCheckers,
    deepMerge,
  };

  console.log("JavaScript Utility Library loaded successfully!");
});
