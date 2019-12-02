import { input } from "./input.js";
import { write, printFile } from "../lib/util.js";
import * as intcode from "./intcode.js";

window.addEventListener("load", async () => {
  await printFile("intcode.js");
  intcode.tests();
});
