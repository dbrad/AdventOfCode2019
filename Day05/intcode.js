import { append } from "../lib/util.js";
const ParameterModes = {
  POSITION: 0,
  IMMEDIATE: 1,
};

export class intcodeConsole {
  constructor() {
    this.acceptingInput = false;
    this.inputBuffer = [];

    this.container = document.createElement("div");
    this.container.classList.add("console-container");

    this.output = document.createElement("div");
    this.output.classList.add("console-output");
    this.container.appendChild(this.output);

    const inputMarker = document.createElement("span");
    inputMarker.innerHTML = "> ";
    this.container.appendChild(inputMarker);

    this.input = document.createElement("input");
    this.input.classList.add("console-input");
    inputMarker.appendChild(this.input);

    this.container.addEventListener("click", () => {
      this.input.focus();
    });
    this.input.addEventListener("keydown", e => {
      if (!this.acceptingInput) {
        e.preventDefault();
        return false;
      }
    });
    this.input.addEventListener("keyup", e => {
      if (e.keyCode === 13) {
        e.preventDefault();
        this.inputBuffer.push(this.input.value);
        this.input.value = "";
      }
    });
    append(this.container);

    this.out("Intcode console initialized.");
    this.out("Waiting for program...");
    this.input.placeholder = "processing...";
  }
  load(program) {
    this.memory = [...program];
    this.out("Program loaded.");
  }

  add(a, b, out) {
    const param01 = a.mode === ParameterModes.POSITION ? this.memory[a.value] : a.value;
    const param02 = b.mode === ParameterModes.POSITION ? this.memory[b.value] : b.value;
    this.memory[out] = param01 + param02;
  }

  mul(a, b, out) {
    const param01 = a.mode === ParameterModes.POSITION ? this.memory[a.value] : a.value;
    const param02 = b.mode === ParameterModes.POSITION ? this.memory[b.value] : b.value;
    this.memory[out] = param01 * param02;
  }

  async run(debug = false) {
    this.debug = debug;
    this.out("Running program...");
    let running = true;
    let ptr = 0;
    while (running) {
      const cmd = ("" + this.memory[ptr])
        .split("")
        .map(val => parseInt(val, 10))
        .reverse();
      const op = cmd[0] + (cmd[1] || 0) * 10;
      const paramModes = [cmd[2] || 0, cmd[3] || 0, cmd[4] || 0];

      if (op === 1) {
        const a = { mode: paramModes[0], value: this.memory[ptr + 1] };
        const b = { mode: paramModes[1], value: this.memory[ptr + 1] };
        const out = this.memory[ptr + 3];
        this.add(a, b, out);
        ptr += 4;
      } else if (op === 2) {
        const a = { mode: paramModes[0], value: this.memory[ptr + 1] };
        const b = { mode: paramModes[1], value: this.memory[ptr + 1] };
        const out = this.memory[ptr + 3];
        this.mul(a, b, out);
        ptr += 4;
      } else if (op === 3) {
        const addr = this.memory[ptr + 1];
        const value = await this.in();
        this.memory[addr] = parseInt(value, 10);
        ptr += 2;
      } else if (op === 4) {
        if (debug) {
          this.out(`${this.memory[ptr]} (${this.memory[ptr + 1]})`);
        }
        const param = paramModes[0] === 0 ? this.memory[this.memory[ptr + 1]] : this.memory[ptr + 1];
        this.out(param);
        ptr += 2;
      } else if (op === 99) {
        this.out("Program halted.");
        running = false;
        break;
      } else {
        this.out(`Unexpected op code. (${op}) [${ptr}][${JSON.stringify(this.memory[ptr], undefined, 2)}]`);
        running = false;
        break;
      }
      if (debug) {
        this.out(` --- `);
      }
    }
    this.input.placeholder = "";
    this.input.disabled = true;
    this.input.blur();
  }

  out(message) {
    const newLine = document.createElement("span");
    newLine.innerHTML = "" + message;
    this.output.appendChild(newLine);
    this.output.scrollTop = this.output.scrollHeight;
  }

  async in() {
    this.acceptingInput = true;
    this.input.placeholder = "";
    return new Promise((resolve, reject) => {
      const handle = window.setInterval(() => {
        if (this.inputBuffer.length === 0) {
          return;
        }
        this.input.placeholder = "processing...";
        this.acceptingInput = false;
        const value = this.inputBuffer.shift();
        window.clearInterval(handle);
        resolve(value);
      }, 5);
    });
  }
}
