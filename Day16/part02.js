import { assertEquals } from "../lib/util.js";

/**
 * @param {string} rawInput
 */
function diet_fft(rawInput) {
  const offset = +rawInput.substr(0, 7);
  let input = rawInput
    .repeat(10000)
    .split("")
    .map(val => +val)
    .slice(offset)
    .reverse();

  for (let phase = 0; phase < 100; phase++) {
    let previousIndex = 0;
    for (let i = 1; i < input.length; i++) {
      input[i] += input[previousIndex];
      input[i] %= 10;
      previousIndex = i;
    }
  }
  
  return input
    .reverse()
    .slice(0, 8)
    .reduce((acc, val) => acc * 10 + val, 0);
}

export function tests() {
  assertEquals(diet_fft("03036732577212944063491565474664"), 84462026);
  assertEquals(diet_fft("02935109699940807407585447034323"), 78725270);
  assertEquals(diet_fft("03081770884921959731165446850517"), 53553731);
}

export function main(input) {
  return diet_fft(input);
}
