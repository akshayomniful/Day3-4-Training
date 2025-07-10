//map
Array.prototype.myMap = function (callback) {
  let result = [];
  for (let i = 0; i < this.length; i++) {
    if (this.hasOwnProperty(i)) {
      result.push(callback(this[i], i, this));
    }
  }

  return result;
};

const arr1 = [1, 2, 3];
const squares = arr1.myMap((x) => x * x);
console.log(squares); // [1, 4, 9]

// filter
Array.prototype.myFilter = function (callback) {
  let result = [];

  for (let i = 0; i < this.length; i++) {
    if (this.hasOwnProperty(i)) {
      if (callback(this[i], i, this)) {
        result.push(this[i]);
      }
    }
  }

  return result;
};

//reduce
const arr2 = [1, 2, 3, 4];
const evens = arr2.myFilter((x) => x % 2 === 0);
console.log(evens); // [2, 4]

Array.prototype.myReduce = function (callback, initialValue) {
  let accumulator = initialValue;
  let startIndex = 0;

  if (accumulator === undefined) {
    while (startIndex < this.length && !this.hasOwnProperty(startIndex)) {
      startIndex++;
    }

    if (startIndex >= this.length) {
      throw new TypeError("Reduce of empty array with no initial value");
    }

    accumulator = this[startIndex];
    startIndex++;
  }

  for (let i = startIndex; i < this.length; i++) {
    if (this.hasOwnProperty(i)) {
      accumulator = callback(accumulator, this[i], i, this);
    }
  }

  return accumulator;
};

const arr3 = [1, 2, 3, 4];
const sum = arr3.myReduce((acc, val) => acc + val, 0);
console.log(sum); // 10
