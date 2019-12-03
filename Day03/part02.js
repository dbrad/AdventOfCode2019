import { assertEquals } from "../lib/util.js";

function mapWire(wire) {
  const wireMap = new Map();
  let distance = 0;
  let currentCoord = { x: 0, y: 0 };
  for (const direction of wire) {
    const parsedDir = { direction: direction.substr(0, 1), distance: direction.substr(1) };
    for (let i = 0; i < parsedDir.distance; i++) {
      switch (parsedDir.direction) {
        case "U":
          currentCoord.y += 1;
          break;
        case "D":
          currentCoord.y -= 1;
          break;
        case "L":
          currentCoord.x -= 1;
          break;
        case "R":
          currentCoord.x += 1;
          break;
      }
      const key = `${currentCoord.x},${currentCoord.y}`;
      distance++;
      if (!wireMap.has(key)) {
        wireMap.set(key, distance);
      }
    }
  }
  return wireMap;
}

function traceWires(rawWire01, rawWire02) {
  const wireMap01 = mapWire(rawWire01.split(","));
  const wireMap02 = mapWire(rawWire02.split(","));

  let lowest = Number.MAX_SAFE_INTEGER;
  for (const [key, value] of wireMap01) {
    if (wireMap02.has(key)) {
      const totalDistance = value + wireMap02.get(key);
      if (totalDistance < lowest) {
        lowest = totalDistance;
      }
    }
  }
  return lowest;
}

export function tests() {
  const testWires01 = ["R75,D30,R83,U83,L12,D49,R71,U7,L72", "U62,R66,U55,R34,D71,R55,D58,R83"];
  assertEquals(traceWires(testWires01[0], testWires01[1]), 610, "traceWires(..., ...)");

  const testWires02 = ["R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51", "U98,R91,D20,R16,D67,R40,U7,R15,U6,R7"];
  assertEquals(traceWires(testWires02[0], testWires02[1]), 410, "traceWires(..., ...)");
}

export function main(input) {
  return traceWires(input[0], input[1]);
}
