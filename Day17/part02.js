import { intcode } from "./intcode.js";
import { write } from "../lib/util.js";

const direction = {
  NORTH: 0,
  EAST: 1,
  SOUTH: 2,
  WEST: 3,
};

const tiles = {
  SCAFFOLD: "#",
  SPACE: ".",
  CLEANED: "@",
  ROBOT_N: "^",
  ROBOT_E: ">",
  ROBOT_S: "v",
  ROBOT_W: "<",
};

const cameraFeed = [];
let robotDir = 0;
let robotPos = [0, 0];
let row = 0;
let column = 0;
let rowStr = "";

export async function main(program) {
  const cameraInputHandler = message => {
    if (message === 10) {
      cameraFeed[row] = rowStr.split("");
      rowStr = "";
      row++;
      column = 0;
      return;
    }
    const char = String.fromCharCode(message);
    if (char === tiles.ROBOT_N) {
      robotPos = [column, row];
    }
    rowStr += char;
    column++;
  };

  const mapBuilder = new intcode(cameraInputHandler);
  mapBuilder.load(program);
  await mapBuilder.run();

  const rawRoute = [];
  let forwardMoves = 0;

  const turn = heading => {
    if (forwardMoves !== 0) {
      rawRoute.push(forwardMoves);
      forwardMoves = 0;
    }
    const diff = heading - robotDir;
    robotDir = heading;
    if (diff === 1 || diff === -3) {
      rawRoute.push("R");
    } else {
      rawRoute.push("L");
    }
  };

  const forward = () => {
    cameraFeed[robotPos[1]][robotPos[0]] = tiles.CLEANED;
    if (robotDir === direction.NORTH) {
      robotPos[1] -= 1;
    } else if (robotDir === direction.SOUTH) {
      robotPos[1] += 1;
    } else if (robotDir === direction.EAST) {
      robotPos[0] += 1;
    } else if (robotDir === direction.WEST) {
      robotPos[0] -= 1;
    }
    forwardMoves++;
  };

  const checkDirection = dir => {
    if (dir === direction.NORTH) {
      return cameraFeed[robotPos[1] - 1] ? cameraFeed[robotPos[1] - 1][robotPos[0]] : ".";
    } else if (dir === direction.SOUTH) {
      return cameraFeed[robotPos[1] + 1] ? cameraFeed[robotPos[1] + 1][robotPos[0]] : ".";
    } else if (dir === direction.EAST) {
      return cameraFeed[robotPos[1]][robotPos[0] + 1] || ".";
    } else if (dir === direction.WEST) {
      return cameraFeed[robotPos[1]][robotPos[0] - 1] || ".";
    }
  };

  const checkTurn = () => {
    const leftDir = (robotDir + 3) % 4;
    const rightDir = (robotDir + 1) % 4;

    const left = checkDirection(leftDir);
    const right = checkDirection(rightDir);
    if (left === tiles.SCAFFOLD || left === tiles.CLEANED) {
      return leftDir;
    } else if (right === tiles.SCAFFOLD || right === tiles.CLEANED) {
      return rightDir;
    }
    rawRoute.push(forwardMoves);
    return -1;
  };

  const buildRoute = () => {
    while (true) {
      if (!(checkDirection(robotDir) === tiles.SCAFFOLD || checkDirection(robotDir) === tiles.CLEANED)) {
        const heading = checkTurn();
        if (heading === -1) {
          break;
        }
        turn(heading);
      } else {
        forward();
      }
    }
  };
  try {
    buildRoute();
  } catch (err) {
    console.error(err);
  } finally {
    write(JSON.stringify(robotPos, undefined, 0));
    write(JSON.stringify(robotDir, undefined, 0));
    write(JSON.stringify(rawRoute, undefined, 0));
  }
  for (const row of cameraFeed) {
    write(row.join(""));
  }

  // ["R", 10, "L", 8, "R", 10, "R", 4, "L", 6, "L", 6, "R", 10, "R", 10, "L", 8, "R", 10, "R", 4, "L", 6, "R", 12, "R", 12, "R", 10, "L", 6, "L", 6, "R", 10, "L", 6, "R", 12, "R", 12, "R", 10, "R", 10, "L", 8, "R", 10, "R", 4, "L", 6, "L", 6, "R", 10, "R", 10, "L", 8, "R", 10, "R", 4, "L", 6, "R", 12, "R", 12, "R", 10];
  // A: ["R",10,"L",8,"R",10,"R",4]
  // B: ["L",6,"L",6,"R",10]
  // C: ["L",6,"R",12,"R",12,"R",10]
  // MAIN: [A,B,A,C,B,C,A,B,A,C]

  const asciiToInt = values => {
    "".charCodeAt();
  };

  const fnMain = "A,B,A,C,B,C,A,B,A,C";
  const fnA = "R,10,L,8,R,10,R,4";
  const fnB = "L,6,L,6,R,10";
  const fnC = "L,6,R,12,R,12,R,10";
  // const navigator = new intcode();
  // navigator.load(program);
  // await navigator.run();
}
