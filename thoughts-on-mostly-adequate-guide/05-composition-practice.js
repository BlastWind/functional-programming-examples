const curry = (f) => {
  const arity = f.length;
  return function $curry(...args) {
    if (args.length < arity) {
      return $curry.bind(null, ...args); // store the arguments and don't invoke yet
    }
    return f(...args); // invoke
  };
};
const compose =
  (...fns) =>
  (...args) =>
    fns.reduceRight((acc, f) => [f.call(null, ...acc)], args)[0];

const replace = curry((re, rpl, str) => str.replace(re, rpl));
const toLowerCase = (x) => x.toLowerCase();

/*
	What does snakeCase("foo bar") do? 
	Well, snakeCase = (...args) => [replace(...), toLowerCase].reduceRight((acc, f) => [f.call(null, ...acc)], args)[0]; 
	And then, snakeCase("foo bar") => [replace(...), toLowerCase].reduceRight((acc, f) => [f.call(null, ...acc)], "foo bar")[0];

	Iter 1: 
		acc: "foo bar", f: toLowerCase, return: toLowerCase.call(null, "foo bar") 
	Iter 2: 
		acc: toLowerCase.call(null, "foo bar"), f: replace(...), return: replace(...).call(toLowerCase.call(null, "foo bar"))
*/

const snakeCase = compose(replace(/\s+/gi, "_"), toLowerCase);

// Exercise 1: Rewrite the following with compose
const isLastInStock = (cars) => {
  const lastCar = last(cars);
  return prop("in_stock", lastCar);
};

const composedIsLastInStock = compose(prop("in_stock"), last);

// Exercise 2: Refactor averageDollarValue using average and compose
const average = (xs) => reduce(add, 0, xs) / xs.length;

// imperative version
const averageDollarValue = (cars) => {
  const dollarValues = map((c) => c.dollar_value, cars);
  return average(dollarValues);
};

//functional version
const composedAverageDollarValue = compose(average, map(prop("dollar_value")));

// Refactor `fastestCar` using `compose()` and other functions in pointfree-style.

// fastestCar :: [Car] -> String
const fastestCar = (cars) => {
  const sorted = sortBy((car) => car.horsepower, cars);
  const fastest = last(sorted);
  return concat(fastest.name, " is the fastest");
};

const pointFreeFastestCar = compose(
  append(" is the fastest"),
  prop("name"),
  last,
  sortBy(prop("horsepower"))
);
