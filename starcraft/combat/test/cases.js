import fs from "fs";

const FOLDER = "./test/cases/";

export default function() {
  const cases = [];

  for (const file of fs.readdirSync(FOLDER)) {
    cases.push(parse(file));
  }

  return cases;
}

function parse(file) {
  const lines = fs.readFileSync(FOLDER + file).toString().split("\n");

  const steps = [];
  let step;

  for (const line of lines) {
    if (line.length < 3) continue;

    if (line[0] === "#") {
      // Start test step
      if (step && step.units.size) {
        steps.push(step);
      }

      step = { comment: line.slice(1).trim(), units: new Map(), fights: [], commands: [] };
    } else if (step) {
      // Update unit
      const object = JSON.parse(line);

      if (object.enemy && object.warriors) {
        step.fights.push(object);
      } else if (object.tag) {
        object.nick = object.tag;
        step.units.set(object.tag, object);
      } else {
        step.commands.push(object);
      }
    }
  }

  if (step && step.units.size) {
    steps.push(step);
  }

  return {
    title: file.split(".")[0],
    steps: steps,
  };
}
