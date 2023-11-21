
const ATTEMPTS_LIMIT = 20;

export default function(inputSize, outputSize, features) {
  return generate(inputSize, outputSize, features);
}

function generate(inputSize, outputSize, features) {
  const input = array(inputSize);
  const output = array(outputSize);

  const instances = [];
  const count = array(features.length);
  const attempts = array(features.length);

  for (let i = 0; i < features.length; i++) {
    const feature = features[i];

    attempts[i]++;

    const ok = feature.addInstancesTo(instances, ATTEMPTS_LIMIT);

    if (ok) {
      count[i] = instances.length;
    } else {
      while ((i >= 0) && (attempts[i] >= ATTEMPTS_LIMIT)) {
        attempts[i] = 0;
        i--;
      }

      if (i < 0) return null;

      instances.length = (i >= 1) ? count[i - 1] : 0;
      i--;
    }
  }

  for (const instance of instances) {
    instance.applyTo(input, output);
  }

  return {
    input: input,
    output: output,
  }
}

function array(size) {
  const array = [];

  for (let i = 0; i < size; i++) {
    array.push(0);
  }

  return array;
}
