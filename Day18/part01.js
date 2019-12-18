import { assertEquals } from "../lib/util.js";
import { NTree, NTreeNode } from "./ntree.js";

const direction = {
  NORTH: 1,
  SOUTH: 2,
  WEST: 3,
  EAST: 4,
};

/**
 * @param {number} index
 * @param {number} width
 * @returns {[number, number]}
 */
const indexToPos = (index, width) => {
  const y = ~~(index / width);
  const x = ~~(index % width);
  return [x, y];
};

/**
 * @param {[number, number]} pos
 * @param {number} width
 * @returns {number}
 */
const posToIndex = (pos, width) => {
  return pos[0] + pos[1] * width;
};

/**
 * @param {string} name
 * @param {string[]} maze
 * @returns {[number, number]}
 */
const findPosition = (name, maze, width) => {
  for (let i = 0; i < maze.length; i++) {
    if (maze[i] === name) {
      return indexToPos(i, width);
    }
  }
  return null;
};

/**
 * @param {string[]} input
 * @returns {[string[], number, Map<string, [number, number]>, Map<string, [number, number]>]}
 */
function parseMaze(input) {
  const maze = [];
  const width = input[0].length;
  for (const row of input) {
    maze.push(...row.split(""));
  }
  const keys = new Map();
  const doors = new Map();
  for (const key of "abcdefghijklmnopqrstuvwxyz") {
    const keyPos = findPosition(key, maze, width);
    if (keyPos) {
      keys.set(key, keyPos);
    }
    const doorPos = findPosition(key.toUpperCase(), maze, width);
    if (doorPos) {
      doors.set(key.toUpperCase(), doorPos);
    }
  }
  return [maze, width, keys, doors];
}

/**
 * @param {string[]} input
 * @return {Promise<number>}
 */
async function findShortestPath(input) {
  return new Promise((resolve, reject) => {
    window.setTimeout(() => {
      const [originalMaze, width, allKeys, allDoors] = parseMaze(input);

      // Create the NTree
      const root = new NTreeNode()
        .withName("@")
        .withPosition(findPosition("@", originalMaze, width))
        .withDistance(0);
      const tree = new NTree().withRootNode(root);

      /** @param {NTreeNode} parentNode */
      const floodFrom = parentNode => {
        // Copy the maze
        const maze = [...originalMaze];
        const updateMaze = (pos, val) => {
          maze[posToIndex(pos, width)] = val;
        };

        // Open all doors possible
        const keys = parentNode.keys;
        for (const key of keys) {
          const keyPos = allKeys.get(key);
          if (keyPos) {
            updateMaze(keyPos, ".");
          }
          const doorPos = allDoors.get(key.toUpperCase());
          if (doorPos) {
            updateMaze(doorPos, ".");
          }
        }

        let distance = 1;

        /**
         * @param {[number, number]} pos
         * @returns {[number, number][]}
         */
        const getNeighbors = pos => {
          let neighbors = [];
          for (const dir of [1, 2, 3, 4]) {
            /** @type {[number, number]} */
            const target = [pos[0], pos[1]];
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

            const tile = maze[posToIndex(target, width)];

            // If we find a key, add a node to the children and note the distance.
            if (Array.from(allKeys.keys()).includes(tile)) {
              const node = new NTreeNode()
                .withName(tile)
                .withPosition(target)
                .withDistance(distance);

              parentNode.addChild(node);
              neighbors.push(target);
            } else if (tile === "." || tile === "@") {
              neighbors.push(target);
            }
          }

          return neighbors;
        };

        let floodList = [];
        floodList.push(...getNeighbors(parentNode.pos));
        while (floodList.length > 0) {
          distance++;
          let next = [];
          for (const pt of floodList) {
            updateMaze(pt, "$");
            next.push(...getNeighbors(pt));
          }
          floodList = [...next];
        }
      };

      let depth = 0;
      let nodes = [tree.root];
      while (depth < allKeys.size) {
        for (const node of nodes) {
          floodFrom(node);
        }
        nodes = tree.getChildren(depth);
        if (depth > 10) {
          nodes.sort((a, b) => b.totalDistance - a.totalDistance);
          nodes = nodes.slice(0, Math.ceil(nodes.length - nodes.length / 4));
        }
        depth++;
      }

      nodes = tree.getChildren(depth - 1);
      let lowest = Number.MAX_SAFE_INTEGER;
      for (const node of nodes) {
        const total = node.totalDistance;
        if (total < lowest) {
          lowest = total;
        }
      }

      resolve(lowest);
    }, 0);
  });
}

export async function tests() {
  try {
    const maze01 = ["#########", "#b.A.@.a#", "#########"];
    assertEquals(await findShortestPath(maze01), 8);

    const maze02 = ["########################", "#f.D.E.e.C.b.A.@.a.B.c.#", "######################.#", "#d.....................#", "########################"];
    assertEquals(await findShortestPath(maze02), 86);

    const maze03 = ["########################", "#...............b.C.D.f#", "#.######################", "#.....@.a.B.c.d.A.e.F.g#", "########################"];
    assertEquals(await findShortestPath(maze03), 132);

    const maze04 = ["#################", "#i.G..c...e..H.p#", "########.########", "#j.A..b...f..D.o#", "########@########", "#k.E..a...g..B.n#", "########.########", "#l.F..d...h..C.m#", "#################"];
    // assertEquals(await findShortestPath(maze04), 136);

    const maze05 = ["########################", "#@..............ac.GI.b#", "###d#e#f################", "###A#B#C################", "###g#h#i################", "########################"];
    assertEquals(await findShortestPath(maze05), 81);
  } catch (err) {
    console.error(err);
  }
}

export async function main(input) {
  return await findShortestPath(input);
}
