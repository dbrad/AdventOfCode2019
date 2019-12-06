import { assertEquals, write } from "../lib/util.js";

function parseNodes(map) {
  const nodes = new Map();
  nodes.set("COM", null);
  for (const relationship of map) {
    const [parent, child] = relationship.split(")");
    nodes.set(child, parent);
  }

  const routes = new Map();
  for (let [node, parent] of nodes) {
    const route = [];
    while (parent) {
      route.push(parent);
      parent = nodes.get(parent);
    }
    if (route.length > 0) {
      routes.set(node, route);
    }
  }

  return routes;
}

function calculateJumps(map) {
  const routes = parseNodes(map);
  const you = routes.get("YOU");
  const santa = routes.get("SAN");

  const $you = you.filter(value => !santa.includes(value));
  const $santa = santa.filter(value => !you.includes(value));

  return $you.length + $santa.length;
}

export function tests() {
  assertEquals(calculateJumps(["COM)B", "B)C", "C)D", "D)E", "E)F", "B)G", "G)H", "D)I", "E)J", "J)K", "K)L", "K)YOU", "I)SAN"]), 4);
}

export function main(input) {
  return calculateJumps(input);
}
