import { assertEquals } from "../lib/util.js";

function parseInput(input) {
  const formulas = new Map();
  for (const formula of input) {
    const [ingredientsRaw, outputRaw] = formula.split("=>");
    const [outputCount, outputName] = outputRaw.trim().split(" ");
    const ingredients = ingredientsRaw.split(",").map(s => s.trim());
    const ingredientsMap = new Map();
    for (const ingredient of ingredients) {
      const [count, name] = ingredient.split(" ");
      ingredientsMap.set(name, count);
    }
    formulas.set(outputName, { outputCount, ingredients: ingredientsMap });
  }
  return formulas;
}

function resolveMaterial(requiredName, requiredCount, formulas, inventory) {
  const result = new Map();
  const formula = formulas.get(requiredName);
  const outputCount = formula.outputCount;

  if (inventory.has(requiredName)) {
    const stock = inventory.get(requiredName);
    if (requiredCount >= stock) {
      // if the required amount is greater than or equal to the stock, use it up.
      requiredCount -= stock;
      inventory.delete(requiredName);
    } else {
      // if we have more than we need, we are done, decrease the stock by the amount used and move on.
      inventory.set(requiredName, stock - requiredCount);
      requiredCount = 0;
      return result;
    }
  }
  const batchesNeeded = Math.ceil(requiredCount / outputCount);

  const ingredients = formula.ingredients;
  for (const [ingredientName, ingredientCount] of ingredients) {
    result.set(ingredientName, ingredientCount * batchesNeeded);
  }

  if (outputCount * batchesNeeded > requiredCount) {
    const count = inventory.get(requiredName) || 0;
    inventory.set(requiredName, count + outputCount * batchesNeeded - requiredCount);
  }
  return result;
}

function calculateFuelCost(input) {
  const formulas = parseInput(input);
  const requiredMaterials = new Map();
  const inventory = new Map();
  requiredMaterials.set("FUEL", 1);

  while (!(requiredMaterials.has("ORE") && requiredMaterials.size === 1)) {
    for (const [name, count] of requiredMaterials) {
      if (name === "ORE") {
        continue;
      }
      const newMaterials = resolveMaterial(name, count, formulas, inventory);
      requiredMaterials.delete(name);

      for (const [ingredientName, ingredientCount] of newMaterials) {
        let c = requiredMaterials.get(ingredientName) || 0;
        c += ingredientCount;
        requiredMaterials.set(ingredientName, c);
      }
    }
  }
  return requiredMaterials.get("ORE");
}

export function tests() {
  const input01 = ["10 ORE => 10 A", "1 ORE => 1 B", "7 A, 1 B => 1 C", "7 A, 1 C => 1 D", "7 A, 1 D => 1 E", "7 A, 1 E => 1 FUEL"];
  assertEquals(calculateFuelCost(input01), 31);

  const input02 = ["9 ORE => 2 A", "8 ORE => 3 B", "7 ORE => 5 C", "3 A, 4 B => 1 AB", "5 B, 7 C => 1 BC", "4 C, 1 A => 1 CA", "2 AB, 3 BC, 4 CA => 1 FUEL"];
  assertEquals(calculateFuelCost(input02), 165);

  const input03 = ["157 ORE => 5 NZVS", "165 ORE => 6 DCFZ", "44 XJWVT, 5 KHKGT, 1 QDVJ, 29 NZVS, 9 GPVTF, 48 HKGWZ => 1 FUEL", "12 HKGWZ, 1 GPVTF, 8 PSHF => 9 QDVJ", "179 ORE => 7 PSHF", "177 ORE => 5 HKGWZ", "7 DCFZ, 7 PSHF => 2 XJWVT", "165 ORE => 2 GPVTF", "3 DCFZ, 7 NZVS, 5 HKGWZ, 10 PSHF => 8 KHKGT"];
  assertEquals(calculateFuelCost(input03), 13312);

  const input04 = ["2 VPVL, 7 FWMGM, 2 CXFTF, 11 MNCFX => 1 STKFG", "17 NVRVD, 3 JNWZP => 8 VPVL", "53 STKFG, 6 MNCFX, 46 VJHF, 81 HVMC, 68 CXFTF, 25 GNMV => 1 FUEL", "22 VJHF, 37 MNCFX => 5 FWMGM", "139 ORE => 4 NVRVD", "144 ORE => 7 JNWZP", "5 MNCFX, 7 RFSQX, 2 FWMGM, 2 VPVL, 19 CXFTF => 3 HVMC", "5 VJHF, 7 MNCFX, 9 VPVL, 37 CXFTF => 6 GNMV", "145 ORE => 6 MNCFX", "1 NVRVD => 8 CXFTF", "1 VJHF, 6 MNCFX => 4 RFSQX", "176 ORE => 6 VJHF"];
  assertEquals(calculateFuelCost(input04), 180697);

  const input05 = ["171 ORE => 8 CNZTR", "7 ZLQW, 3 BMBT, 9 XCVML, 26 XMNCP, 1 WPTQ, 2 MZWV, 1 RJRHP => 4 PLWSL", "114 ORE => 4 BHXH", "14 VRPVC => 6 BMBT", "6 BHXH, 18 KTJDG, 12 WPTQ, 7 PLWSL, 31 FHTLT, 37 ZDVW => 1 FUEL", "6 WPTQ, 2 BMBT, 8 ZLQW, 18 KTJDG, 1 XMNCP, 6 MZWV, 1 RJRHP => 6 FHTLT", "15 XDBXC, 2 LTCX, 1 VRPVC => 6 ZLQW", "13 WPTQ, 10 LTCX, 3 RJRHP, 14 XMNCP, 2 MZWV, 1 ZLQW => 1 ZDVW", "5 BMBT => 4 WPTQ", "189 ORE => 9 KTJDG", "1 MZWV, 17 XDBXC, 3 XCVML => 2 XMNCP", "12 VRPVC, 27 CNZTR => 2 XDBXC", "15 KTJDG, 12 BHXH => 5 XCVML", "3 BHXH, 2 VRPVC => 7 MZWV", "121 ORE => 7 VRPVC", "7 XCVML => 6 RJRHP", "5 BHXH, 4 VRPVC => 5 LTCX"];
  assertEquals(calculateFuelCost(input05), 2210736);
}

export function main(input) {
  return calculateFuelCost(input);
}
