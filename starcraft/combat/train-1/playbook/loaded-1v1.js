
const RADIUS = 10;
const SIDE = RADIUS * 2 + 1;
const SIZE = SIDE * SIDE;

export default function() {
  const x = Math.floor(Math.random() * SIDE);
  const y = Math.floor(Math.random() * SIDE);
  const cell = SIZE + offset(x, y);
  const health = Math.random() * 199 + 1;

  const input = array(SIZE + SIZE);
  input[cell] = health;

  const output = [x - RADIUS - 1, y - RADIUS - 1];

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

function offset(x, y) {
  return SIDE * y + x;
}
