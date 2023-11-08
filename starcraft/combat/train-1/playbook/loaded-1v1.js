
const RADIUS = 10;
const SIDE = 21;
const SIZE = SIDE * SIDE;

export default function() {
  const x = (Math.random() - 0.5) * RADIUS * 2;
  const y = (Math.random() - 0.5) * RADIUS * 2;
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
  const col = Math.round(RADIUS + dx);
  const row = Math.round(RADIUS + dy);

  return SIDE * row + col;
}
