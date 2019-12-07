import { intcode } from "./intcode.js";
import { assertEquals } from "../lib/util.js";

async function ampSequence(acs, phaseSettings) {
  const promises = [];
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

  ampA.inputBuffer = ampE.outputBuffer;
  ampB.inputBuffer = ampA.outputBuffer;
  ampC.inputBuffer = ampB.outputBuffer;
  ampD.inputBuffer = ampC.outputBuffer;
  ampE.inputBuffer = ampD.outputBuffer;

  promises.push(ampA.run());
  promises.push(ampB.run());
  promises.push(ampC.run());
  promises.push(ampD.run());
  promises.push(ampE.run());

  ampA.inputBuffer.push(phaseSettings[0]);
  ampA.inputBuffer.push(0);
  ampB.inputBuffer.push(phaseSettings[1]);
  ampC.inputBuffer.push(phaseSettings[2]);
  ampD.inputBuffer.push(phaseSettings[3]);
  ampE.inputBuffer.push(phaseSettings[4]);

  await Promise.all(promises);
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
  assertEquals(await ampSequence([3, 26, 1001, 26, -4, 26, 3, 27, 1002, 27, 2, 27, 1, 27, 26, 27, 4, 27, 1001, 28, -1, 28, 1005, 28, 6, 99, 0, 0, 5], [9, 8, 7, 6, 5]), 139629729);
  assertEquals(await ampSequence([3, 52, 1001, 52, -5, 52, 3, 53, 1, 52, 56, 54, 1007, 54, 5, 55, 1005, 55, 26, 1001, 54, -5, 54, 1105, 1, 12, 1, 53, 54, 53, 1008, 54, 0, 55, 1001, 55, 1, 55, 2, 53, 55, 53, 4, 53, 1001, 56, -1, 56, 1005, 56, 6, 99, 0, 0, 0, 0, 10], [9, 7, 8, 5, 6]), 18216);
}

export async function main(program) {
  const phaseSettingsIterator = premutator([5, 6, 7, 8, 9]);
  let highest = Number.MIN_SAFE_INTEGER;
  for (const phaseSettings of phaseSettingsIterator) {
    const result = await ampSequence(program, phaseSettings);
    if (result > highest) {
      highest = result;
    }
  }
  return highest;
}
