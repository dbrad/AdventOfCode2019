import { input } from "./input.js";
import { write, printFile } from "../lib/util.js";
import * as partOne from "./part01.js";
import * as partTwo from "./part02.js";

window.addEventListener("load", async () => {
  await printFile("intcode.js");

  write(`<h2>Part 01</h2>`);
  await printFile("part01.js");
  partOne.tests();
  const result01 = partOne.main(input);
  write(`1202 program alarm`);
  write(`Result => ${result01}`);

  write(`<h2>Part 02</h2>`);
  await printFile("part02.js");
  write(`Searching for 19690720 parameters...`);
  const result02 = partTwo.main(input, 19690720);
  write(`Result => ${result02}`);
});
