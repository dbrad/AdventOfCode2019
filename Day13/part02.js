import { intcode } from "./intcode.js";
import { append } from "../lib/util.js";

const tiles = {
  EMPTY: 0,
  WALL: 1,
  BLOCK: 2,
  PADDLE: 3,
  BALL: 4,
};

export async function main(program) {
  let score = 0;
  const ball = [0, 0];
  const player = [0, 0];
  const screenDim = [0, 0];
  const arcadeInput = [];
  const screen = [];

  const $canvas = document.createElement("canvas");
  $canvas.width = screenDim[0];
  $canvas.height = screenDim[1];
  const ctx = $canvas.getContext("2d");
  append($canvas);

  const arcadeInputHandle = message => {
    arcadeInput.push(message);
    if (arcadeInput.length === 3) {
      const tileId = arcadeInput.pop();
      const y = arcadeInput.pop();
      const x = arcadeInput.pop();
      if (x === -1 && y === 0) {
        score = tileId;
      }

      if (!screen[x]) {
        screen[x] = [];
      }
      screen[x][y] = tileId;
      if (x > screenDim[0]) {
        screenDim[0] = x + 1;
        $canvas.width = screenDim[0];
      }
      if (y > screenDim[1]) {
        screenDim[1] = y + 1;
        $canvas.height = screenDim[1];
      }

      if (tileId === tiles.BALL) {
        ball[0] = x;
        ball[1] = y;
      } else if (tileId === tiles.PADDLE) {
        player[0] = x;
        player[1] = y;
      }

      if (ball[0] > player[0]) {
        vm.inputBuffer[0] = 1;
      } else if (ball[0] < player[0]) {
        vm.inputBuffer[0] = -1;
      } else {
        vm.inputBuffer[0] = 0;
      }
    }
  };

  const render = () => {
    const w = screenDim[0];
    const h = screenDim[1];
    const ctxImageData = ctx.getImageData(0, 0, screenDim[0], screenDim[1]);
    let rgb = [0, 0, 0];
    for (let x = 0; x < w; x++) {
      for (let y = 0; y < h; y++) {
        switch (screen[x][y]) {
          case tiles.BALL:
            // BALL
            rgb = [255, 0, 0];
            break;
          case tiles.PADDLE:
            // PADDLE
            rgb = [0, 255, 0];
            break;
          case tiles.BLOCK:
            // BLOCK
            rgb = [0, 0, 255];
            break;
          case tiles.WALL:
            // WALL
            rgb = [255, 255, 255];
            break;
          case tiles.EMPTY:
          default:
            rgb = [0, 0, 0];
            break;
        }
        ctxImageData.data[x * 4 + y * 4 * w] = rgb[0];
        ctxImageData.data[x * 4 + y * 4 * w + 1] = rgb[1];
        ctxImageData.data[x * 4 + y * 4 * w + 2] = rgb[2];
        ctxImageData.data[x * 4 + y * 4 * w + 3] = 255;
      }
    }
    ctx.putImageData(ctxImageData, 0, 0);
    window.requestAnimationFrame(render);
  };

  const vm = new intcode(arcadeInputHandle);
  vm.load(program);
  vm.memory[0] = 2;
  window.requestAnimationFrame(render);
  await vm.run();

  return score;
}
