
export function applyTarget(_1, properties, _2, output) {
  output[0] = properties.x;
  output[1] = properties.y;
}

export function applyEnemy(index, properties, input) {
  input[index * 3] = properties.x;
  input[index * 3 + 1] = properties.y;
  input[index * 3 + 2] = properties.h;
}

export function applySupport(index, properties, input) {
  input[index * 3 + 12] = properties.x;
  input[index * 3 + 13] = properties.y;
  input[index * 3 + 14] = properties.h;
}
