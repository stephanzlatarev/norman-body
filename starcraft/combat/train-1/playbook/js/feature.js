
export default class Feature {

  constructor(label, instances, properties, constraints) {
    this.label = label;
    this.instances = instances;
    this.properties = properties;
    this.constraints = constraints;
  }

  generateCount(context) {
    const range = this.instances;

    if (range >= 0) {
      return range;
    } else if (Array.isArray(range)) {
      return Math.floor(range[0] + Math.random() * (range[1] - range[0] + 1));
    } else if (range instanceof Function) {
      return range(context);
    }

    return 0;
  }

  generateInstance(context) {
    const properties = {};

    for (const key in this.properties) {
      properties[key] = selectNumberInRange(this.properties[key], context);
    }

    const instance = new Instance(this.label, properties);

    if (Array.isArray(this.constraints)) {
      for (const constraint of this.constraints) {
        if (!constraint(instance, context)) {
          return;
        }
      }
    }

    return instance;
  }

}

class Instance {

  constructor(label, properties) {
    this.label = label;
    this.properties = properties;
  }

  toString() {
    const line = [this.label];

    for (const key in this.properties) {
      line.push(key + "=" + this.properties[key].toFixed(2));
    }

    return line.join(" ");
  }

}

function selectNumberInRange(range) {
  if (range > 0) {
    return range;
  } else if (Array.isArray(range)) {
    let selection = Math.random() * (range[1] - range[0]);

    if (range[2]) {
      selection = Math.round(selection / range[2]) * range[2];
    }

    return range[0] + selection;
  } else if (range instanceof Function) {
    return range(context);
  }

  return 0;
}
