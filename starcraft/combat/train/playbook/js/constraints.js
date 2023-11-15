
export function withinContactDistance(feature) {
  return outsideWarriorSpace(feature) && (calculateDistanceToWarrior(feature.properties) < 2);
}

export function withinCloseDistance(feature) {
  return outsideWarriorSpace(feature) && (calculateDistanceToWarrior(feature.properties) < 3.5);
}

export function withinMediumDistance(feature) {
  return outsideCloseDistance(feature) && (calculateDistanceToWarrior(feature.properties) < 5);
}

export function withinFarDistance(feature) {
  return outsideMediumDistance(feature) && (calculateDistanceToWarrior(feature.properties) < 8);
}

export function outsideWarriorSpace(feature) {
  return (feature.properties.x !== 0) || (feature.properties.y !== 0);
}

export function outsideContactDistance(feature) {
  return (calculateDistanceToWarrior(feature.properties) >= 2);
}

export function outsideCloseDistance(feature) {
  return (calculateDistanceToWarrior(feature.properties) >= 3.5);
}

export function outsideMediumDistance(feature) {
  return (calculateDistanceToWarrior(feature.properties) >= 5);
}

export function outsideFarDistance(feature) {
  return (calculateDistanceToWarrior(feature.properties) >= 8);
}

export function noCollisions(feature, others) {
  if (!outsideWarriorSpace(feature)) return false;

  for (const one of others) {
    if (isAtSamePosition(feature.properties, one.properties)) {
      return false;
    }
  }

  return true;
}

function isAtSamePosition(a, b) {
  return (a.x !== b.x) && (a.y !== b.y);
}

function calculateDistanceToWarrior(a) {
  return Math.sqrt(a.x * a.x + a.y * a.y);
}

function calculateDistance(a, b) {
  return Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y));
}
