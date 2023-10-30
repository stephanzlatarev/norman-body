import assert from "assert";
import Path from "../code/path.js";

describe("Path", function() {

  describe("Melee warrior", function() {
    const warrior = unit(10, 10);
    const enemy = unit(14, 10);

    const getSteps = function(enemy, ...obstacles) {
      return new Path(warrior).calculate(map(warrior, enemy, ...obstacles)).contact(enemy).steps;
    }

    const getContactWithProjections = function(enemy, ...projections) {
      return new Path(warrior).calculate(map(warrior, enemy)).contact(enemy, projections);
    }

    it("Warrior cannot reach positions outside the grid", function() {
      assertEqual(new Path(unit(1, 1)).calculate([unit(0, 0), unit(4, 4)]).contact(unit(8, 1)).steps, Infinity);
    });

    it("Warrior reaches its position in zero steps", function() {
      assertEqual(getSteps(unit(10, 10)), 0);
    });

    it("Warrior reaches adjacent position in zero steps", function() {
      assertEqual(getSteps(unit(11, 10)), 0);
    });

    it("One horizontal move is one step", function() {
      assertEqual(getSteps(unit(12, 10)), 1);
    });

    it("Two horizontal moves are two steps", function() {
      assertEqual(getSteps(unit(7, 10)), 2);
    });

    it("One horizontal and one diagonal move is more than one step and less than two steps", function() {
      assertWithin(getSteps(unit(12, 11)), 1, 2);
    });

    it("Warrior goes straight to enemy", function() {
      assertEqual(getSteps(enemy), 3);
    });

    it("Warrior goes around an obstacle very close to enemy", function() {
      assertWithin(getSteps(enemy, unit(13.6, 10)), 4, 8);
    });

    it("Warrior goes around an obstacle away from enemy", function() {
      assertWithin(getSteps(enemy, unit(12, 10, { body: { radius: 1.6 }})), 4, 8);
    });

    it("Warrior which bumped into obstacle can reach enemy", function() {
      const bigger = { body: { radius: 1 } };

      assertWithin(getSteps(enemy, unit(9.7, 9.7, bigger)), 2, 3);
      assertWithin(getSteps(enemy, unit(9.7, 10, bigger)), 2, 3);
      assertWithin(getSteps(enemy, unit(9.7, 10.3, bigger)), 2, 3);
  
      assertWithin(getSteps(enemy, unit(10.3, 9.7, bigger)), 4, 8);
      assertWithin(getSteps(enemy, unit(10.3, 10, bigger)), 4, 8);
      assertWithin(getSteps(enemy, unit(10.3, 10.3, bigger)), 4, 8);
    });

    it("Warrior reaches enemy from one path only", function() {
      const wall = [
        unit(13, 9), unit(14, 9), unit(15, 9),
        unit(13, 10),
        unit(13, 11), unit(14, 11), unit(15, 11),
      ];
      assertWithin(getSteps(enemy, ...wall), 8, 10);
    });

    it("Warrior cannot reach enemy which is fully surrounded", function() {
      const wall = [
        unit(13, 9), unit(14, 9), unit(15, 9),
        unit(13, 10),              unit(15, 10),
        unit(13, 11), unit(14, 11), unit(15, 11),
      ];
      assertEqual(getSteps(enemy, ...wall), Infinity);
    });

    it("Warrior cannot go diagonal between two units", function() {
      assertWithin(getSteps(unit(11, 11), unit(10, 11), unit(11, 10)), 4, 5);
    });

    it("Projections outside of grid don't change the steps to reach the enemy", function() {
      const contact = getContactWithProjections(enemy, unit(20, 20).body);
      assertEqual(contact.steps, 3);
      assertWithin(contact.x, 12, 13);
      assertEqual(contact.y, 10);
    });

    it("Projections away from the warrior's path don't change the steps to reach the enemy", function() {
      assertEqual(getContactWithProjections(enemy, unit(15, 10).body).steps, 3);
    });

    it("Projections away from the point of contact don't change the steps to reach the enemy", function() {
      assertEqual(getContactWithProjections(enemy, unit(11, 10).body).steps, 3);
    });

    it("Projections at the point of contact change the steps to reach the enemy", function() {
      const contact = getContactWithProjections(enemy, unit(13, 10).body);

      assertWithin(contact.steps, 4, 8, "Number of steps:");
      assertWithin(contact.x, 13.5, 14, "X coordinate of contact point:");
      assertWithin(contact.y, 9, 11, "Y coordinate of contact point:");
    });
  });

  describe("Ranged warrior", function() {
    const warrior = unit(10, 10, { weapon: { range: 5 } });
    const enemyWithinRange = unit(14, 10);
    const enemyOutsideRange = unit(20, 10);

    const getSteps = function(enemy, ...obstacles) {
      return new Path(warrior).calculate(map(warrior, enemy, ...obstacles)).contact(enemy).steps;
    }

    it("Warrior reaches within-range enemy in zero steps", function() {
      assertEqual(getSteps(enemyWithinRange), 0);
    });

    it("Warrior reaches outside-range enemy in a few steps", function() {
      assertEqual(getSteps(enemyOutsideRange), 4);
    });

    it("Warrior can shoot over obstacles", function() {
      assertEqual(getSteps(enemyWithinRange, unit(12, 10)), 0);
      assertEqual(getSteps(enemyOutsideRange, unit(18, 10)), 4);
    });

    it("Warrior goes around obstacles", function() {
      assertWithin(getSteps(enemyOutsideRange, unit(18, 10, { body: { radius: 5 } })), 9, 10);
    });

  });

});

function unit(x, y, spec) {
  let unit = { tag: `${x}:${y}`, body: { x: x, y: y, radius: 0.5 }, weapon: { range: 0 } };

  if (spec) {
    if (spec.body) unit.body = { ...unit.body, ...spec.body };
    if (spec.weapon) unit.weapon = { ...unit.weapon, ...spec.weapon };
  }

  return unit;
}

function map(...units) {
  const map = new Map();

  for (const unit of units) {
    map.set(unit.tag, unit);
  }

  return map;
}

function assertEqual(actual, expected) {
  if (Math.abs(actual - expected) >= 0.001) {
    assert.equal(actual, expected);
  }
}

function assertWithin(actual, min, max, text) {
  if (!(actual >= min - 0.0001)) {
    assert.equal(actual, min, text);
  }
  if (!(actual <= max + 0.0001)) {
    assert.equal(actual, max, text);
  }
}
