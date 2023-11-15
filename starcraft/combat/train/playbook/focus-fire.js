import Feature from "./js/feature.js";
import sample from "./js/sample.js";
import { applyEnemyHealth, applySupportHealth, applyTarget } from "./js/applications.js";
import { withinCloseDistance, withinMediumDistance, outsideContactDistance, outsideFarDistance, noCollisions } from "./js/constraints.js";

const UNIT = {
  x: [-10, 10, 1],
  y: [-10, 10, 1],
  health: [1, 200],
};

export default function() {
  return sample(882, 2, [
    new Feature("Target", 1, UNIT, [outsideContactDistance, withinMediumDistance], [applyEnemyHealth, applyTarget]),
    new Feature("Support", [0, 6], UNIT, [noCollisions, withinCloseDistance], [applySupportHealth]),
    new Feature("Enemy", [0, 5], UNIT, [noCollisions, outsideFarDistance], [applyEnemyHealth]),
  ]);
}
