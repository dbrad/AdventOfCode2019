import { assertEquals } from "../lib/util.js";

function calculate(mass) {
  return ~~(mass / 3) - 2;
}

export function tests() {
  assertEquals(calculate(12), 2, "calculate(12)");
  assertEquals(calculate(14), 2, "calculate(14)");
  assertEquals(calculate(1969), 654, "calculate(1969)");
  assertEquals(calculate(100756), 33583, "calculate(100756)");
}

export function main(input) {
  return input.reduce((total, mass) => {
    return total + calculate(mass);
  }, 0);
}
