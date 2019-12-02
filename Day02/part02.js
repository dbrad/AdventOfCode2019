import { write } from "../lib/util.js";
import { execute } from "./intcode.js";

export function main(program, desiredOutput) {
  try {
    let noun = 0;
    let verb = 0;
    let halt = false;
    for (; noun < 100; noun++) {
      for (; verb < 100; verb++) {
        halt = execute(program, noun, verb)[0] === desiredOutput;
        if (halt) break;
      }
      if (halt) break;
      verb = 0;
    }
    write(`noun = ${noun}`);
    write(`verb = ${verb}`);
    return 100 * noun + verb;
  } catch (err) {
    write(err.message);
    return null;
  }
}
