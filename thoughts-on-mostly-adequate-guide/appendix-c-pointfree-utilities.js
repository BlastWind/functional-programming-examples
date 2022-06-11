import { compose, curry } from "./appendix-a-essential-functions-support.js";
import { Maybe } from "./appendix-b-algebraic-structures-support.js";

// add :: Number -> Number -> Number
const add = curry((a, b) => a + b);

// chain :: Monad m => (a -> m b) -> m a -> m b
const chain = curry((fn, m) => m.chain(fn));

// concat :: String -> String -> String
const concat = curry((a, b) => a.concat(b));

// eq :: Eq a => a -> a -> Boolean
const eq = curry((a, b) => a === b);

// filter :: (a -> Boolean) -> [a] -> [a]
const filter = curry((fn, xs) => xs.filter(fn));

// flip :: (a -> b -> c) -> b -> a -> c
const flip = curry((fn, a, b) => fn(b, a));

// append :: String -> String -> String
const append = flip(concat);

// forEach :: (a -> ()) -> [a] -> ()
const forEach = curry((fn, xs) => xs.forEach(fn));

// head :: [a] -> a
const head = (xs) => xs[0];

// intercalate :: String -> [String] -> String
const intercalate = curry((str, xs) => xs.join(str));

// join :: Monad m => m (m a) -> m a
const join = (m) => m.join();

// last :: [a] -> a
const last = (xs) => xs[xs.length - 1];

// map :: Functor f => (a -> b) -> f a -> f b
const map = curry((fn, f) => f.map(fn));

// match :: RegExp -> String -> Boolean
const match = curry((re, str) => re.test(str));

// prop :: String -> Object -> a
const prop = curry((p, obj) => obj[p]);

// reduce :: (b -> a -> b) -> b -> [a] -> b
const reduce = curry((fn, zero, xs) => xs.reduce(fn, zero));

// replace :: RegExp -> String -> String -> String
const replace = curry((re, rpl, str) => str.replace(re, rpl));

// reverse :: [a] -> [a]
const reverse = (x) =>
  Array.isArray(x) ? x.reverse() : x.split("").reverse().join("");

// safeHead :: [a] -> Maybe a
const safeHead = compose(Maybe.of, head);

// safeLast :: [a] -> Maybe a
const safeLast = compose(Maybe.of, last);

// safeProp :: String -> Object -> Maybe a
const safeProp = curry((p, obj) => compose(Maybe.of, prop(p))(obj));

// sequence :: (Applicative f, Traversable t) => (a -> f a) -> t (f a) -> f (t a)
const sequence = curry((of, f) => f.sequence(of));

// sortBy :: Ord b => (a -> b) -> [a] -> [a]
const sortBy = curry((fn, xs) =>
  xs.sort((a, b) => {
    if (fn(a) === fn(b)) {
      return 0;
    }

    return fn(a) > fn(b) ? 1 : -1;
  })
);

// split :: String -> String -> [String]
const split = curry((sep, str) => str.split(sep));

// take :: Number -> [a] -> [a]
const take = curry((n, xs) => xs.slice(0, n));

// toLowerCase :: String -> String
const toLowerCase = (s) => s.toLowerCase();

// toString :: a -> String
const toString = String;

// toUpperCase :: String -> String
const toUpperCase = (s) => s.toUpperCase();

// traverse :: (Applicative f, Traversable t) => (a -> f a) -> (a -> f b) -> t a -> f (t b)
const traverse = curry((of, fn, f) => f.traverse(of, fn));

// unsafePerformIO :: IO a -> a
const unsafePerformIO = (io) => io.unsafePerformIO();

export {
  add,
  append,
  chain,
  concat,
  eq,
  filter,
  flip,
  forEach,
  head,
  intercalate,
  join,
  last,
  map,
  match,
  prop,
  reduce,
  replace,
  safeHead,
  safeLast,
  safeProp,
  sequence,
  sortBy,
  split,
  take,
  toLowerCase,
  toString,
  toUpperCase,
  traverse,
  unsafePerformIO,
};
