export function execute(program, noun = null, verb = null) {
  const memory = [...program];
  memory[1] = noun || memory[1];
  memory[2] = verb || memory[2];
  for (let i = 0; i < memory.length; i += 4) {
    const op = memory[i];
    const addr1 = memory[i + 1];
    const addr2 = memory[i + 2];
    const addr3 = memory[i + 3];
    if (op === 1) {
      memory[addr3] = memory[addr1] + memory[addr2];
    } else if (op === 2) {
      memory[addr3] = memory[addr1] * memory[addr2];
    } else if (op === 99) {
      break;
    } else {
      throw new Error(`Unexpected op code. (${op})`);
    }
  }
  return memory;
}
