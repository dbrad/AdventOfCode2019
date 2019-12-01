import { assertEquals } from "../lib/util.js";

function calculate(mass) {
  const fuel = ~~(mass / 3) - 2;
  if (fuel > 0) {
    return fuel + calculate(fuel);
  }
  return 0;
}

export function tests() {
  assertEquals(calculate(14), 2, "calculate(14)");
  assertEquals(calculate(1969), 966, "calculate(1969)");
  assertEquals(calculate(100756), 50346, "calculate(100756)");
}

export function main(input) {
  return input.reduce((total, mass) => {
    return total + calculate(mass);
  }, 0);
}
