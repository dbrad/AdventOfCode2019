import { assertEquals, write } from "../lib/util.js";
import { execute } from "./intcode.js";

export function tests() {
  assertEquals(execute([1, 0, 0, 0, 99]), [2, 0, 0, 0, 99], "execute([1,0,0,0,99])");
  assertEquals(execute([2, 3, 0, 3, 99]), [2, 3, 0, 6, 99], "execute([2,3,0,3,99])");
  assertEquals(execute([2, 4, 4, 5, 99, 0]), [2, 4, 4, 5, 99, 9801], "execute([2,4,4,5,99,0])");
  assertEquals(execute([1, 1, 1, 4, 99, 5, 6, 0, 99]), [30, 1, 1, 4, 2, 5, 6, 0, 99], "execute([1,1,1,4,99,5,6,0,99])");
}

export function main(program) {
  try {
    return execute(program, 12, 2)[0];
  } catch (err) {
    write(err.message);
    return null;
  }
}
