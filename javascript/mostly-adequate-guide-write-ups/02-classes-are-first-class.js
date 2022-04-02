const hi = (name) => `Hi ${name}`;

// dumb dumb example 1
const greetings = (name) => hi(name);

// better example 1
// we can do this since greetings is merely calling hi with the very same argument
const greetings2 = hi;

// dumb dumb example 2
const ajaxCall = () => "server information";
const serverGet = (callback) => ajaxCall((json) => callback(json));

/* better example 2
Why this work? 

First, ajaxCall((json) => callback(json)) is equivalent to ajaxCall(callback); 

Do you see why? It's because the annoymous function (json) => callback(json) 
is a function whose only job is invoking another func with the only argument passed in

Apply the principles in better example 1.

Next, const serverGet = (callback) => ajaxCall(callback) is violating the same principle. 
So, simplify to const serverGet = ajaxCall
*/
const serverGet2 = ajaxCall;

/* dumb dumb example 3
Sometimes, we come across "Controller" structures whose member functions simply 
RETURNS a function of another class with the same signature, like: 
*/

const Views = {
  create(attrs) {
    console.log("created");
  },
  delete(id) {
    console.log("deleted");
  },
};
const Db = {
  update(id, attrs) {
    console.log("updated");
  },
};
const BlogController = {
  create(attr) {
    return Views.create(attr);
  },
  delete(id) {
    return Views.delete(id);
  },
  update(id, attrs) {
    return Db.update(id, attrs);
  },
};

/* Better, or maybe, it is better to just scrap it all together 
since this does nothing other than bundling Views and Db */
const BlogController2 = {
  create: Views.create,
  delete: Views.delete,
  update: Db.update,
};

// <----------------- One note about interfacing with functions that use "this" ---------------->

/*
This is a javascript thing, but let's say you have: 
*/
const foo = {
  x: 15,
  bar: function () {
    return this.x;
  },
};

// Will not work because unbounded does not know about foo.x
const unbounded = foo.bar;
console.log(unbounded());

// Works because bounded knows about foo.x
const bounded = foo.bar.bind(foo);
console.log(bounded());
