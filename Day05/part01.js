import { intcodeConsole } from "./intcode.js";

export function main(program) {
  const icConsole = new intcodeConsole();
  icConsole.load(program);
  icConsole.run();
}
