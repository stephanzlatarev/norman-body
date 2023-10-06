import assert from "assert";
import cases from "./cases.js";
import Combat from "../code/combat.js";

describe("Combat", function() {

  for (const testcase of cases()) {

    it(testcase.title, function() {
      const combat = new Combat();

      for (const step of testcase.steps) {
        const commands = combat.run(map(step.units));

        commands.sort(compareByAlphabetOrder);
        step.commands.sort(compareByAlphabetOrder);

        for (let i = 0; i < step.commands.length; i++) {
          assert.equal(JSON.stringify(commands[i]), JSON.stringify(step.commands[i]), (step.comment ? step.comment : "Wrong command"));
        }

        assert.equal(commands.length, step.commands.length, (step.comment ? step.comment : "Wrong number of commands"));
      }
    });

  }

});

function map(units) {
  const map = new Map();

  for (const unit of units) {
    map.set(unit.tag, unit);
  }

  return map;
}

function compareByAlphabetOrder(a, b) {
  const as = a.unitTags[0];
  const bs = b.unitTags[0];

  if (as !== bs) return as.localeCompare(bs);

  if (a.targetUnitTag && b.targetUnitTag) return a.targetUnitTag.localeCompare(b.targetUnitTag);

  return 0;
}
