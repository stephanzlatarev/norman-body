
const WARRIORS_SLOTS = 3;
const ENEMIES_SLOTS = 4;

export default function(sample, mapping) {
  const warrior = sample.list(mapping.Warrior)[0];
  const warriors = shuffle(sample.list(mapping.Warriors), WARRIORS_SLOTS);
  const enemies = shuffle(sample.list(mapping.Enemies), ENEMIES_SLOTS);
  const target = sample.list(mapping.Target)[0];

  const input = [];
  const output = [target.properties.x, target.properties.y];

  // Add this warrior
  input.push(0, 0, warrior.properties.health);

  // Add support warriors
  for (const one of warriors) {
    if (one) {
      input.push(one.properties.x, one.properties.y, one.properties.health);
    } else {
      input.push(0, 0, 0);
    }
  }

  // Add enemies
  for (const one of enemies) {
    if (one) {
      input.push(one.properties.x, one.properties.y, one.properties.health);
    } else {
      input.push(0, 0, 0);
    }
  }

  return { input: input, output: output };
}

function shuffle(array, size) {
  for (let i = array.length; i < size; i++) array.push(null);

  array.sort(() => (Math.random() - 0.5));

  return array;
}
