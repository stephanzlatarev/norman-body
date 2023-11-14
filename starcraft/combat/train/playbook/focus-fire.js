import Feature from "./js/feature.js";
import sample from "./js/sample.js";

const LINE = {
  angle: [0, Math.PI * 2],
  distance: [1, 6],
};

const UNIT = {
  x: [-10, 10],
  y: [-10, 10],
  health: [1, 200],
};

export default function() {
  return sample(882, 2, [
    new Feature("Split", 1, LINE),
    new Feature("Target", 1, UNIT, [withinAreaOfWarrior, noCollisionWithWarrior], [applyEnemyHealth, applyTarget]),
    new Feature("Close support", [0, 2], UNIT, [withinAreaOfWarrior, noCollisions], [applySupportHealth]),
    new Feature("Close enemies", [0, 5], UNIT, [withinAreaOfWarrior, noCollisions, farFromSupportCenter], [applyEnemyHealth]),
    new Feature("Far support", matchCloseSupport, UNIT, [outsideAreaOfWarrior, noCollisions], [applySupportHealth]),
    new Feature("Far enemies", [0, 3], UNIT, [outsideAreaOfWarrior, noCollisions, farFromSupportCenter], [applyEnemyHealth]),
  ]);
}

function noCollisionWithWarrior(feature) {
  return (Math.abs(feature.properties.x) >= 1) || (Math.abs(feature.properties.y) >= 1);
}

function withinAreaOfWarrior(feature, others) {
  const position = feature.properties;
  const split = others.find(feature => (feature.label === "Split")).properties;
  const d = Math.cos(split.angle) * position.x - Math.sin(split.angle) * position.y;

  return d < split.distance;
}

function outsideAreaOfWarrior(feature, others) {
  return !withinAreaOfWarrior(feature, others);
}

function noCollisions(feature, others) {
  if (!noCollisionWithWarrior(feature)) return false;

  for (const one of others) {
    if ((Math.abs(feature.properties.x - one.properties.x) < 1) && (Math.abs(feature.properties.y - one.properties.y) < 1)) {
      return false;
    }
  }

  return true;
}

function farFromSupportCenter(feature, others) {
  const target = others.find(feature => (feature.label === "Target"));
  const support = others.filter(feature => (feature.label === "Close support"));

  const center = { x: 0, y: 0 };
  for (const one of support) center.x += one.properties.x;
  center.x /= (support.length + 1);

  for (const one of support) center.y += one.properties.y;
  center.y /= (support.length + 1);

  return calculateDistance(feature.properties, center) > calculateDistance(target.properties, center);
}

function matchCloseSupport(features) {
  const support = features.filter(feature => (feature.label === "Close support")).length;
  const options = [0];

  if (support >= 1) options.push(2);
  if (support >= 2) options.push(3);

  return options[Math.floor(options.length * Math.random())];
}

function applyEnemyHealth(properties, input) {
  input[cell(properties.x, properties.y)] = properties.health;
}

function applySupportHealth(properties, input) {
  input[cell(properties.x, properties.y) + 441] = properties.health;
}

function applyTarget(properties, _, output) {
  output[0] = Math.round(properties.x);
  output[1] = Math.round(properties.y);
}

function calculateDistance(a, b) {
  return Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y));
}

function cell(x, y) {
  return Math.round(21 * (10 + Math.round(y)) + (10 + Math.round(x)));
}
