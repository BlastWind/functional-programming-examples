/*
Pure functions are the core blocks of functional programming code
Pure functions are pure in that, invoking the function with the same inputs 
will always result in the same effect. This "effect" is not only what the 
function returns though. The following function, for example, is not pure 
*/

let s = "asdf";
/* s might not be "asdf" everytime, so function result is not predetermined
and is thus, hard to cache */
const almostPureSquare = (x) => {
  console.log(s);
  return x * x;
};

// This is pure
const pureSquare = (x) => x * x;

/*
 Javascript is a semi functional language. To use it functionally, 
 we must write a bunch of supporting functions, one of which is 
 the memoize function below. Additional functions include curry 
 and map, which we will see soon
*/

// Pure functions can be memoized
const memoize = (f) => {
  let cache = []; // in highest scope
  return (...args) => {
    const argString = JSON.stringify(args);
    return (cache[argString] = cache[argString] || f(args));
  };
};

// alternative syntax attempt, notice that this doesn't work because cache is not
// cached in the closure of a high enough scope
const memoizeAttempt = (f) => (args) => {
  let cache = []; // in lowest scope
  const argString = JSON.stringify(args);
  return (cache[argString] = cache[argString] || f(args));
};

const memoizedSquare = memoize(pureSquare);

/*
Interestingly, every impure function can technically become pure and thus cached
Although, they wouldn't be very useful at the moment: 
*/

const impureHttpGet = (url) => fetch(url);

/*
Suddenly pure, but useless!

This is pure because pureHttpGetHandler(url) can always return the same function
that can in turn be invoked to call impureHttpGet(url); 

But, the results of the httpGet aren't actually cached
*/
const pureHttpGetHandler = memoize2((url) => () => impureHttpGet(url));

const googleGet = pureHttpGetHandler("https://www.google.com");

const googleGet2 = pureHttpGetHandler("https://www.google.com");

// This is true! On the other hand, if no memoization is done, this will be false. Not very useful but...
console.log(googleGet === googleGet2);
