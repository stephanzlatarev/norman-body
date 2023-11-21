import Feature from "./js/feature.js";
import sample from "./js/sample.js";
import { applyEnemy, applySupport, applyTarget } from "./js/applications.js";
import { withinFarDistance, withinMediumDistance, outsideFarDistance, outsideMediumDistance, outsideTargetFarDistance } from "./js/constraints.js";

const UNIT = {
  x: [-10, 10],
  y: [-10, 10],
  h: [1, 200],
};

export default function() {
  return sample(24, 2, [
    new Feature("Target", 1, UNIT, [outsideMediumDistance, withinFarDistance], [applyEnemy, applyTarget]),
    new Feature("Enemy", [0, 3], UNIT, [outsideFarDistance], [applyOtherEnemy]),
    new Feature("Support", [0, 4], UNIT, [withinMediumDistance, outsideTargetFarDistance], [applySupport]),
  ]);
}

function applyOtherEnemy(index, properties, input) {
  return applyEnemy(index + 1, properties, input);
}
