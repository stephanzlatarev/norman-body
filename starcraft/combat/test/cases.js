import fs from "fs";

const FOLDER = "./test/cases/";

export default function() {
  const cases = [];

  for (const file of fs.readdirSync(FOLDER)) {
    for (const one of parse(file)) {
      cases.push(one);
    }
  }

  return cases;
}

function parse(file) {
  const cases = [];
  const lines = fs.readFileSync(FOLDER + file).toString().split("\n");

  let testcase = newTestCase(file, 0);
  let teststep = newTestStep();
  let fieldrow = 0;
  let units = {};

  for (const line of lines) {
    if (line.length < 3) continue;

    const mark = line[0];
    const op = line[1];

    if (mark === "=") {
      // Complete test case
      cases.push(testcase);
      testcase = newTestCase(file, cases.length);
    } else if (mark === "-") {
      // Complete test step
      deleteMissingUnits(teststep.units, units);
      testcase.steps.push(teststep);
      teststep = newTestStep(teststep);
      if (line.length > 3) teststep.comment = line.slice(3).trim();
      fieldrow = 0;
      units = {};
    } else if (op === "=") {
      // Update unit
      const unit = JSON.parse(line.slice(2));

      teststep.units[mark] = updateUnit(mark, teststep.units[mark], unit);
    } else if ((op === "-") && (line.indexOf(":") < 0)) {
      // Add attack command
      teststep.commands.push({ unitTags: [mark], abilityId: 3674, targetUnitTag: line[2], queueCommand: false });
    } else if (op === "-") {
      // Add move command
      const coordinates = line.slice(2).split(":");
      const pos = { x: Number(coordinates[0]), y: Number(coordinates[1]) };
      teststep.commands.push({ unitTags: [mark], abilityId: 16, targetWorldSpacePos: pos, queueCommand: false });
    } else {
      // Update locations
      for (let x = 0; x < line.length; x++) {
        let tag = line[x];

        let unit;
        if (teststep.units[tag]) {
          unit = teststep.units[tag];
        } else if ((tag !== " ") && (tag !== "\r")) {
          tag = fieldrow + "x" + x;
          unit = { tag: tag };
          teststep.units[tag] = unit;
        }

        if (unit) {
          unit.pos = { x: x, y: fieldrow };
          units[tag] = true;
        }
      }
      fieldrow++;
    }
  }

  return cases;
}

function newTestCase(file, index) {
  return { title: file.split(".")[0] + "-" + (index + 1), steps: [] };
}

function newTestStep(previous) {
  const knowns = {};

  if (previous) {
    for (const tag in previous.units) {
      const unit = previous.units[tag];

      if ((unit.owner === 1) || (unit.owner === 2)) {
        const copy = JSON.parse(JSON.stringify(unit));
        delete copy.combat;
        knowns[tag] = copy;
      }
    }
  }

  return { comment: "", units: knowns, commands: [] };
}

const UNIT_TEMPLATE = {
  health: 100,
  order: { abilityId: 0 },
  shield: 0,
};

function updateUnit(tag, a, b) {
  return a ? { ...UNIT_TEMPLATE, ...a, ...b, tag: tag } : { ...UNIT_TEMPLATE, ...b, tag: tag };
}

function deleteMissingUnits(units, present) {
  for (const key in units) {
    if (!present[key]) {
      delete units[key];
    }
  }
}
