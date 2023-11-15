
export function applyEnemyHealth(properties, input) {
  input[cell(properties.x, properties.y)] = properties.health;
}

export function applySupportHealth(properties, input) {
  input[cell(properties.x, properties.y) + 441] = properties.health;
}

export function applyTarget(properties, _, output) {
  output[0] = Math.round(properties.x);
  output[1] = Math.round(properties.y);
}

function cell(x, y) {
  return Math.round(21 * (10 + Math.round(y)) + (10 + Math.round(x)));
}
