import { compose, curry } from "./appendix-a-essential-functions-support.js";
import { join, map, prop, split } from "./appendix-c-pointfree-utilities.js";

// Container is a basic functor. It is boring.
class Container {
  constructor(x) {
    this.$value = x;
  }
  // of simply be rid of having to do "new Container"
  static of(x) {
    return new Container(x);
  }
}

/*
A few things to note: 
	- Contained data should not be accessed using .$value 
	- Container is a functor (a type that implements map and obey some functional laws)
*/

// Running functions on the value in the container with "map", which all functors need
Container.prototype.map = function (f) {
  return Container.of(f(this.$value));
};

/*
Notice that we can simply give the Container a function and 
it will run the function for us, on its internal value
*/
Container.of(2).map((x) => x + 2); // Container.of(4)

/*
Container is boring. But, the functor Maybe is cool. 
*/
class Maybe {
  static of(x) {
    return new Maybe(x);
  }

  get isNothing() {
    return this.$value === null || this.$value === undefined;
  }

  constructor(x) {
    this.$value = x;
  }

  // The map function contains what is so special about Maybe.
  /*
  	First, map is implemented, again, because Maybe is a functor. 
	Second, if $value is already invalid, Maybe returns invalid without yielding an error
	This means, chained .map()'s do not need to check for null values on each iteration
	By the way, arrays are functors. 
	By the way, it's time to stop thinking map as an array mapping to array, but 
	as the mathematical definition of map: Relationship between one category and another
  */
  map(fn) {
    return this.isNothing ? this : Maybe.of(fn(this.$value));
  }
  inspect() {
    return this.isNothing ? "Nothing" : `Just(${this.inspect(this.$value)})`;
  }
}

/*
We'll typically see Maybe used in functions which might fail to return a result
*/

// safeHead :: [a] -> Maybe(a)
const safeHead = (xs) => Maybe.of(xs[0]);

// Note that we never see Maybe in the next line, but it's returned from safeHead
// Additionally, because safeHead returns Maybe, we are forced to handle it with map
const streetName = compose(map(prop("street")), safeHead, prop("addresses"));
const validStreets = { addresses: [{ street: "Maybe Avenue" }] };
const invalidStreet1 = {};
const invalidStreet2 = { addresses: undefined };
const invalidStreet3 = { addresses: [{ foo: "bar" }] };
console.log(streetName(validStreets));

// Question: How do we return a more colorful error message? Null might not be good enough
// Key: a maybe escape match where one can invoke with custom messages

// curry :: b -> (a -> b) -> Maybe a -> b
const maybe = curry((v, f, m) => {
  if (m.isNothing) {
    return v;
  }
  return f(m.$value);
});

// Use Maybe, for example, in grabbing initials of a string
const initials = compose(
  join("."),
  map(toUpperCase),
  trace("after map head"),
  map(head),
  trace("after split"),
  split(" ")
);
