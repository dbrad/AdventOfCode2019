import { intcode } from "./intcode.js";
import * as testcases from "./part02_tests.js";
import { write } from "../lib/util.js";

export async function tests() {
  write("Equal & Less Than Tests");
  await testcases.equal_pos_true();
  await testcases.equal_pos_false();
  await testcases.less_than_pos_true();
  await testcases.less_than_pos_false();
  await testcases.equal_imed_true();
  await testcases.equal_imed_false();
  await testcases.less_than_imed_true();
  await testcases.less_than_imed_false();

  write("Jump Tests");
  await testcases.jump_pos_zero();
  await testcases.jump_pos_nonzero();
  await testcases.jump_imed_zero();
  await testcases.jump_imed_nonzero();

  write("Complex Tests");
  await testcases.complex_less_than_8();
  await testcases.complex_equal_to_8();
  await testcases.complex_greater_than_8();
}
export async function main(program) {
  const vm = new intcode();
  vm.load(program);
  vm.inputBuffer = [5];
  await vm.run();
  return vm.outputBuffer;
}
