import * as fs from "fs";
import * as TE from "fp-ts/TaskEither";
import * as _ from "fp-ts/internal";
import * as E from "fp-ts/Either";
/** @internal */
export const left = <E, A = never>(e: E): E.Either<E, A> => ({
  _tag: "Left",
  left: e,
});

/** @internal */
export const right = <A, E = never>(a: A): E.Either<E, A> => ({
  _tag: "Right",
  right: a,
});

export function taskify<A, L, R>(
  f: (a: A, cb: (e: L | null | undefined, r?: R) => void) => void
): (a: A) => TE.TaskEither<L, R>;

export function taskify<L, R>(f: Function): () => TE.TaskEither<L, R> {
  return function () {
    const args = Array.prototype.slice.call(arguments);
    console.log("arguments", arguments, "args", args);
    return () =>
      new Promise((resolve) => {
        const cbResolver = (e: L, r: R) =>
          e != null ? resolve(left(e)) : resolve(right(r));
        console.log(args.concat(cbResolver));
        f.apply(null, args.concat(cbResolver));
      });
  };
}
const readFile = taskify(fs.readFile);

const main = async () => {
  const fileContents = await readFile("a.txt")();
  console.log({ fileContents });
};
(async () => await main())();
