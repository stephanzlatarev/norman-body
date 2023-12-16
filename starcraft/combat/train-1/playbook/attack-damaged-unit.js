import Generator from "./js/generator.js";
import Feature from "./js/feature.js";
import format from "./js/formatter.js";
import { withinContactDistance, outsideCloseDistance } from "./js/constraints.js";

const UNIT = {
  x: [-10, 10],
  y: [-10, 10],
  radius: [0.1, 1],
  speed: [0.1, 0.2],
  health: [1, 500],
  damage: [0.1, 10],
  range: [0.1, 10],
  cooldown: [0, 20]
};
const WARRIOR = { ...UNIT, x: 0, y: 0, cooldown: 0 };
const TARGET = { ...UNIT, x: [-1, 1], y: [-1, 1], health: [1, 149] };
const HEALTHY = { ...UNIT, x: [-1, 1], y: [-1, 1], health: [150, 500] };

export default function() {
  const generator = new Generator()
    .add(new Feature("Warrior", 1, WARRIOR, []))
    .add(new Feature("Target", 1, TARGET, [withinContactDistance]))
    .add(new Feature("Close Enemy", [0, 2], HEALTHY, [withinContactDistance]))
    .add(new Feature("Far Enemy", [0, 3], UNIT, [outsideCloseDistance]))
    .add(new Feature("Support", [0, 5], UNIT, [outsideCloseDistance]));

  const mapping = {
    Warrior: ["Warrior"],
    Warriors: ["Support"],
    Enemies: ["Close Enemy", "Far Enemy", "Target"],
    Target: ["Target"],
  };

  return format(generator.generate(), mapping);
}
