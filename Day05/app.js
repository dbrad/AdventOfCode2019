import { input } from "./input.js";
import { write, printFile } from "../lib/util.js";
import * as partOne from "./part01.js";
import * as partTwo from "./part02.js";

window.addEventListener("load", async () => {
  await printFile("intcode.js");

  write(`<h2>Part 01</h2>`);
  await printFile("part01.js");
  await partOne.tests();
  write(`Result => ${JSON.stringify(await partOne.main(input), undefined, 1)}`);

  write(`<h2>Part 02</h2>`);
  await printFile("part02.js");
  await printFile("part02_tests.js");
  await partTwo.tests();
  write(`Result => ${JSON.stringify(await partTwo.main(input), undefined, 1)}`);
});
