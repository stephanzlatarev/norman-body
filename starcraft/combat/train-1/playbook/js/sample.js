
export default class Sample {

  constructor(instances) {
    this.instances = instances;
  }

  list(labels) {
    return this.instances.filter(instance => (labels.indexOf(instance.label) >= 0));
  }

  toString() {
    const lines = [];

    for (const instance of this.instances) {
      lines.push(instance.toString());
    }

    return lines.join("\n");
  }

}
