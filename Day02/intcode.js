import { assertEquals } from "../lib/util.js";

function run(program) {
  let halt = false;
  for (let i = 0; i < program.length; i += 4) {
    if (halt) return;
    const op = program[i];
    const addr1 = program[i + 1];
    const addr2 = program[i + 2];
    const addr3 = program[i + 3];
    switch (op) {
      case 1:
        program[addr3] = program[addr1] + program[addr2];
        break;
      case 2:
        program[addr3] = program[addr1] * program[addr2];
        break;
      case 99:
        halt = true;
        break;
      default:
        throw new Error(`Unexpected op code. (${op})`);
    }
  }
  return program;
}

export function tests() {
  assertEquals(
    run([1, 0, 0, 0, 99]), 
    [2, 0, 0, 0, 99], 
    "run([1,0,0,0,99])");
  assertEquals(
    run([2, 3, 0, 3, 99]), 
    [2, 3, 0, 6, 99], 
    "run([2,3,0,3,99])");
  assertEquals(
    run([2, 4, 4, 5, 99, 0]), 
    [2, 4, 4, 5, 99, 9801], 
    "run([2,4,4,5,99,0])");
  assertEquals(
    run([1, 1, 1, 4, 99, 5, 6, 0, 99]),
    [30, 1, 1, 4, 2, 5, 6, 0, 99],
    "run([1,1,1,4,99,5,6,0,99])"
  );
}

export function main(program) {
  return run(program);
}
