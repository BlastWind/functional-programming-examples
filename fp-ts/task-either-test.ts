import { either, taskEither } from "fp-ts";
import { pipe } from "fp-ts/function";

const fetchGreeting = taskEither.tryCatch<Error, { name: string }>(
  () => new Promise((resolve) => resolve(JSON.parse('{ "name": "Carol" }'))),
  (reason) => new Error(String(reason))
);

fetchGreeting()
  .then((e) =>
    pipe(
      e,
      either.fold(
        (err) => `I'm sorry, I don't know who you are. (${err.message})`,
        (x) => `Hello, ${x.name}!`
      )
    )
  )
  .then(console.log);
