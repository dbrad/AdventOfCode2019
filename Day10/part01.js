import { assertEquals } from "../lib/util.js";

function parseMap(input) {
  const asteroids = [];
  for (let y = 0; y < input.length; y++) {
    const mapRow = input[y].split("");
    mapRow.forEach((node, x) => {
      if (node === "#") {
        asteroids.push({ pos: { x, y }, angles: new Set() });
      }
    });
  }
  return asteroids;
}

function findBestAsteroid(input) {
  const asteroids = parseMap(input);
  for (let i = 0, len = asteroids.length; i < len; i++) {
    for (let j = i + 1; j < len; j++) {
      const A = asteroids[i];
      const B = asteroids[j];
      const angle = (Math.atan2(A.pos.y - B.pos.y, A.pos.x - B.pos.x) * 180) / Math.PI;
      A.angles.add(angle);
      const reverseAngle = (angle + 180) % 360;
      B.angles.add(reverseAngle);
    }
  }
  asteroids.sort((a, b) => {
    return b.angles.size - a.angles.size;
  });
  return asteroids[0].angles.size;
}

export function tests() {
  assertEquals(findBestAsteroid([".#..#", ".....", "#####", "....#", "...##"]), 8);
  assertEquals(findBestAsteroid(["......#.#.", "#..#.#....", "..#######.", ".#.#.###..", ".#..#.....", "..#....#.#", "#..#....#.", ".##.#..###", "##...#..#.", ".#....####"]), 33);
  assertEquals(findBestAsteroid(["#.#...#.#.", ".###....#.", ".#....#...", "##.#.#.#.#", "....#.#.#.", ".##..###.#", "..#...##..", "..##....##", "......#...", ".####.###."]), 35);
  assertEquals(findBestAsteroid([".#..#..###", "####.###.#", "....###.#.", "..###.##.#", "##.##.#.#.", "....###..#", "..#.#..#.#", "#..#.#.###", ".##...##.#", ".....#.#.."]), 41);
  assertEquals(findBestAsteroid([".#..##.###...#######", "##.############..##.", ".#.######.########.#", ".###.#######.####.#.", "#####.##.#.##.###.##", "..#####..#.#########", "####################", "#.####....###.#.#.##", "##.#################", "#####.##.###..####..", "..######..##.#######", "####.##.####...##..#", ".#####..#.######.###", "##...#.##########...", "#.##########.#######", ".####.#.###.###.#.##", "....##.##.###..#####", ".#.#.###########.###", "#.#.#.#####.####.###", "###.##.####.##.#..##"]), 210);
}

export function main(input) {
  return findBestAsteroid(input);
}
