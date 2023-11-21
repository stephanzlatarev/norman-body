
export function withinContactDistance(feature) {
  return calculateDistanceToWarrior(feature.properties) < 2;
}

export function withinCloseDistance(feature) {
  return calculateDistanceToWarrior(feature.properties) < 3.5;
}

export function withinMediumDistance(feature) {
  return calculateDistanceToWarrior(feature.properties) < 5;
}

export function withinFarDistance(feature) {
  return calculateDistanceToWarrior(feature.properties) < 8;
}

export function outsideContactDistance(feature) {
  return calculateDistanceToWarrior(feature.properties) >= 2;
}

export function outsideCloseDistance(feature) {
  return calculateDistanceToWarrior(feature.properties) >= 3.5;
}

export function outsideMediumDistance(feature) {
  return calculateDistanceToWarrior(feature.properties) >= 5;
}

export function outsideFarDistance(feature) {
  return calculateDistanceToWarrior(feature.properties) >= 8;
}

export function withinTargetContactDistance(feature, features) {
  const target = features.find(feature => (feature.label === "Target"));

  return calculateDistance(feature.properties, target.properties) < 2;
}

function calculateDistanceToWarrior(a) {
  return Math.sqrt(a.x * a.x + a.y * a.y);
}

function calculateDistance(a, b) {
  return Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y));
}
