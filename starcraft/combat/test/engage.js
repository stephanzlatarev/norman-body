import assert from "assert";
import cases from "./cases.js";
import engage from "../code/engage.js";

describe("Engage", function() {
  for (const testcase of cases()) {

    describe(testcase.title, function() {
      for (const step of testcase.steps) {
        if (!step.fights) continue;

        it(step.comment, function() {
          const fights = getFights(step.units);
  
          fights.sort((a, b) => a.enemy.tag.localeCompare(b.enemy.tag));
  
          for (let i = 0; i < Math.min(fights.length, step.fights.length); i++) {
            assert.equal(fights[i].toJsonString(), JSON.stringify(step.fights[i]));
          }
  
          assert.equal(fights.length, step.fights.length, "Fight steps");
        });
      }
    });

  }
});

function getFights(units) {
  let battle = engage(units);

  for (let i = 0; i < 50; i++) {
    const update = engage(units);

    if (update === battle) break;

    battle = update;
  }

  return battle.fights;
}
