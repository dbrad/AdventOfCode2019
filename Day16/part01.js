import { assertEquals } from "../lib/util.js";

/**
 * @param {string} rawInput
 * @param {BigInt} phaseCount
 * @returns BigInt
 */
function fft(rawInput, phaseCount) {
  let input = rawInput.split("").map(val => BigInt(val));
  let vLen = BigInt(input.length);
  let output = [];

  const calculateForPosition = position => {
    const n = position + 1;
    let index = position; // 1. skip all element previous to this current position
    output[position] = 0n;
    while (index < vLen) {
      // 2. add to the current position's total a position number of digits
      for (let i = index, len = index + n; i < len; i++) {
        if (index >= vLen) {
          return;
        }
        output[position] += input[i];
        index++;
      }

      // 3. skip position number of digits
      index += n;

      // 4. inverse position number of digits and add those to the total
      for (let i = index, len = index + n; i < len; i++) {
        if (index >= vLen) {
          return;
        }
        output[position] += -input[i];
        index++;
      }

      index += n;

    } // 5. repeat from 2 until index is length of input
  };

  for (let phase = 0n; phase < phaseCount; phase++) {
      for (let position = 0, len = BigInt(input.length); position < len; position++) {
      calculateForPosition(position);
      const temp = "" + output[position];
      output[position] = BigInt(temp[temp.length - 1]);
    }
    input = [...output];
  }

  return BigInt(
    output.slice(0, 8).reduce((acc, val) => {
      return `${acc}${val}`;
    }, "")
  );
}

export function tests() {
  assertEquals(fft("80871224585914546619083218645595", 100n), 24176176n);
  assertEquals(fft("19617804207202209144916044189917", 100n), 73745418n);
  assertEquals(fft("69317163492948606335995924319873", 100n), 52432133n);
}

export function main(input) {
  return fft(input, 100n);
}
