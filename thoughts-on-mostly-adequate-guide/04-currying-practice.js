const curry = (f) => {
  const arity = f.length;
  return function $curry(...args) {
    if (args.length < arity) {
      return $curry.bind(null, ...args); // store the arguments and don't invoke yet
    }
    return f(...args); // invoke
  };
};

const match = curry((what, s) => s.match(what));
const replace = curry((what, replacement, s) => s.replace(what, replacement));
const filter = curry((f, xs) => xs.filter(f));
const map = curry((f, xs) => xs.map(f));

// #1: Refactor the following
const words = (str) => split(" ", str);
// solution:
const split = curry((delim, str) => str.split(delim));
const curriedWords = split(" ");

// #2: Refactor the following:
const filterQs = (xs) => filter((x) => x.match(/q/i), xs);
// solution:
/*
Step 1, notice that (x) => x.match(/q/i) is equivalent to curriedMatch(/q/i)
Therefore, simplify to const filterQs = (xs) => filter(curriedMatch(/q/i), xs); 
Step 2, notice that (xs) => filter(foo, xs) is equivalent to filter(foo). 
Since foo = curriedMatch(/q/i), simplify to filter(match(/q/i))
*/
const refactoredFilterQs = filter(match(/q/i));

// #3: Refactor max to not reference any arguments using the helper function keepHighest.
const keepHighest = (x, y) => (x >= y ? x : y);
const reduce = curry(function reduce(fn, zero, xs) {
  return xs.reduce(function $reduceIterator($acc, $x) {
    return fn($acc, $x);
  }, zero);
});
const max = (xs) => reduce((acc, x) => (x >= acc ? x : acc), -Infinity, xs);
// solution
/*
Step 1, (foo) => bar(..., foo) is equivalent to curriedBar(...)
(same principle used in Solution 2 step 1)
Therefore, simplify to const max = reduce((acc, x) => x >= acc ? x : acc), -Infinity); 
Step 2, notice that keepHighest has the same signature as (acc, x) => x >= acc ? x : acc,
so, simplify to reduce(keepHighest, -Infinity)
*/
const curriedMax = reduce(keepHighest, -Infinity);
