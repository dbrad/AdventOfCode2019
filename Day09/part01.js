import { intcode } from "./intcode.js";
import * as testCases from "./part01_tests.js";

export async function tests() {
  await testCases.selfCopyTest();
  await testCases.sixteenDigitNumberTest();
  await testCases.outputLargeNumberTest();
}

export async function main(program) {
  const vm = new intcode();
  vm.load(program);
  vm.inputBuffer = [1];
  await vm.run();
  return vm.outputBuffer[0];
}
