import { input } from "./input.js";
import { write, printFile } from "../lib/util.js";
import * as partOne from "./part01.js";
import * as partTwo from "./part02.js";

window.addEventListener("load", async () => {
  await printFile("intcode.js");

  write(`<h2>Part 01</h2>`);
  await printFile("part01_tests.js");
  await printFile("part01.js");
  await partOne.tests();
  write(`BOOST keycode => ${await partOne.main(input)}`);

  write(`<h2>Part 02</h2>`);
  await printFile("part02.js");
  write(`RESCURE COORDINATES => ${await partTwo.main(input)}`);
});
