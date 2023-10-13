import assert from "assert";
import Path from "../code/path.js";

describe("Path", function() {

  const warrior = unit(10, 10);
  const enemy = unit(14, 10);
  const getSteps = function(enemy, ...obstacles) {
    return new Path(warrior).calculate([warrior, enemy, ...obstacles]).getStepsToReach(enemy);
  }

  it("Warrior cannot reach positions outside the grid", function() {
    assertEqual(new Path(unit(1, 1)).calculate([unit(0, 0), unit(4, 4)]).getStepsToReach(unit(8, 1)), Infinity);
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
    assertWithin(getSteps(enemy, unit(13.6, 10)), 3.4, 6);
  });

  it("Warrior goes around an obstacle away from enemy", function() {
    assertWithin(getSteps(enemy, unit(12, 10, 1.6)), 3.4, 6);
  });

  it("Warrior reaches enemy from one path only", function() {
    const wall = [
      unit(13, 9), unit(14, 9), unit(15, 9),
      unit(13, 10),
      unit(13, 11), unit(14, 11), unit(15, 11),
    ];
    assertWithin(getSteps(enemy, ...wall), 8, 9);
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
    assertWithin(getSteps(unit(11, 11), unit(10, 11), unit(11, 10)), 3, 4);
  });

});

function unit(x, y, r) {
  return { body: { x: x, y: y, radius: r ? r : 0.5 } };
}

function assertEqual(actual, expected) {
  if (Math.abs(actual - expected) >= 0.001) {
    assert.equal(actual, expected);
  }
}

function assertWithin(actual, min, max) {
  if (actual < min) {
    assert.equal(actual, min);
  }
  if (actual > max) {
    assert.equal(actual, max);
  }
}
