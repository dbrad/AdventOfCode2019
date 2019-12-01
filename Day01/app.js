import { input } from "./input.js";
import { write, printFile } from "../lib/util.js";
import * as partOne from "./part01.js";
import * as partTwo from "./part02.js";

window.addEventListener("load", async () => {
  write(`<h2>Part 01</h2>`);
  await printFile("part01.js");
  partOne.tests();
  const result01 = partOne.main(input);
  write(`Result => ${result01}`);

  write(`<h2>Part 02</h2>`);
  await printFile("part02.js");
  partTwo.tests();
  const result02 = partTwo.main(input);
  write(`Result => ${result02}`);
});
