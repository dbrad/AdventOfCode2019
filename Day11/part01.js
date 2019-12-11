import { intcode } from "./intcode.js";
import { append } from "../lib/util.js";

export async function main(program) {
  const promises = [];
  const hull = [];
  const position = { x: 100, y: 100 };
  let maxY = 0;
  let orientation = 0;

  const brain = new intcode();
  brain.load(program);
  brain.inputBuffer.push(0);

  const body = async () => {
    const bodyInput = brain.outputBuffer;
    return new Promise(resolve => {
      window.setInterval(() => {
        if (brain.mode === -1) {
          return resolve();
        }

        if (bodyInput.length >= 2 && bodyInput.length % 2 === 0) {
          const direction = bodyInput.pop();
          const colour = bodyInput.pop();

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
              position.y++;
              break;
            case 1:
              position.x++;
              break;
            case 2:
              position.y--;
              break;
            case 3:
              position.x--;
              break;
          }
          if (position.y > maxY) {
            maxY = position.y;
          }

          // Input current panel colour back to brain
          brain.inputBuffer.push(hull[position.x] ? hull[position.x][position.y] || 0 : 0);
        }
      }, 0);
    });
  };

  promises.push(body());
  promises.push(brain.run());
  await Promise.all(promises);

  const w = hull.length;
  const h = maxY;
  const $canvas = document.createElement("canvas");
  $canvas.width = w;
  $canvas.height = h;
  const ctx = $canvas.getContext("2d");
  const ctxImageData = ctx.createImageData(w, h);
  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) {
      const pixel = hull[x] ? hull[x][y] || 0 : 0;
      ctxImageData.data[x * 4 + y * 4 * w] = pixel * 255;
      ctxImageData.data[x * 4 + y * 4 * w + 1] = pixel * 255;
      ctxImageData.data[x * 4 + y * 4 * w + 2] = pixel * 255;
      ctxImageData.data[x * 4 + y * 4 * w + 3] = 255;
    }
  }
  ctx.putImageData(ctxImageData, 0, 0);
  append($canvas);

  let count = 0;
  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) {
      if (hull[x]) {
        if (hull[x][y] === 0 || hull[x][y] === 1) {
          count++;
        }
      }
    }
  }
  return count;
}
