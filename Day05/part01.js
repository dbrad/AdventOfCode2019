import { intcode } from "./intcode.js";
import { assertEquals } from "../lib//util.js";

export async function tests() {
  const vm = new intcode();
  vm.load([3, 0, 4, 0, 99]);
  vm.inputBuffer = [777];
  await vm.run();
  const result = vm.outputBuffer[0];
  assertEquals(parseInt(result, 10), 777);
}
export async function main(program) {
  const vm = new intcode();
  vm.load(program);
  vm.inputBuffer.push(1);
  await vm.run();
  return vm.outputBuffer;
}
