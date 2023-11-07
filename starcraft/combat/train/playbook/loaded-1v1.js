
const SIZE = 441;

export default function() {
  const input = array(SIZE + SIZE);
  const output = array(SIZE);

  const cell = Math.floor(Math.random() * SIZE);
  const health = Math.random() * 199 + 1;

  input[SIZE + cell] = health;
  output[cell] = 1;

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
