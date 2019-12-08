function parseImage(rawImageData) {
  const imageData = [];
  let offset = 0;
  while (offset < rawImageData.length) {
    const layer = { counts: [], data: [] };
    for (let y = 0; y < 6; y++) {
      for (let x = 0; x < 25; x++) {
        const pixel = rawImageData[offset + x + y * 25];
        layer.counts[pixel] = (layer.counts[pixel] || 0) + 1;
        layer.data.push(pixel);
      }
    }
    imageData.push(layer);
    offset += 25 * 6;
  }
  return imageData;
}

export function main(input) {
  const imageData = parseImage(input);
  imageData.sort((a, b) => a.counts[0] - b.counts[0]);
  const leastZeroes = imageData[0];
  return leastZeroes.counts[1] * leastZeroes.counts[2];
}
