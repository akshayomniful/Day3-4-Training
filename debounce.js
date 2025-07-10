function debounce(callback, delay) {
  let timerId;

  return function (...args) {
    const context = this;

    clearTimeout(timerId); // Clear previous timer
    timerId = setTimeout(() => {
      callback.apply(context, args);
    }, delay);
  };
}

<input type="text" id="search" placeholder="Type to search..." />;

function handleSearch(event) {
  console.log("Search query:", event.target.value);
}

const debouncedSearch = debounce(handleSearch, 500);

document.getElementById("search").addEventListener("input", debouncedSearch);

// handleSearch() is only called when the user stops typing for 500ms thus reducing unnecessary api calls
