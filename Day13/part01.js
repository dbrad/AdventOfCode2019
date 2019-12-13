import { intcode } from "./intcode.js";
import { append } from "../lib/util.js";

export async function main(program) {
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
          case 4:
            // BALL
            rgb = [255, 0, 0];
            break;
          case 3:
            // PADDLE
            rgb = [0, 255, 0];
            break;
          case 2:
            // BLOCK
            rgb = [0, 0, 255];
            break;
          case 1:
            // WALL
            rgb = [255, 255, 255];
            break;
          case 0:
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
  };
  const vm = new intcode(arcadeInputHandle);
  vm.load(program);
  await vm.run();
  render();

  return screen.flat().reduce((acc, val) => (val === 2 ? ++acc : acc), 0);
}
