import { intcode } from "./intcode.js";
import { append } from "../lib/util.js";

const tiles = {
  WALL: 0,
  FLOOR: 1,
  OXYGENSYSTEM: 2,
  DEADEND: 3,
  OXYGEN: 4
};

const direction = {
  NORTH: 1,
  SOUTH: 2,
  WEST: 3,
  EAST: 4
};

export async function main(program) {
  const droid = [0, 0];
  const map = [[1]];
  let input = 1;
  let oxygen = [0, 0];

  let minX = Number.MAX_SAFE_INTEGER;
  let maxX = Number.MIN_SAFE_INTEGER;
  let minY = Number.MAX_SAFE_INTEGER;
  let maxY = Number.MIN_SAFE_INTEGER;

  const $canvas = document.createElement("canvas");
  $canvas.width = 1;
  $canvas.height = 1;
  const ctx = $canvas.getContext("2d");
  append($canvas);

  const paintMap = (x, y, tile) => {
    if (!map[x]) {
      map[x] = [];
    }
    map[x][y] = tile;
  };

  const checkMap = (x, y) => {
    if (!map[x]) {
      map[x] = [];
    }
    return map[x][y];
  };

  const scanForMove = targetTile => {
    let tiles = [];
    for (const dir of [1, 4, 2, 3]) {
      let target = [...droid];
      switch (dir) {
        case direction.NORTH:
          target[1] += 1;
          break;
        case direction.SOUTH:
          target[1] -= 1;
          break;
        case direction.WEST:
          target[0] -= 1;
          break;
        case direction.EAST:
          target[0] += 1;
          break;
      }
      const tile = checkMap(target[0], target[1]);
      if (tile === targetTile) {
        tiles.push(dir);
      }
    }
    return tiles;
  };

  const floodOxygen = () => {
    const getNeighbors = (x, y) => {
      let neighbors = [];
      for (const dir of [1, 4, 2, 3]) {
        let target = [x, y];
        switch (dir) {
          case direction.NORTH:
            target[1] += 1;
            break;
          case direction.SOUTH:
            target[1] -= 1;
            break;
          case direction.WEST:
            target[0] -= 1;
            break;
          case direction.EAST:
            target[0] += 1;
            break;
        }
        const tile = checkMap(target[0], target[1]);
        if (tile === tiles.FLOOR || tile === tiles.DEADEND || tile === tiles.OXYGENSYSTEM) {
          neighbors.push([target[0], target[1]]);
        }
      }
      return neighbors;
    };

    let minutes = 0;
    let floodList = [];
    floodList.push(...getNeighbors(oxygen[0], oxygen[1]));

    while (floodList.length > 0) {
      minutes++;
      let next = [];
      for (const pt of floodList) {
        paintMap(pt[0], pt[1], tiles.OXYGEN);
        next.push(...getNeighbors(pt[0], pt[1]));
      }
      floodList = [...next];
    }

    return minutes;
  };

  const droidInputHanlder = message => {
    // Parse and handle the status report from the droid.
    const mapPos = [...droid];
    switch (input) {
      case direction.NORTH:
        mapPos[1]++;
        break;
      case direction.SOUTH:
        mapPos[1]--;
        break;
      case direction.WEST:
        mapPos[0]--;
        break;
      case direction.EAST:
        mapPos[0]++;
        break;
    }

    if (mapPos[0] > maxX) {
      maxX = mapPos[0];
    }
    if (mapPos[0] < minX) {
      minX = mapPos[0];
    }
    if (mapPos[1] > maxY) {
      maxY = mapPos[1];
    }
    if (mapPos[1] < minY) {
      minY = mapPos[1];
    }

    switch (+message) {
      case tiles.WALL:
        paintMap(mapPos[0], mapPos[1], tiles.WALL);
        break;
      case tiles.FLOOR:
        droid[0] = mapPos[0];
        droid[1] = mapPos[1];
        paintMap(mapPos[0], mapPos[1], tiles.FLOOR);
        break;
      case tiles.OXYGENSYSTEM:
        droid[0] = mapPos[0];
        droid[1] = mapPos[1];
        oxygen = [...droid];
        paintMap(mapPos[0], mapPos[1], tiles.OXYGENSYSTEM);
        // vm.mode = -1;
        break;
    }

    const emptyTiles = scanForMove(undefined);
    const floorTiles = scanForMove(tiles.FLOOR);
    const wallTiles = scanForMove(tiles.WALL);
    const deadTiles = scanForMove(tiles.DEADEND);

    if (wallTiles.length >= 4 || wallTiles.length + deadTiles.length >= 4) {
      paintMap(oxygen[0], oxygen[1], tiles.OXYGENSYSTEM);
      vm.mode = -1;
    } else if (wallTiles.length >= 3 || wallTiles.length + deadTiles.length >= 3) {
      paintMap(droid[0], droid[1], tiles.DEADEND);
    }

    if (emptyTiles.length !== 0) {
      input = emptyTiles[0];
    } else if (floorTiles.length !== 0) {
      input = floorTiles[0];
    }

    vm.inputBuffer.push(input);
  };

  const render = () => {
    const normalizedMap = [];
    for (let x in map) {
      for (let y in map[x]) {
        if (!normalizedMap[+x - minX]) {
          normalizedMap[+x - minX] = [];
        }
        normalizedMap[+x - minX][+y - minY] = map[x][y];
      }
    }

    const w = maxX - minX + 1;
    const h = maxY - minY + 1;
    $canvas.width = w;
    $canvas.height = h;
    const ctxImageData = ctx.getImageData(0, 0, w, h);
    let rgb = [0, 0, 0];
    for (let x = 0; x < w; x++) {
      for (let y = 0; y < h; y++) {
        switch (normalizedMap[x][y]) {
          case tiles.DEADEND:
            rgb = [255, 0, 0];
            break;
          case tiles.OXYGENSYSTEM:
            rgb = [0, 0, 255];
            break;
          case tiles.WALL:
            rgb = [255, 255, 255];
            break;
          case tiles.FLOOR:
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

  const vm = new intcode(droidInputHanlder);
  vm.load(program);
  vm.inputBuffer.push(input);
  window.requestAnimationFrame(render);
  await vm.run();

  return floodOxygen();
}
