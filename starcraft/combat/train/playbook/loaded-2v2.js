
const SIZE = 441;
const MAX_HEALTH = 200;

export default function() {
  const input = array(SIZE + SIZE);
  const output = array(SIZE);

  const weakEnemyHealth = randomHealth(1);
  const weakEnemyPosition = randomPosition();
  const strongEnemyHealth = randomHealth(2);
  const strongEnemyPosition = randomPosition(weakEnemyPosition);

  if (Math.random() < 0.5) {
    // The weak enemy is the first target
    input[SIZE + weakEnemyPosition] = weakEnemyHealth;
    input[SIZE + strongEnemyPosition] = strongEnemyHealth;
    output[weakEnemyPosition] = weakEnemyHealth;
  } else {
    // The target enemy is the second target
    input[weakEnemyPosition] = weakEnemyHealth;
    input[SIZE + weakEnemyPosition] = weakEnemyHealth;
    input[SIZE + strongEnemyPosition] = strongEnemyHealth;
    output[weakEnemyPosition] = weakEnemyHealth;
  }

  return {
    input: input,
    output: output,
  };
}

function randomHealth(min) {
  return min + 1 + Math.random() * (MAX_HEALTH - min - 1);
}

function randomPosition(blocked) {
  let cell = blocked;

  while (cell === blocked) {
    cell = Math.floor(Math.random() * SIZE);
  }

  return cell;
}

function array(size) {
  const array = [];

  for (let i = 0; i < size; i++) {
    array.push(0);
  }

  return array;
}
