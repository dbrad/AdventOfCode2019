import { assertEquals } from "../lib/util.js";

function checkPassword(password) {
  const digits = ("" + password).split("").map(letter => parseInt(letter, 10));
  let hasPair = false;
  for (let n = 0, len = digits.length - 1; n < len; n++) {
    if (digits[n] > digits[n + 1]) {
      return false; // if we see a decrease, fail the password
    } else if (digits[n] === digits[n + 1]) {
      hasPair = true;
    }
  }
  return hasPair;
}

export function tests() {
  assertEquals(checkPassword(111111), true, "checkPassword(111111)");
  assertEquals(checkPassword(223450), false, "checkPassword(223450)");
  assertEquals(checkPassword(123789), false, "checkPassword(123789)");
}

export function main(input) {
  const [start, end] = input.split("-");
  let count = 0;
  for (let password = start; password <= end; password++) {
    count += checkPassword(password) ? 1 : 0;
  }
  return count;
}
