import { assertEquals } from "../lib/util.js";

function checkPassword(password) {
  const digits = ("" + password).split("").map(letter => parseInt(letter, 10));
  let hasPair = false;
  let matchCount = 0;
  for (let n = 0, len = digits.length - 1; n < len; n++) {
    if (digits[n] > digits[n + 1]) {
      return false; // if we see a decrease, fail the password
    } else if (digits[n] === digits[n + 1]) {
      matchCount++;
      continue;
    }
    if (matchCount === 1) hasPair = true;
    matchCount = 0;
  }
  return hasPair || matchCount === 1;
}

export function tests() {
  assertEquals(checkPassword(112233), true, "checkPassword(112233)");
  assertEquals(checkPassword(123444), false, "checkPassword(123444)");
  assertEquals(checkPassword(111122), true, "checkPassword(111122)");
}

export function main(input) {
  const [start, end] = input.split("-");
  let count = 0;
  for (let password = start; password <= end; password++) {
    count += checkPassword(password) ? 1 : 0;
  }
  return count;
}
