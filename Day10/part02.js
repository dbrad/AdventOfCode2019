function parseMap(input) {
  const asteroids = [];
  for (let y = 0; y < input.length; y++) {
    const mapRow = input[y].split("");
    mapRow.forEach((node, x) => {
      if (node === "#") {
        asteroids.push({ pos: { x, y }, angles: new Map() });
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

      let angle = Math.atan2(B.pos.y - A.pos.y, B.pos.x - A.pos.x) * (180 / Math.PI) + 90;
      if (angle < 0) {
        angle += 360;
      }
      if (!A.angles.has(angle)) {
        A.angles.set(angle, []);
      }
      A.angles.get(angle).push({ pos: B.pos, distance: Math.sqrt(Math.pow(B.pos.x - A.pos.x, 2) + Math.pow(B.pos.y - A.pos.y, 2)) });

      const reverseAngle = (angle + 180) % 360;
      if (!B.angles.has(reverseAngle)) {
        B.angles.set(reverseAngle, []);
      }
      B.angles.get(reverseAngle).push({ pos: A.pos, distance: Math.sqrt(Math.pow(A.pos.x - B.pos.x, 2) + Math.pow(A.pos.y - B.pos.y, 2)) });
    }
  }

  asteroids.sort((a, b) => {
    return b.angles.size - a.angles.size;
  });

  const sortedAsteroids = Array.from(asteroids[0].angles).sort((a, b) => {
    return a[0] - b[0];
  });

  sortedAsteroids.forEach(innerArray => {
    innerArray[1].sort((a, b) => {
      return b.distance - a.distance;
    });
  });

  const destroyedAsteroids = [];
  let index = 0;
  while (destroyedAsteroids.length < 200) {
    if (sortedAsteroids[index][1].length === 0) {
      index = (index + 1) % (sortedAsteroids.length - 1);
    }
    const asteroid = sortedAsteroids[index][1].pop();
    destroyedAsteroids.push(asteroid);
    index = (index + 1) % (sortedAsteroids.length - 1);
  }

  return destroyedAsteroids[199].pos.x * 100 + destroyedAsteroids[199].pos.y;
}

export function main(input) {
  return findBestAsteroid(input);
}
