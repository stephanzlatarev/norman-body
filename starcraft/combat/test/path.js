import assert from "assert";
import Path from "../code/path.js";

describe("Path", function() {

  it("Warrior cannot reach positions outside the grid", function() {
    const steps = new Path(unit(1, 1)).calculate([unit(0, 0), unit(4, 4)]).getStepsToReach(unit(8, 1));
    assert.equal(steps, Infinity);
  });

  it("Warrior reaches its position in zero steps", function() {
    const steps = new Path(unit(10, 10)).calculate([]).getStepsToReach(unit(10, 10));
    assert.equal(steps, 0);
  });

  it("Warrior reaches adjacent position in zero steps", function() {
    const steps = new Path(unit(10, 10)).calculate([unit(11, 10)]).getStepsToReach(unit(11, 10));
    assert.equal(steps, 0);
  });

  it("One horizontal move is one step", function() {
    const steps = new Path(unit(10, 10)).calculate([unit(12, 10)]).getStepsToReach(unit(12, 10));
    assert.equal(steps, 1);
  });

  it("Two horizontal moves are two steps", function() {
    const steps = new Path(unit(10, 10)).calculate([unit(7, 10)]).getStepsToReach(unit(7, 10));
    assert.equal(steps, 2);
  });

  it("One horizontal and one diagonal move is more than one step and less than two steps", function() {
    const steps = new Path(unit(10, 10)).calculate([unit(12, 11)]).getStepsToReach(unit(12, 11));
    assert.equal(steps.toFixed(3), "1.414");
  });

  it("Warrior goes around an obstacle", function() {
    const steps = new Path(unit(2, 2)).calculate([unit(2, 2), unit(4, 2), unit(6, 2)]).getStepsToReach(unit(6, 2));
    assert.equal(steps.toFixed(3), "3.828");
  });

  it("Warrior reaches enemy from one path only", function() {
    const steps = new Path(unit(1, 1)).calculate([
      unit(3, 1), unit(4, 1), unit(5, 1),
      unit(3, 2),
      unit(3, 3), unit(4, 3), unit(5, 3),
    ]).getStepsToReach(unit(4, 2));
    assert.equal(steps.toFixed(3), "7.243");
  });

  it("Warrior cannot reach enemy which is fully surrounded", function() {
    const steps = new Path(unit(1, 1)).calculate([
      unit(3, 1), unit(4, 1), unit(5, 1),
      unit(3, 2), unit(4, 2), unit(5, 2),
      unit(3, 3), unit(4, 3), unit(5, 3),
    ]).getStepsToReach(unit(4, 2));
    assert.equal(steps, Infinity);
  });

  it("Warrior cannot go diagonal between two units", function() {
    const steps = new Path(unit(2, 2)).calculate([
      unit(2, 2), unit(2, 3),
      unit(3, 2), unit(3, 3),
    ]).getStepsToReach(unit(3, 3));
    assert.equal(steps.toFixed(3), "3.828");
  });

  it("Warrior goes around an obstacle in the same grid as the target enemy", function() {
    const steps = new Path(unit(2, 2)).calculate([
      unit(2, 2), unit(4.4, 2), unit(4.2, 2)
    ]).getStepsToReach(unit(4.4, 2));
    assert.equal(steps.toFixed(3), "2.414");
  });

});

function unit(x, y) {
  return { body: { x: x, y: y, radius: 0.5 } };
}
