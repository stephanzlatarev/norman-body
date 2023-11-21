import Feature from "./js/feature.js";
import sample from "./js/sample.js";
import { applyEnemy, applySupport, applyTarget } from "./js/applications.js";
import { withinCloseDistance, withinMediumDistance, outsideContactDistance, outsideCloseDistance, withinTargetContactDistance } from "./js/constraints.js";

const UNIT = {
  x: [-10, 10],
  y: [-10, 10],
  h: [1, 200],
};

export default function() {
  return sample(24, 2, [
    new Feature("Target", 1, UNIT, [outsideCloseDistance, withinMediumDistance], [applyTarget, applyTargetAsEnemy]),
    new Feature("Enemy", 1, UNIT, [outsideContactDistance, withinCloseDistance], [applyEnemy]),
    new Feature("Support", 1, UNIT, [withinTargetContactDistance], [applySupport]),
  ]);
}

function applyTargetAsEnemy(index, properties, input) {
  return applyEnemy(index + 1, properties, input);
}
