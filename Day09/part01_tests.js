import { intcode } from "./intcode.js";
import { assertEquals } from "../lib/util.js";

export async function selfCopyTest() {
  const program = [109, 1, 204, -1, 1001, 100, 1, 100, 1008, 100, 16, 101, 1006, 101, 0, 99];
  const vm = new intcode();
  vm.load(program);
  await vm.run();
  assertEquals(vm.outputBuffer, program, "Program output");
}

export async function sixteenDigitNumberTest() {
  const program = [1102, 34915192, 34915192, 7, 4, 7, 99, 0];
  const vm = new intcode();
  vm.load(program);
  await vm.run();
  const output = vm.outputBuffer[0];
  const outputLength = ("" + output).length;
  assertEquals(outputLength, 16, `Output number (${"" + vm.outputBuffer[0]}) length`);
}

export async function outputLargeNumberTest() {
  const program = [104, 1125899906842624, 99];
  const vm = new intcode();
  vm.load(program);
  await vm.run();
  const output = vm.outputBuffer[0];
  assertEquals(output, 1125899906842624, `Program output`);
}
