import { intcode } from "./intcode.js";
import { write } from "../lib/util.js";

export async function main(program) {
  const cameraFeed = [];
  const scaffoldLoc = [];
  let row = 0;
  let rowStr = "";
  let column = 0;

  const countNeighborScaffolds = (x, y) => {
    const north = cameraFeed[y - 1] ? (cameraFeed[y - 1][x] === "#" ? 1 : 0) : 0;
    const south = cameraFeed[y + 1] ? (cameraFeed[y + 1][x] === "#" ? 1 : 0) : 0;
    const west = cameraFeed[y][x - 1] === "#" ? 1 : 0;
    const east = cameraFeed[y][x + 1] === "#" ? 1 : 0;
    return north + south + west + east;
  };

  const findIntersections = () => {
    const intersections = [];
    for (const [x, y] of scaffoldLoc) {
      if (countNeighborScaffolds(x, y) === 4) {
        intersections.push([x, y]);
      }
    }
    return intersections;
  };

  const calculateChecksum = intersections => {
    let checksum = 0;
    for (const [x, y] of intersections) {
      checksum += x * y;
    }
    return checksum;
  };

  const cameraInputHandler = message => {
    if (message === 10) {
      cameraFeed[row] = rowStr.split("");
      rowStr = "";
      column = 0;
      row++;
      return;
    }
    const char = String.fromCharCode(message);
    if (char === "#") {
      scaffoldLoc.push([column, row]);
    }
    rowStr += char;
    column++;
  };

  const vm = new intcode(cameraInputHandler);
  vm.load(program);
  await vm.run();

  const intersections = findIntersections();
  const checksum = calculateChecksum(intersections);

  for (const row of cameraFeed) {
    write(row.join(""));
  }

  return checksum;
}
