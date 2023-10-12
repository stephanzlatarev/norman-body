
const STEP_DIAGONAL = Math.sqrt(2);

// TODO: Consider the radius of warrior and units when finding path. The warrior is not able to move between units that are close together.
// TODO: Consider the weapon range of warrior when calculating the steps to reach an enemy.
export default class Path {

  constructor(warrior) {
    this.warrior = warrior;
  }

  cell(col, row) {
    if (this.grid[row] && this.grid[row][col]) {
      return this.grid[row][col];
    }
  }

  calculate(units) {
    this.boundaries = findBoundaries(this.warrior, units);

    const warriorCol = getCol(this.boundaries, this.warrior.body);
    const warriorRow = getRow(this.boundaries, this.warrior.body);

    this.grid = createGrid(this.boundaries);

    for (const unit of units) {
      markUnit(this.grid, this.boundaries, unit.body);
    }

    findPath(this.grid, warriorRow, warriorCol);

    return this;
  }

  getStepsToReach(enemy) {
    const col = getCol(this.boundaries, enemy.body);
    const row = getRow(this.boundaries, enemy.body);
    const target = this.cell(col, row);

    if (!target) return Infinity;

    const coordinates = { row: row, col: col };

    let bestSteps = (target.steps >= 0) ? target.steps : Infinity;

    for (const c of getAdjacentCellsStraight(coordinates)) {
      if (this.grid[c.row] && this.grid[c.row][c.col]) {
        const cell = this.grid[c.row][c.col];

        if ((cell.steps < bestSteps) && isUnitApproachableFromDirection(enemy, target, c)) {
          bestSteps = cell.steps;
        }
      }
    }

    return Math.max(bestSteps, 0);
  }

  show(title) {
    if (title) console.log("---", title, "---");
    for (let i = this.grid.length - 1; i >= 0; i--) {
      const row = this.grid[i];
      const line = [];

      for (const cell of row) {
        if (cell.steps === Infinity) {
          line.push("##");
        } else if (cell.steps >= 10) {
          line.push(Math.floor(cell.steps));
        } else if (cell.steps >= 0) {
          line.push(" " + Math.floor(cell.steps));
        } else {
          line.push(" .");
        }
      }

      console.log(line.join(" "));
    }
  }
}

function findBoundaries(warrior, units) {
  let top = warrior.body.y;
  let left = warrior.body.x;
  let right = warrior.body.x;
  let bottom = warrior.body.y;

  for (const unit of units) {
    if (unit.body.x < left) left = unit.body.x;
    if (unit.body.y < top) top = unit.body.y;
    if (unit.body.x > right) right = unit.body.x;
    if (unit.body.y > bottom) bottom = unit.body.y;
  }

  return {
    top: top,
    left: left,
    width: (right - left) + 3,
    height: (bottom - top) + 3,
  };
}

function createGrid(boundaries) {
  const grid = [];

  for (let i = 0; i < boundaries.height; i++) {
    const row = [];

    for (let j = 0; j < boundaries.width; j++) {
      row.push({ steps: undefined, units: [] });
    }

    grid.push(row);
  }

  return grid;
}

function getCol(boundaries, pos) {
  return Math.floor(pos.x - boundaries.left) + 1;
}

function getRow(boundaries, pos) {
  return Math.floor(pos.y - boundaries.top) + 1;
}

function markUnit(grid, boundaries, pos) {
  const cell = grid[getRow(boundaries, pos)][getCol(boundaries, pos)];
  cell.steps = Infinity;
  cell.units.push(pos);
}

function findPath(grid, startRow, startCol) {
  let coordinates = [{ row: startRow, col: startCol, steps: 0 }];

  grid[startRow][startCol].steps = undefined;

  while (coordinates.length) {
    const next = [];

    for (const c of coordinates) {
      // Check if cell is outside the grid
      if ((c.row < 0) || (c.row >= grid.length) || (c.col < 0) || (c.col >= grid[c.row].length)) continue;

      // Check if cell is already visited
      if (grid[c.row][c.col].steps >= 0) continue;

      grid[c.row][c.col].steps = c.steps;
      next.push(...getAdjacentCellsStraight(c));
      next.push(...getAdjacentCellsDiagonal(c));
    }

    coordinates = next;
    coordinates.sort((a, b) => (a.steps - b.steps));
  }
}

function isUnitApproachableFromDirection(unit, cell, direction) {
  if (direction.dx < 0) {
    return !cell.units.find(body => (body.x < unit.body.x));
  } else if (direction.dx > 0) {
    return !cell.units.find(body => (body.x > unit.body.x));
  } else if (direction.dy < 0) {
    return !cell.units.find(body => (body.y < unit.body.y));
  } else if (direction.dy > 0) {
    return !cell.units.find(body => (body.y > unit.body.y));
  }
}

function getAdjacentCellsStraight(coordinates) {
  return [
    { row: coordinates.row, col: coordinates.col - 1, steps: coordinates.steps + 1, dx: -1, dy:  0 },
    { row: coordinates.row, col: coordinates.col + 1, steps: coordinates.steps + 1, dx:  1, dy:  0 },
    { row: coordinates.row - 1, col: coordinates.col, steps: coordinates.steps + 1, dx:  0, dy: -1 },
    { row: coordinates.row + 1, col: coordinates.col, steps: coordinates.steps + 1, dx:  0, dy:  1 },
  ];
}

function getAdjacentCellsDiagonal(coordinates) {
  return [
    { row: coordinates.row - 1, col: coordinates.col - 1, steps: coordinates.steps + STEP_DIAGONAL },
    { row: coordinates.row + 1, col: coordinates.col + 1, steps: coordinates.steps + STEP_DIAGONAL },
    { row: coordinates.row - 1, col: coordinates.col + 1, steps: coordinates.steps + STEP_DIAGONAL },
    { row: coordinates.row + 1, col: coordinates.col - 1, steps: coordinates.steps + STEP_DIAGONAL },
  ];
}
