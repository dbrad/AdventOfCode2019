import { append } from "../lib/util.js";

function parseImage(rawImageData, w, h) {
  const imageData = [];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let offset = 0;
      while (offset < rawImageData.length) {
        const target = x + y * w;
        const source = offset + x + y * w;
        imageData[target] = rawImageData[source];
        if (imageData[target] === 0 || imageData[target] === 1) {
          break;
        }
        offset += w * h;
      }
    }
  }
  return imageData;
}

export function main(input) {
  const w = 25;
  const h = 6;
  const $canvas = document.createElement("canvas");
  $canvas.width = w;
  $canvas.height = h;
  $canvas.style.transform = "scale(2)";
  const ctx = $canvas.getContext("2d");
  const ctxImageData = ctx.createImageData(w, h);
  const imageData = parseImage(input, w, h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const pixel = imageData[x + y * w];
      ctxImageData.data[x * 4 + y * 4 * w] = pixel * 255;
      ctxImageData.data[x * 4 + y * 4 * w + 1] = pixel * 255;
      ctxImageData.data[x * 4 + y * 4 * w + 2] = pixel * 255;
      ctxImageData.data[x * 4 + y * 4 * w + 3] = 255;
    }
  }
  ctx.putImageData(ctxImageData, 0, 0);
  append($canvas);
}
