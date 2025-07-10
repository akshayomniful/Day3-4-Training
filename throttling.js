function throttle(callback, delay) {
  let lastCall = 0;

  return function (...args) {
    const now = new Date().getTime();

    if (now - lastCall >= delay) {
      lastCall = now;
      callback.apply(this, args);
    }
  };
}

// Sample scroll handler
function handleScroll() {
  console.log("Scroll triggered at:", new Date().toLocaleTimeString());
}

// Throttle the scroll handler to fire once every 200ms
const throttledScroll = throttle(handleScroll, 200);

// Attach to scroll event
window.addEventListener("scroll", throttledScroll);
