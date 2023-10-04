import assert from "assert";
import cases from "./cases.js";
import Combat from "../code/combat.js";

describe("Combat", function() {

  for (const testcase of cases()) {

    it(testcase.title, function() {
      const combat = new Combat();
      let commands = [];

      for (const step of testcase.steps) {
        for (let i = 0; i < step.commands.length; i++) {
          assert.equal(JSON.stringify(commands[i]), JSON.stringify(step.commands[i]));
        }
        assert.equal(commands.length, step.commands.length, "Wrong number of commands are issued" + (step.comment ? " at step: " + step.comment : ""));

        commands = combat.run(map(step.units, commands));
      }
    });

  }

});

function map(units, commands) {
  const map = new Map();

  for (const tag in units) {
    const unit = units[tag];

    unit.order = { abilityId: 0 };

    for (const command of commands) {
      if (command.unitTags.length && (command.unitTags[0] === tag)) {
        unit.order = command;
      }
    }

    map.set(tag, unit);
  }

  return map;
}
