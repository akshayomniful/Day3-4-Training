function sequentialApiCalls(urls) {
  let results = [];

  return urls
    .reduce((promiseChain, currentUrl) => {
      return promiseChain.then(() => {
        return fetch(currentUrl)
          .then((res) => res.json())
          .then((data) => {
            results.push(data);
          });
      });
    }, Promise.resolve())
    .then(() => results); // Final then returns the full results array
}

const apiUrls = [
  "https://jsonplaceholder.typicode.com/todos/1",
  "https://jsonplaceholder.typicode.com/todos/2",
  "https://jsonplaceholder.typicode.com/todos/3",
];

sequentialApiCalls(apiUrls)
  .then((results) => {
    console.log("Results:", results);
  })
  .catch((err) => {
    console.error("Error:", err);
  });
