import assert from "assert";
import cases from "./cases.js";
import Combat from "../code/combat.js";

describe("Combat", function() {

  for (const testcase of cases()) {

    it(testcase.title, function() {
      const combat = new Combat();

      for (const step of testcase.steps) {
        const commands = combat.run(step.units);

        commands.sort(compareByAlphabetOrder);
        step.commands.sort(compareByAlphabetOrder);

        for (let i = 0; i < step.commands.length; i++) {
          assert.equal(JSON.stringify(commands[i]), JSON.stringify(step.commands[i]), "Wrong command: " + step.comment);
        }

        assert.equal(commands.length, step.commands.length, "Wrong number of commands: " + step.comment);
      }
    });

  }

});

function compareByAlphabetOrder(a, b) {
  const as = a.unitTags[0];
  const bs = b.unitTags[0];

  if (as !== bs) return as.localeCompare(bs);

  if (a.targetUnitTag && b.targetUnitTag) return a.targetUnitTag.localeCompare(b.targetUnitTag);

  return 0;
}
