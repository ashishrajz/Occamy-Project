export const randomItem = (arr) =>
    arr[Math.floor(Math.random() * arr.length)];
  
  export const randomInt = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;
  
  export const jitter = (value, range = 0.01) =>
    value + (Math.random() - 0.5) * range;
  
  export const randomDate = (daysBack = 10) => {
    const d = new Date();
    d.setDate(d.getDate() - randomInt(0, daysBack));
    return d;
  };
  