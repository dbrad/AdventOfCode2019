import { input } from "./input.js";
import { write, printFile } from "../lib/util.js";
import * as partOne from "./part01.js";
import * as partTwo from "./part02.js";

window.addEventListener("load", async () => {
  await printFile("intcode.js");

  write(`<h2>Part 01</h2>`);
  await printFile("part01.js");
  await partOne.tests();
  write(`Computing Part 01...`);
  const startp1 = performance.now();
  write(`Result => ${await partOne.main(input)}`);
  write(`${performance.now() - startp1}ms`);

  write(`<h2>Part 02</h2>`);
  await printFile("part02.js");
  await partTwo.tests();
  write(`Computing Part 02...`);
  const startp2 = performance.now();
  write(`Result => ${await partTwo.main(input)}`);
  write(`${performance.now() - startp2}ms`);
});
