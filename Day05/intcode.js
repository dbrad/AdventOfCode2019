import { append } from "../lib/util.js";

const parameterModes = {
  POSITION: 0,
  IMMEDIATE: 1
};

const computerMode = {
  BACKGROUND: 0,
  INTERACTIVE: 1
};

export class intcode {
  constructor() {
    this.acceptingInput = false;
    this.inputBuffer = [];
    this.outputBuffer = [];
    this.mode = computerMode.BACKGROUND;
  }

  interactiveMode() {
    this.mode = computerMode.INTERACTIVE;
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
    if (this.mode === computerMode.INTERACTIVE) {
      this.out("Program loaded.");
    }
  }

  out(message) {
    this.outputBuffer.push(message);
    if (this.mode === computerMode.INTERACTIVE) {
      const newLine = document.createElement("span");
      newLine.innerHTML = "" + message;
      this.output.appendChild(newLine);
      this.output.scrollTop = this.output.scrollHeight;
    }
  }

  async in() {
    if (this.mode === computerMode.INTERACTIVE) {
      this.acceptingInput = true;
      this.input.placeholder = "";
    }
    return new Promise(resolve => {
      const handle = window.setInterval(() => {
        if (this.inputBuffer.length === 0) {
          return;
        }
        if (this.mode === computerMode.INTERACTIVE) {
          this.input.placeholder = "processing...";
          this.acceptingInput = false;
        }
        const value = this.inputBuffer.shift();
        window.clearInterval(handle);
        resolve(value);
      }, 5);
    });
  }

  async run() {
    const parseParam = (mode, val) => {
      return mode === parameterModes.POSITION ? this.memory[val] : val;
    };
    if (this.mode === computerMode.INTERACTIVE) {
      this.out("Running program...");
    }
    let running = true;
    let ptr = 0;

    while (running) {
      const cmd = ("" + this.memory[ptr])
        .split("")
        .map(val => parseInt(val, 10))
        .reverse();
      const op = cmd[0] + (cmd[1] || 0) * 10;
      const pMode = [cmd[2] || 0, cmd[3] || 0, cmd[4] || 0];
      const p = [this.memory[ptr + 1], this.memory[ptr + 2], this.memory[ptr + 3]];

      if (op === 1) {
        // ADD
        const a = parseParam(pMode[0], p[0]);
        const b = parseParam(pMode[1], p[1]);
        this.memory[p[2]] = a + b;
        ptr += 4;
      } else if (op === 2) {
        // MULTIPLY
        const a = parseParam(pMode[0], p[0]);
        const b = parseParam(pMode[1], p[1]);
        this.memory[p[2]] = a * b;
        ptr += 4;
      } else if (op === 3) {
        // IN
        const value = await this.in();
        this.memory[p[0]] = parseInt(value, 10);
        ptr += 2;
      } else if (op === 4) {
        // OUT
        const value = parseParam(pMode[0], p[0]);
        this.out(value);
        ptr += 2;
      } else if (op === 5) {
        // JUMP-IF-TRUE
        const condition = parseParam(pMode[0], p[0]);
        const target = parseParam(pMode[1], p[1]);
        if (condition !== 0) {
          ptr = target;
        } else {
          ptr += 3;
        }
      } else if (op === 6) {
        // JUMP-IF-FALSE
        const condition = parseParam(pMode[0], p[0]);
        const target = parseParam(pMode[1], p[1]);
        if (condition === 0) {
          ptr = target;
        } else {
          ptr += 3;
        }
      } else if (op === 7) {
        // LESS THAN
        const a = parseParam(pMode[0], p[0]);
        const b = parseParam(pMode[1], p[1]);
        if (a < b) {
          this.memory[p[2]] = 1;
        } else {
          this.memory[p[2]] = 0;
        }
        ptr += 4;
      } else if (op === 8) {
        // EQUALS
        const a = parseParam(pMode[0], p[0]);
        const b = parseParam(pMode[1], p[1]);
        if (a === b) {
          this.memory[p[2]] = 1;
        } else {
          this.memory[p[2]] = 0;
        }
        ptr += 4;
      } else if (op === 99) {
        // HALT
        if (this.mode === computerMode.INTERACTIVE) {
          this.out("Program halted.");
        }
        running = false;
        break;
      } else {
        this.out(`Unexpected op code: ${op}`);
        this.out(` cmd => ${JSON.stringify(cmd, undefined)}`);
        this.out(` param => ${JSON.stringify(params, undefined)}`);
        running = false;
        break;
      }
    }
    if (this.mode === computerMode.INTERACTIVE) {
      this.input.placeholder = "";
      this.input.disabled = true;
      this.input.blur();
    }
  }
}
