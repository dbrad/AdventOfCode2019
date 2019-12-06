import { intcode } from "./intcode.js";
import { assertEquals } from "../lib//util.js";

export async function equal_pos_true() {
  const vm = new intcode();
  vm.load([3, 9, 8, 9, 10, 9, 4, 9, 99, -1, 8]);
  vm.inputBuffer = [8];
  await vm.run();
  const result = vm.outputBuffer[0];
  assertEquals(parseInt(result, 10), 1);
}

export async function equal_pos_false() {
  const vm = new intcode();
  vm.load([3, 9, 8, 9, 10, 9, 4, 9, 99, -1, 8]);
  vm.inputBuffer = [6];
  await vm.run();
  const result = vm.outputBuffer[0];
  assertEquals(parseInt(result, 10), 0);
}

export async function less_than_pos_true() {
  const vm = new intcode();
  vm.load([3, 9, 7, 9, 10, 9, 4, 9, 99, -1, 8]);
  vm.inputBuffer = [6];
  await vm.run();
  const result = vm.outputBuffer[0];
  assertEquals(parseInt(result, 10), 1);
}

export async function less_than_pos_false() {
  const vm = new intcode();
  vm.load([3, 9, 7, 9, 10, 9, 4, 9, 99, -1, 8]);
  vm.inputBuffer = [8];
  await vm.run();
  const result = vm.outputBuffer[0];
  assertEquals(parseInt(result, 10), 0);
}

export async function equal_imed_true() {
  const vm = new intcode();
  vm.load([3, 3, 1108, -1, 8, 3, 4, 3, 99]);
  vm.inputBuffer = [8];
  await vm.run();
  const result = vm.outputBuffer[0];
  assertEquals(parseInt(result, 10), 1);
}

export async function equal_imed_false() {
  const vm = new intcode();
  vm.load([3, 3, 1108, -1, 8, 3, 4, 3, 99]);
  vm.inputBuffer = [6];
  await vm.run();
  const result = vm.outputBuffer[0];
  assertEquals(parseInt(result, 10), 0);
}

export async function less_than_imed_true() {
  const vm = new intcode();
  vm.load([3, 3, 1107, -1, 8, 3, 4, 3, 99]);
  vm.inputBuffer = [6];
  await vm.run();
  const result = vm.outputBuffer[0];
  assertEquals(parseInt(result, 10), 1);
}

export async function less_than_imed_false() {
  const vm = new intcode();
  vm.load([3, 3, 1107, -1, 8, 3, 4, 3, 99]);
  vm.inputBuffer = [8];
  await vm.run();
  const result = vm.outputBuffer[0];
  assertEquals(parseInt(result, 10), 0);
}

export async function jump_pos_zero() {
  const vm = new intcode();
  vm.load([3,12,6,12,15,1,13,14,13,4,13,99,-1,0,1,9]);
  vm.inputBuffer = [0];
  await vm.run();
  const result = vm.outputBuffer[0];
  assertEquals(parseInt(result, 10), 0);
}

export async function jump_pos_nonzero() {
  const vm = new intcode();
  vm.load([3,12,6,12,15,1,13,14,13,4,13,99,-1,0,1,9]);
  vm.inputBuffer = [100];
  await vm.run();
  const result = vm.outputBuffer[0];
  assertEquals(parseInt(result, 10), 1);
}

export async function jump_imed_zero() {
  const vm = new intcode();
  vm.load([3,3,1105,-1,9,1101,0,0,12,4,12,99,1]);
  vm.inputBuffer = [0];
  await vm.run();
  const result = vm.outputBuffer[0];
  assertEquals(parseInt(result, 10), 0);
}

export async function jump_imed_nonzero() {
  const vm = new intcode();
  vm.load([3,3,1105,-1,9,1101,0,0,12,4,12,99,1]);
  vm.inputBuffer = [100];
  await vm.run();
  const result = vm.outputBuffer[0];
  assertEquals(parseInt(result, 10), 1);
}

export async function complex_less_than_8() {
  const vm = new intcode();
  vm.load([3,21,1008,21,8,20,1005,20,22,107,8,21,20,1006,20,31,1106,0,36,98,0,0,1002,21,125,20,4,20,1105,1,46,104,999,1105,1,46,1101,1000,1,20,4,20,1105,1,46,98,99]);
  vm.inputBuffer = [7];
  await vm.run();
  const result = vm.outputBuffer[0];
  assertEquals(parseInt(result, 10), 999);
}

export async function complex_equal_to_8() {
  const vm = new intcode();
  vm.load([3,21,1008,21,8,20,1005,20,22,107,8,21,20,1006,20,31,1106,0,36,98,0,0,1002,21,125,20,4,20,1105,1,46,104,999,1105,1,46,1101,1000,1,20,4,20,1105,1,46,98,99]);
  vm.inputBuffer = [8];
  await vm.run();
  const result = vm.outputBuffer[0];
  assertEquals(parseInt(result, 10), 1000);
}

export async function complex_greater_than_8() {
  const vm = new intcode();
  vm.load([3,21,1008,21,8,20,1005,20,22,107,8,21,20,1006,20,31,1106,0,36,98,0,0,1002,21,125,20,4,20,1105,1,46,104,999,1105,1,46,1101,1000,1,20,4,20,1105,1,46,98,99]);
  vm.inputBuffer = [9];
  await vm.run();
  const result = vm.outputBuffer[0];
  assertEquals(parseInt(result, 10), 1001);
}