class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(eventName, listener) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(listener);
  }

  // Emit
  emit(eventName, ...args) {
    const listeners = this.events[eventName];
    if (listeners) {
      listeners.forEach((listener) => listener(...args));
    }
  }

  // Remove event listener
  off(eventName, listenerToRemove) {
    if (!this.events[eventName]) return;

    this.events[eventName] = this.events[eventName].filter(
      (listener) => listener !== listenerToRemove
    );
  }

  //one time event listener
  once(eventName, listener) {
    const wrapper = (...args) => {
      listener(...args);
      this.off(eventName, wrapper); // Remove after first call
    };
    this.on(eventName, wrapper);
  }
}

const emitter = new EventEmitter();

function greet(name) {
  console.log(`Hello, ${name}!`);
}

emitter.on("sayHello", greet);

emitter.emit("sayHello", "Alice"); // Output- Hello, Alice!

emitter.off("sayHello", greet);

emitter.emit("sayHello", "Bob"); // No output

// Use once
emitter.once("onlyOnce", (msg) => console.log(`Received: ${msg}`));

emitter.emit("onlyOnce", "This will show"); // Output- Received: This will show
emitter.emit("onlyOnce", "This will not"); // No output
