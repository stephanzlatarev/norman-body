import Generator from "./js/generator.js";
import Feature from "./js/feature.js";
import format from "./js/formatter.js";
import { withinFarDistance, withinMediumDistance, outsideFarDistance, outsideMediumDistance, outsideTargetFarDistance, outsideEnemyFarDistance } from "./js/constraints.js";

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
const WARRIOR = { ...UNIT, x: 0, y: 0 };

export default function() {
  const generator = new Generator()
    .add(new Feature("Warrior", 1, WARRIOR, []))
    .add(new Feature("Target", 1, UNIT, [outsideMediumDistance, withinFarDistance]))
    .add(new Feature("Enemy", [0, 5], UNIT, [outsideFarDistance]))
    .add(new Feature("Support", [0, 5], UNIT, [withinMediumDistance, outsideTargetFarDistance, outsideEnemyFarDistance]));

  const mapping = {
    Warrior: ["Warrior"],
    Warriors: ["Support"],
    Enemies: ["Enemy", "Target"],
    Target: ["Target"],
  };

  return format(generator.generate(), mapping);
}
