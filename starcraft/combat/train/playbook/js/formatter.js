
const WARRIORS_SLOTS = 10;
const ENEMIES_SLOTS = 10;

export default function(sample, mapping) {
  const warrior = sample.list(mapping.Warrior)[0];
  const warriors = shuffle(sample.list(mapping.Warriors), WARRIORS_SLOTS);
  const enemies = shuffle(sample.list(mapping.Enemies), ENEMIES_SLOTS);
  const target = sample.list(mapping.Target)[0];

  const input = [];
  const output = [target.properties.x, target.properties.y];

  // Add this warrior
  input.push(warrior.properties.radius);
  input.push(warrior.properties.speed);
  input.push(warrior.properties.health);
  input.push(warrior.properties.damage);
  input.push(warrior.properties.range);
  input.push(warrior.properties.cooldown);

  // Add support warriors
  for (const one of warriors) {
    if (one) {
      input.push(one.properties.x);
      input.push(one.properties.y);
      input.push(one.properties.radius);
      input.push(one.properties.speed);
      input.push(one.properties.health);
      input.push(one.properties.damage);
      input.push(one.properties.range);
      input.push(one.properties.cooldown);
    } else {
      input.push(0, 0, 0, 0, 0, 0, 0, 0);
    }
  }

  // Add enemies
  for (const one of enemies) {
    if (one) {
      input.push(one.properties.x);
      input.push(one.properties.y);
      input.push(one.properties.radius);
      input.push(one.properties.speed);
      input.push(one.properties.health);
      input.push(one.properties.damage);
      input.push(one.properties.range);
    } else {
      input.push(0, 0, 0, 0, 0, 0, 0);
    }
  }

  return { input: input, output: output };
}

function shuffle(array, size) {
  for (let i = array.length; i < size; i++) array.push(null);

  array.sort(() => (Math.random() - 0.5));

  return array;
}
