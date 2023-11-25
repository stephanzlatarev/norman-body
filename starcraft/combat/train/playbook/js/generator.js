import Sample from "./sample.js";

export default class Generator {

  constructor(loopLimit) {
    this.features = [];
    this.loopLimit = loopLimit ? loopLimit : 20;
  }

  add(feature) {
    this.features.push(feature);
    return this;
  }

  generate() {
    const instances = [];
    const count = array(this.features.length);
    const attempts = array(this.features.length);

    for (let i = 0; i < this.features.length; i++) {
      const feature = this.features[i];

      attempts[i]++;

      const targetFeatureCount = feature.generateCount(instances);
      let ok = true;

      for (let currentFeatureCount = 0; currentFeatureCount < targetFeatureCount; currentFeatureCount++) {
        const instance = generateInstance(feature, instances, this.loopLimit);

        if (instance) {
          instances.push(instance);
        } else {
          ok = false;
          break;
        }
      }

      if (ok) {
        count[i] = instances.length;
      } else {
        while ((i >= 0) && (attempts[i] >= this.loopLimit)) {
          attempts[i] = 0;
          i--;
        }

        if (i < 0) return null;

        instances.length = (i >= 1) ? count[i - 1] : 0;
        i--;
      }
    }

    return new Sample(instances);
  }

}

function generateInstance(feature, context, loopLimit) {
  for (let attempt = 0; attempt < loopLimit; attempt++) {
    const instance = feature.generateInstance(context);

    if (instance) {
      return instance;
    }
  }
}

function array(size) {
  const array = [];

  for (let i = 0; i < size; i++) {
    array.push(0);
  }

  return array;
}
