import { write, assertEquals } from "../lib/util.js";

function parseInput(input) {
  const moons = [];
  for (const moonData of input) {
    const rawAxis = moonData.split(",");
    const axis = rawAxis.map(string => {
      let result = "";
      for (const c of string) {
        if (!isNaN(c) || c === "-") {
          result += c;
        }
      }
      return parseInt(result, 10);
    });
    const moon = { pos: { x: BigInt(axis[0]), y: BigInt(axis[1]), z: BigInt(axis[2]) }, vel: { x: 0n, y: 0n, z: 0n } };
    moons.push(moon);
  }
  return moons;
}

function abs(bigInt) {
  if (bigInt < 0) {
    bigInt *= -1n;
  }
  return bigInt;
}

function gcd(a, b) {
  a = abs(a);
  b = abs(b);
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
}

function lcm(...args) {
  if (args.length === 2) {
    return ~~(abs(args[0] * args[1]) / gcd(args[0], args[1]));
  } else {
    return lcm(args[0], lcm(...args.slice(1)));
  }
}

function applyGravity(moonA, moonB) {
  for (const axis of "xyz") {
    if (moonA.pos[axis] < moonB.pos[axis]) {
      moonA.vel[axis]++;
      moonB.vel[axis]--;
    } else if (moonA.pos[axis] > moonB.pos[axis]) {
      moonA.vel[axis]--;
      moonB.vel[axis]++;
    }
  }
}

function applyVelocity(moon) {
  for (const axis of "xyz") {
    moon.pos[axis] += moon.vel[axis];
  }
}

function simulateMoons(moons) {
  for (let a = 0, len = moons.length; a < len; a++) {
    for (let b = a + 1; b < len; b++) {
      applyGravity(moons[a], moons[b]);
    }
  }
  for (const moon of moons) {
    applyVelocity(moon);
  }
  return moons;
}

function compareMoons(moonsA, moonsB, axis) {
  let result = true;
  for (let i = 0, len = moonsA.length; i < len; i++) {
    result = result && moonsA[i].pos[axis] === moonsB[i].pos[axis];
    result = result && moonsA[i].vel[axis] === 0n;
  }
  return result;
}

function findCollisions(input) {
  let steps = 0n;
  const initial = parseInput(input);
  const moons = parseInput(input);
  let lowest = { x: 0n, y: 0n, z: 0n };

  while (!(lowest.x && lowest.y && lowest.z)) {
    steps += 1n;
    simulateMoons(moons);
    for (const axis of "xyz") {
      if (!lowest[axis] && compareMoons(moons, initial, axis)) {
        lowest[axis] = steps;
      }
    }
  }
  return lcm(lowest.x, lowest.y, lowest.z);
}

BigInt.prototype.toJSON = function() {
  return this.toString();
};

export function tests() {
  assertEquals(findCollisions(["<x=-1, y=0, z=2>", "<x=2, y=-10, z=-7>", "<x=4, y=-8, z=8>", "<x=3, y=5, z=-1>"]), 2772n);
  assertEquals(findCollisions(["<x=-8, y=-10, z=0>", "<x=5, y=5, z=10>", "<x=2, y=-7, z=3>", "<x=9, y=-8, z=-3>"]), 4686774924n);
}

export function main(input) {
  return findCollisions(input);
}
