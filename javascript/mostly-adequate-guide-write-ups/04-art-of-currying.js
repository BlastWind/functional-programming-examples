/*
Currying: If you call a curried function with fewer argument that the 
function originally accepts. Return a function that takes the remaining
arguments. 
*/

/*
Currying is done with a special curry helper function. 
But first, let's demonstrate this concept a bit without it. 
*/

const addTwice = (x) => (y) => x + y;
const addTen = addTwice(10);
console.log(addTen(2)); // 12;

/*
Begin Aside
By the way, this is pure. So let's try memoizing: 
*/

console.log("BEGIN MEMOIZATION ASIDE");
const memoize = (f) => {
  let cache = [];
  return (...args) => {
    const cacheArgs = JSON.stringify(args);
    if (cache[cacheArgs]) {
      console.log(
        `Function ${f.name} cache hit on argument ${JSON.stringify(args)}`
      );
      return cache[cacheArgs];
    }
    return (cache[cacheArgs] = f(args));
  };
};

const memoizedAddTwice = memoize(addTwice);
const addOne = memoizedAddTwice(1);
const increment = memoizedAddTwice(1);

console.log(addOne === increment); // Again, just like in why-pure-functions, this is true!

const foo = addOne(10);
const bar = addOne(10); // notice no cache hit here because memoizedAddTwice only memoizes the first argument passed into addTwice

// But, we could do a nested memoization.

const nestedMemoize =
  (f, cache = new Map()) =>
  (args) => {
    const cacheArgs = JSON.stringify(args);
    if (cache.get(cacheArgs)) {
      console.log(`Function ${f.name} cache hit on argument ${cacheArgs}`);
      return cache.get(cacheArgs);
    }
    const value = f(args);
    const result =
      typeof value === "function" ? nestedMemoize(value, new Map()) : value;

    cache.set(cacheArgs, result);
    return result;
  };

const subtractTwice = (x) =>
  function subtractOnce(y) {
    // not the cleanest syntax, but this gives this gives our inner func a name that can be logged
    return y - x;
  };
const memoizedSubtractTwice = nestedMemoize(subtractTwice); // memoizedSubtractTwice = (args) => {...}
const subtractOne = memoizedSubtractTwice(1); // subtractOne = (args) => args - 1
const decrement = memoizedSubtractTwice(1); // decrement = subtractOne because memoizedSubtractTwice stored the key 1 in cache

console.log(subtractOne === decrement); // true
const a = subtractOne(7); // Notice, importantly, that subtractOne is memoized by nestedMemoize, therefore, now, key 7 is cached
const b = decrement(7); // Cache hit because key 7 is cached in subtractOne, which is the same function as decrement

/*
End Aside
*/

// But, now let's use the special curry function to make this easier:

console.log("BEGIN CURRYING");

const curry = (f) => {
  const arity = f.length;
  return function $curry(...args) {
    if (args.length < arity) {
      return $curry.bind(null, ...args); // store the arguments and don't invoke yet
    }
    return f(...args); // invoke
  };
};

// Notice that the the data we are operating on is the last argument
const match = curry((what, s) => s.match(what));
// Notice that we can invoke match with 0, 1, or 2 arguments; Ofcourse, invoking with 0 is useless
// 0 args
const match2 = match();
console.log(match2(/r/g, "hello world"));
// 1 arg
const hasLetterR = match(/r/g);
console.log(hasLetterR("hello world"));
// 2 args
console.log(match(/r/g, "hello world"));

// Here's a cooler one
const map = curry((f, arr) => arr.map(f));

// We can transform any function that works on single elements into a function that works on arrays with map
const allSubtractOne = map(subtractOne);
const nums = [1, 2, 3];
console.log(allSubtractOne(nums)); // [0, 1, 2] ! Ain't that cool?
