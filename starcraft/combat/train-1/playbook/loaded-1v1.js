
const RADIUS = 10;
const SIDE = 21;
const SIZE = SIDE * SIDE;

export default function() {
  const x = Math.round((Math.random() - 0.5) * RADIUS * 2);
  const y = Math.round((Math.random() - 0.5) * RADIUS * 2);
  const health = Math.random() * 199 + 1;

  const input = array(SIZE + SIZE);
  input[cell(x, y)] = health;

  const output = [x, y];

  return {
    input: input,
    output: output,
  };
}

function array(size) {
  const array = [];

  for (let i = 0; i < size; i++) {
    array.push(0);
  }

  return array;
}

function cell(dx, dy) {
  return Math.round(SIDE * (RADIUS + dy) + (RADIUS + dx));
}
