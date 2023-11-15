import Feature from "./js/feature.js";
import sample from "./js/sample.js";
import { applyEnemyHealth, applyTarget } from "./js/applications.js";
import { withinContactDistance, outsideContactDistance, noCollisions } from "./js/constraints.js";

const TARGET = {
  x: [-1, 1, 1],
  y: [-1, 1, 1],
  health: [1, 200],
};

const UNIT = {
  x: [-10, 10, 1],
  y: [-10, 10, 1],
  health: [1, 200],
};

export default function() {
  return sample(882, 2, [
    new Feature("Target", 1, TARGET, [withinContactDistance], [applyEnemyHealth, applyTarget]),
    new Feature("Enemy", [0, 6], UNIT, [noCollisions, outsideContactDistance], [applyEnemyHealth]),
  ]);
}
