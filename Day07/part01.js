import { intcode } from "./intcode.js";
import { assertEquals } from "../lib/util.js";

async function ampSequence(acs, phaseSettings) {
  const ampA = new intcode();
  const ampB = new intcode();
  const ampC = new intcode();
  const ampD = new intcode();
  const ampE = new intcode();

  ampA.load(acs);
  ampB.load(acs);
  ampC.load(acs);
  ampD.load(acs);
  ampE.load(acs);

  ampA.inputBuffer = [phaseSettings[0], 0];
  await ampA.run();

  ampB.inputBuffer = [phaseSettings[1], ampA.outputBuffer[0]];
  await ampB.run();

  ampC.inputBuffer = [phaseSettings[2], ampB.outputBuffer[0]];
  await ampC.run();

  ampD.inputBuffer = [phaseSettings[3], ampC.outputBuffer[0]];
  await ampD.run();

  ampE.inputBuffer = [phaseSettings[4], ampD.outputBuffer[0]];
  await ampE.run();

  return parseInt(ampE.outputBuffer[0], 10);
}

function* premutator(array) {
  const n = array.length;
  const c = [];
  for (let i = 0; i < n; i++) {
    c[i] = 0;
  }
  yield array;
  let i = 0;
  while (i < n) {
    if (c[i] < i) {
      if (i % 2 === 0) {
        array[0] = array[0] + array[i];
        array[i] = array[0] - array[i];
        array[0] = array[0] - array[i];
      } else {
        array[c[i]] = array[c[i]] + array[i];
        array[i] = array[c[i]] - array[i];
        array[c[i]] = array[c[i]] - array[i];
      }
      yield array;
      c[i] += 1;
      i = 0;
    } else {
      c[i] = 0;
      i += 1;
    }
  }
  return;
}

export async function tests() {
  assertEquals(await ampSequence([3, 15, 3, 16, 1002, 16, 10, 16, 1, 16, 15, 15, 4, 15, 99, 0, 0], [4, 3, 2, 1, 0]), 43210);
  assertEquals(await ampSequence([3, 23, 3, 24, 1002, 24, 10, 24, 1002, 23, -1, 23, 101, 5, 23, 23, 1, 24, 23, 23, 4, 23, 99, 0, 0], [0, 1, 2, 3, 4]), 54321);
  assertEquals(await ampSequence([3, 31, 3, 32, 1002, 32, 10, 32, 1001, 31, -2, 31, 1007, 31, 0, 33, 1002, 33, 7, 33, 1, 33, 31, 31, 1, 32, 31, 31, 4, 31, 99, 0, 0, 0], [1, 0, 4, 3, 2]), 65210);
}

export async function main(program) {
  const phaseSettingsIterator = premutator([0, 1, 2, 3, 4]);
  let highest = Number.MIN_SAFE_INTEGER;
  for (const phaseSettings of phaseSettingsIterator) {
    const result = await ampSequence(program, phaseSettings);
    if (result > highest) {
      highest = result;
    }
  }
  return highest;
}
