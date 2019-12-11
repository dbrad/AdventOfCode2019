import { intcode } from "./intcode.js";
import { append } from "../lib/util.js";

export async function main(program) {
  const hull = [];
  const position = { x: 0, y: 0 };
  let minX = Number.MAX_SAFE_INTEGER;
  let maxX = Number.MIN_SAFE_INTEGER;
  let minY = Number.MAX_SAFE_INTEGER;
  let maxY = Number.MIN_SAFE_INTEGER;
  let orientation = 0;
  hull[0] = [];
  hull[0][0] = 1;

  const bodyOutput = [];
  const body = message => {
    bodyOutput.push(message);
    if (bodyOutput.length == 2) {
      let direction = bodyOutput.pop();
      let colour = bodyOutput.pop();

      // Paint the hull
      if (!hull[position.x]) {
        hull[position.x] = [];
      }
      hull[position.x][position.y] = colour;

      // Re-orient
      if (direction === 0) {
        orientation = (orientation + 3) % 4;
      } else {
        orientation = (orientation + 1) % 4;
      }

      // Move
      switch (orientation) {
        case 0:
          position.y--;
          break;
        case 1:
          position.x++;
          break;
        case 2:
          position.y++;
          break;
        case 3:
          position.x--;
          break;
      }

      if (position.x < minX) {
        minX = position.x;
      }
      if (position.x > maxX) {
        maxX = position.x;
      }
      if (position.y < minY) {
        minY = position.y;
      }
      if (position.y > maxY) {
        maxY = position.y;
      }

      // Input current panel colour back to brain
      brain.inputBuffer.push(hull[position.x] ? hull[position.x][position.y] || 0 : 0);
    }
  };

  const brain = new intcode(body);
  brain.load(program);
  brain.inputBuffer.push(1);
  await brain.run();

  const shiftedData = [];
  for (let x in hull) {
    for (let y in hull[x]) {
      if (!shiftedData[+x - minX]) {
        shiftedData[+x - minX] = [];
      }
      shiftedData[+x - minX][+y - minY] = hull[x][y];
    }
  }

  const w = maxX - minX + 1;
  const h = maxY - minY + 1;
  const $canvas = document.createElement("canvas");
  $canvas.width = w;
  $canvas.height = h;
  const ctx = $canvas.getContext("2d");
  const ctxImageData = ctx.createImageData(w, h);
  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) {
      const pixel = shiftedData[x] ? shiftedData[x][y] || 0 : 0;
      ctxImageData.data[x * 4 + y * 4 * w] = pixel * 255;
      ctxImageData.data[x * 4 + y * 4 * w + 1] = pixel * 255;
      ctxImageData.data[x * 4 + y * 4 * w + 2] = pixel * 255;
      ctxImageData.data[x * 4 + y * 4 * w + 3] = 255;
    }
  }
  ctx.putImageData(ctxImageData, 0, 0);
  append($canvas);
}
