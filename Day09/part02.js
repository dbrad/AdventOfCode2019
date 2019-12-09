import { intcode } from "./intcode.js";

export async function main(program) {
  const vm = new intcode();
  vm.inputBuffer = [2];
  vm.load(program);
  await vm.run();
  return vm.outputBuffer[0];
}
