import assert from "assert";
import cases from "./cases.js";
import engage from "../code/engage.js";

describe("Engage", function() {

  for (const testcase of cases()) {

    it(testcase.title, function() {
      for (const step of testcase.steps) {
        if (!step.fights) continue;

        const fights = engage(step.units);

        fights.sort((a, b) => a.enemy.tag.localeCompare(b.enemy.tag));

        for (let i = 0; i < Math.min(fights.length, step.fights.length); i++) {
          assert.equal(fights[i].toJsonString(), JSON.stringify(step.fights[i]));
        }

        assert.equal(fights.length, step.fights.length, "Fights at step: " + step.comment);
      }
    });

  }

});