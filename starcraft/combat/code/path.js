
const GRID = 0.2;
const DIAGONAL = Math.sqrt(GRID * GRID * 2);

// TODO: Consider the radius of warrior and units when finding path. The warrior is not able to move between units that are close together.
// TODO: Consider the weapon range of warrior when calculating the steps to reach an enemy.
export default class Path {

  constructor(warrior) {
    this.warrior = warrior;
  }

  calculate(units) {
    this.units = units;
    this.boundaries = findBoundaries(this.warrior, units);
    this.grid = createGrid(this.boundaries);

    for (const unit of units) {
      if (unit !== this.warrior) {
        markUnit(this.grid, this.boundaries, unit);
      }
    }

    findPath(this.grid, getCol(this.boundaries, this.warrior.body), getRow(this.boundaries, this.warrior.body));

    return this;
  }

  getStepsToReach(enemy) {
    const spread = Math.ceil((this.warrior.body.radius + enemy.body.radius) / GRID) + 1;
    const col = getCol(this.boundaries, enemy.body);
    const row = getRow(this.boundaries, enemy.body);
    const target = getSteps(this.grid, col, row);

    if (target >= 0) {
      let bestSteps = target;

      for (const cell of getSpreadCells(this.grid, col, row, spread)) {
        const steps = getSteps(this.grid, cell.col, cell.row);

        if (steps < bestSteps) {
          bestSteps = steps;
        }
      }

      return Math.max(bestSteps, 0);
    }

    return Infinity;
  }

  show(title) {
    if (title) console.log("---", title, "---");

    const ids = {};
    for (const unit of this.units) ids[getCol(this.boundaries, unit.body) + ":" + getRow(this.boundaries, unit.body)] = unit.nick;

    for (let i = this.grid.length - 1; i >= 0; i--) {
      const row = this.grid[i];
      const line = [];

      for (let col = 0; col < row.length; col++) {
        const steps = row[col];
        const id = ids[col + ":" + i];

        if (id) {
          line.push(id);
        } else if (steps === Infinity) {
          line.push(" ##");
        } else if (steps >= 10) {
          line.push(" " + Math.floor(steps));
        } else if (steps >= 0) {
          line.push("  " + Math.floor(steps));
        } else {
          line.push("  .");
        }
      }

      console.log(line.join(""));
    }
  }
}

function findBoundaries(warrior, units) {
  const margin = warrior.body.radius + warrior.body.radius + GRID;

  let top = warrior.body.y;
  let left = warrior.body.x;
  let right = warrior.body.x;
  let bottom = warrior.body.y;

  for (const unit of units) {
    if (unit.body.x - unit.body.radius < left) left = unit.body.x - unit.body.radius;
    if (unit.body.y - unit.body.radius < top) top = unit.body.y - unit.body.radius;
    if (unit.body.x + unit.body.radius > right) right = unit.body.x + unit.body.radius;
    if (unit.body.y + unit.body.radius > bottom) bottom = unit.body.y + unit.body.radius;
  }

  top = Math.floor(top - margin);
  left = Math.floor(left - margin);
  right = Math.ceil(right + margin);
  bottom = Math.ceil(bottom + margin);

  return {
    top: top,
    left: left,
    width: right - left + GRID,
    height: bottom - top + GRID,
    gap: Math.floor(warrior.body.radius / GRID) * GRID,
  };
}

function createGrid(boundaries) {
  const grid = [];

  for (let i = 0; i < boundaries.height; i += GRID) {
    const row = [];

    for (let j = 0; j < boundaries.width; j += GRID) {
      row.push({ steps: undefined, units: [] });
    }

    grid.push(row);
  }

  return grid;
}

function getCol(boundaries, pos) {
  return Math.floor((pos.x - boundaries.left) / GRID);
}

function getRow(boundaries, pos) {
  return Math.floor((pos.y - boundaries.top) / GRID);
}

function getSteps(grid, col, row) {
  if (grid[row] && (grid[row][col] >= 0)) {
    return grid[row][col];
  }
}

function markUnit(grid, boundaries, unit) {
  const col = getCol(boundaries, unit.body);
  const row = getRow(boundaries, unit.body);
  const spread = Math.ceil(unit.body.radius / GRID) + Math.floor(boundaries.gap / GRID) - 1;

  for (const cell of getSpreadCells(grid, col, row, spread)) {
    grid[cell.row][cell.col] = Infinity;
  }
}

function findPath(grid, startCol, startRow) {
  let coordinates = [{ row: startRow, col: startCol, steps: 0 }];

  grid[startRow][startCol] = undefined;

  while (coordinates.length) {
    const next = [];

    for (const c of coordinates) {
      // Check if cell is outside the grid
      if ((c.row < 0) || (c.row >= grid.length) || (c.col < 0) || (c.col >= grid[c.row].length)) continue;

      // Check if cell is already visited
      if (grid[c.row][c.col] >= 0) continue;

      grid[c.row][c.col] = c.steps;
      next.push(...getAdjacentCellsStraight(c));
      next.push(...getAdjacentCellsDiagonal(c));
    }

    coordinates = next;
    coordinates.sort((a, b) => (a.steps - b.steps));
  }
}

function getAdjacentCellsStraight(coordinates) {
  return [
    { row: coordinates.row, col: coordinates.col - 1, steps: coordinates.steps + GRID },
    { row: coordinates.row, col: coordinates.col + 1, steps: coordinates.steps + GRID },
    { row: coordinates.row - 1, col: coordinates.col, steps: coordinates.steps + GRID },
    { row: coordinates.row + 1, col: coordinates.col, steps: coordinates.steps + GRID },
  ];
}

function getAdjacentCellsDiagonal(coordinates) {
  return [
    { row: coordinates.row - 1, col: coordinates.col - 1, steps: coordinates.steps + DIAGONAL },
    { row: coordinates.row + 1, col: coordinates.col + 1, steps: coordinates.steps + DIAGONAL },
    { row: coordinates.row - 1, col: coordinates.col + 1, steps: coordinates.steps + DIAGONAL },
    { row: coordinates.row + 1, col: coordinates.col - 1, steps: coordinates.steps + DIAGONAL },
  ];
}

function getSpreadCells(grid, col, row, spread) {
  const cells = [];

  for (let dc = -spread; dc <= spread; dc++) {
    for (let dr = -spread; dr <= spread; dr++) {
      // Check if cell is outside the grid
      if ((row + dr < 0) || (row + dr >= grid.length) || (col + dc < 0) || (col + dc >= grid[row + dr].length)) continue;

      // Check if cell is within spread
      if ((dc*dc + dr*dr) > spread*spread) continue;

      cells.push({ row: row + dr, col: col + dc });
    }
  }

  return cells;
}
