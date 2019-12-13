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
    const moon = { pos: { x: axis[0], y: axis[1], z: axis[2] }, vel: { x: 0, y: 0, z: 0 } };
    moons.push(moon);
  }
  return moons;
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

function simulateMoons(input, steps) {
  const moons = parseInput(input);
  for (let step = 0; step < steps; step++) {
    for (let a = 0, len = moons.length; a < len; a++) {
      for (let b = a + 1; b < len; b++) {
        applyGravity(moons[a], moons[b]);
      }
    }
    for (const moon of moons) {
      applyVelocity(moon);
    }
  }

  return moons;
}

function calculateTotalEnergy(input, steps) {
  const moons = simulateMoons(input, steps);
  let totalEnergy = 0;
  for (const moon of moons) {
    let potentialEnergy = Math.abs(moon.pos.x) + Math.abs(moon.pos.y) + Math.abs(moon.pos.z);
    let kineticEnergy = Math.abs(moon.vel.x) + Math.abs(moon.vel.y) + Math.abs(moon.vel.z);
    totalEnergy += potentialEnergy * kineticEnergy;
  }
  return totalEnergy;
}

export function tests() {
  assertEquals(calculateTotalEnergy(["<x=-1, y=0, z=2>", "<x=2, y=-10, z=-7>", "<x=4, y=-8, z=8>", "<x=3, y=5, z=-1>"], 10), 179);
  assertEquals(calculateTotalEnergy(["<x=-8, y=-10, z=0>", "<x=5, y=5, z=10>", "<x=2, y=-7, z=3>", "<x=9, y=-8, z=-3>"], 100), 1940);
}

export function main(input) {
  return calculateTotalEnergy(input, 1000);
}
