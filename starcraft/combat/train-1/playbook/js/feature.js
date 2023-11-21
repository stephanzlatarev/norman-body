
export default class Feature {

  constructor(label, instances, properties, constraints, applications) {
    this.label = label;
    this.instances = instances;
    this.properties = properties;
    this.constraints = constraints;
    this.applications = applications;
  }

  addInstancesTo(instances, attemptsLimit) {
    const instancesNeeded = selectInstanceCount(this.instances, instances);
    let count = 0;

    for (let attempt = 0; (count < instancesNeeded) && (attempt < (attemptsLimit * instancesNeeded)); attempt++) {
      const instance = this.generateInstance(count, instances);

      if (instance) {
        instances.push(instance);
        count++;
      }
    }

    return (count === instancesNeeded);
  }

  generateInstance(index, instances) {
    const properties = {};

    for (const key in this.properties) {
      properties[key] = selectNumberInRange(this.properties[key]);
    }

    const instance = new FeatureInstance(index, this.label, properties, this.applications);

    if (Array.isArray(this.constraints)) {
      for (const constraint of this.constraints) {
        if (!constraint(instance, instances)) {
          return;
        }
      }
    }

    return instance;
  }

}

class FeatureInstance {

  constructor(index, label, properties, applications) {
    this.index = index;
    this.label = label;
    this.properties = properties;
    this.applications = applications;
  }

  applyTo(input, output) {
    if (this.applications) {
      for (const applyTo of this.applications) {
        applyTo(this.index, this.properties, input, output);
      }
    }
  }
}

function selectInstanceCount(range, instances) {
  if (range >= 0) {
    return range;
  } else if (Array.isArray(range)) {
    return Math.floor(range[0] + Math.random() * (range[1] - range[0] + 1));
  } else if (range instanceof Function) {
    return range(instances);
  }

  return 0;
}

function selectNumberInRange(range) {
  let selection = Math.random() * (range[1] - range[0]);

  if (range[2]) {
    selection = Math.round(selection / range[2]) * range[2];
  }

  return range[0] + selection;
}
