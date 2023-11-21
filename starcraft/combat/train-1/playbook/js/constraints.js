
export function withinContactDistance(feature) {
  return calculateDistanceToWarrior(feature.properties) < 2;
}

export function withinCloseDistance(feature) {
  return calculateDistanceToWarrior(feature.properties) < 4;
}

export function withinMediumDistance(feature) {
  return calculateDistanceToWarrior(feature.properties) < 6;
}

export function withinFarDistance(feature) {
  return calculateDistanceToWarrior(feature.properties) < 8;
}

export function outsideContactDistance(feature) {
  return calculateDistanceToWarrior(feature.properties) >= 2;
}

export function outsideCloseDistance(feature) {
  return calculateDistanceToWarrior(feature.properties) >= 4;
}

export function outsideMediumDistance(feature) {
  return calculateDistanceToWarrior(feature.properties) >= 6;
}

export function outsideFarDistance(feature) {
  return calculateDistanceToWarrior(feature.properties) >= 8;
}

export function withinTargetContactDistance(feature, features) {
  const target = features.find(feature => (feature.label === "Target"));

  return calculateDistance(feature.properties, target.properties) < 2;
}

export function outsideTargetFarDistance(feature, features) {
  const target = features.find(feature => (feature.label === "Target"));

  return calculateDistance(feature.properties, target.properties) >= 8;
}

export function outsideEnemyFarDistance(feature, features) {
  const enemies = features.filter(feature => (feature.label === "Enemy"));

  for (const enemy of enemies) {
    if (calculateDistance(feature.properties, enemy.properties) < 8) {
      return false;
    }
  }

  return true;
}

function calculateDistanceToWarrior(a) {
  return Math.sqrt(a.x * a.x + a.y * a.y);
}

function calculateDistance(a, b) {
  return Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y));
}
