import { append } from "../lib/util.js";

const parameterModes = {
  POSITION: 0,
  IMMEDIATE: 1,
  RELATIVE: 2
};

const computerMode = {
  HALTED: -1,
  BACKGROUND: 0,
  INTERACTIVE: 1
};

export class intcode {
  constructor(outputCallback = null) {
    this.acceptingInput = false;
    this.inputBuffer = [];
    this.outputBuffer = [];
    this.mode = computerMode.BACKGROUND;
    this.outputCallback = outputCallback;
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

  out(message, intOutput = false) {
    if (intOutput) {
      if (this.outputCallback) {
        this.outputCallback(message);
      } else {
        this.outputBuffer.push(message);
      }
    }
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
        if (this.mode === computerMode.INTERACTIVE) {
          this.out(`> ${value}`);
        }
        window.clearInterval(handle);
        resolve(value);
      }, 0);
    });
  }

  async run() {
    try {
      if (this.mode === computerMode.INTERACTIVE) {
        this.out("Running program...");
      }
      let running = true;
      let ptr = 0;
      let relativeBase = 0;

      const parseParam = (pMode, p) => {
        switch (pMode) {
          case parameterModes.POSITION:
            return this.memory[p] || 0;
          case parameterModes.IMMEDIATE:
            return p;
          case parameterModes.RELATIVE:
            return this.memory[relativeBase + p] || 0;
          default:
            running = false;
            throw new Error(`Invalid Parameter Mode: ${pMode}`);
        }
      };

      const writeMemory = (pMode, p, value) => {
        switch (pMode) {
          case parameterModes.POSITION:
            this.memory[p] = value;
            break;
          case parameterModes.IMMEDIATE:
            running = false;
            throw new Error(`Cannot write in Immediate Mode`);
          case parameterModes.RELATIVE:
            this.memory[relativeBase + p] = value;
            break;
          default:
            running = false;
            throw new Error(`Invalid Parameter Mode: ${pMode}`);
        }
      };

      while (running && this.mode !== computerMode.HALTED) {
        const cmd = ("" + this.memory[ptr])
          .split("")
          .map(val => parseInt(val, 10))
          .reverse();
        const op = cmd[0] + (cmd[1] || 0) * 10;
        const pMode = [cmd[2] || 0, cmd[3] || 0, cmd[4] || 0];
        const p = [this.memory[ptr + 1] || 0, this.memory[ptr + 2] || 0, this.memory[ptr + 3] || 0];

        if (op === 1) {
          // ADD
          const a = parseParam(pMode[0], p[0]);
          const b = parseParam(pMode[1], p[1]);
          writeMemory(pMode[2], p[2], a + b);
          ptr += 4;
        } else if (op === 2) {
          // MULTIPLY
          const a = parseParam(pMode[0], p[0]);
          const b = parseParam(pMode[1], p[1]);
          writeMemory(pMode[2], p[2], a * b);
          ptr += 4;
        } else if (op === 3) {
          // IN
          const value = await this.in();
          writeMemory(pMode[0], p[0], parseInt(value, 10));
          ptr += 2;
        } else if (op === 4) {
          // OUT
          const value = parseParam(pMode[0], p[0]);
          this.out(+value, true);
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
            writeMemory(pMode[2], p[2], 1);
          } else {
            writeMemory(pMode[2], p[2], 0);
          }
          ptr += 4;
        } else if (op === 8) {
          // EQUALS
          const a = parseParam(pMode[0], p[0]);
          const b = parseParam(pMode[1], p[1]);
          if (a === b) {
            writeMemory(pMode[2], p[2], 1);
          } else {
            writeMemory(pMode[2], p[2], 0);
          }
          ptr += 4;
        } else if (op === 9) {
          // RELATIVE BASE OFFSET
          const value = parseParam(pMode[0], p[0]);
          relativeBase += value;
          ptr += 2;
        } else if (op === 99) {
          // HALT
          if (this.mode === computerMode.INTERACTIVE) {
            this.out("Program halted.");
          }
          running = false;
          break;
        } else {
          running = false;
          throw new Error(`Unexpected op code: ${op}`);
        }
      }
    } catch (err) {
      if (this.mode === computerMode.INTERACTIVE) {
        this.out(err.message);
      } else {
        console.error(err.message);
      }
    }
    if (this.mode === computerMode.INTERACTIVE) {
      this.input.placeholder = "";
      this.input.disabled = true;
      this.input.blur();
    }
    this.mode = computerMode.HALTED;
  }
}
