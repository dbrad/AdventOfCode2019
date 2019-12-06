import { assertEquals } from "../lib/util.js";

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

  let checksum = 0;
  for (const [source, route] of routes) {
    checksum += route.length;
  }
  return checksum;
}

export function tests() {
  assertEquals(parseNodes(["COM)B", "B)C", "C)D", "D)E", "E)F", "B)G", "G)H", "D)I", "E)J", "J)K", "K)L"]), 42);
}

export function main(input) {
  return parseNodes(input);
}
