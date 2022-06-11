import * as fs from "fs";
import * as TE from "fp-ts/TaskEither";

const main = async () => {
  const readFile = TE.taskify(fs.readFile);

  const readFile2: (
    filename: string,
    encoding: string
  ) => TE.TaskEither<NodeJS.ErrnoException, Buffer> = TE.taskify(fs.readFile);

  const fileContents = await readFile("b.txt")();
  const fileContents2 = await readFile2("a.txt", "utf-8")();
  console.log({ fileContents });
  console.log({ fileContents2 });
};

(async () => await main())();
