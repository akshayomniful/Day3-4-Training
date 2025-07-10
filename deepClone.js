function deepCloneObject(obj, hash = new WeakMap()) {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  if (hash.has(obj)) {
    return hash.get(obj);
  }

  if (Array.isArray(obj)) {
    const clonedArr = [];
    hash.set(obj, clonedArr);

    for (let i = 0; i < obj.length; i++) {
      clonedArr[i] = deepCloneObject(obj[i], hash);
    }

    return clonedArr;
  }

  const clonedObj = {};
  hash.set(obj, clonedObj);

  const keys = Object.keys(obj);

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    clonedObj[key] = deepCloneObject(obj[key], hash);
  }

  return clonedObj;
}
