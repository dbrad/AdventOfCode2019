import { input } from "./input.js";
import { write, printFile } from "../lib/util.js";
import * as partOne from "./part01.js";
import * as partTwo from "./part02.js";

window.addEventListener("load", async () => {
  write(`<h2>Part 01</h2>`);
  await printFile("part01.js");
  partOne.tests();
  write(`Result => ${partOne.main(input)}`);

  write(`<h2>Part 02</h2>`);
  await printFile("part02.js");
  await partTwo.tests();
  write(`Result => ${partTwo.main(input)}`);
});
