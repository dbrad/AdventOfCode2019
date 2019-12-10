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
  // GET BEST ASTEROID.
  // GO THROUGH A LIST OF SORTED ANGLES WITH ASTEROIDS SORTED BY DISTANCE, REMOVE THE CLOSEST (ADD TO LIST?), MOVE ONTO THE NEXT ANGLE, REPEAT
  // ONCE YOU HIT LENGTH OF 200, REPORT OUTCOME
}

export function main(input) {
  return findBestAsteroid(input);
}
