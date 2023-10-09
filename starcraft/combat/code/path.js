
// TODO: Consider the radius of warrior and units when finding path. The warrior is not able to move between units that are close together.
// TODO: Consider the weapon range of warrior when calculating the steps to reach an enemy.
export default class Path {

  constructor(warrior) {
    this.warrior = warrior;
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
    const coordinates = { row: row, col: col };

    let bestSteps = (this.grid[row] && (this.grid[row][col] >= 0)) ? this.grid[row][col] : Infinity;

    for (const cell of getAdjacentCellsStraight(coordinates)) {
      if (this.grid[cell.row] && (this.grid[cell.row][cell.col] < bestSteps)) {
        bestSteps = this.grid[cell.row][cell.col];
      }
    }

    for (const cell of getAdjacentCellsDiagonal(coordinates)) {
      if (this.grid[cell.row] && (this.grid[cell.row][cell.col] < bestSteps)) {
        bestSteps = this.grid[cell.row][cell.col];
      }
    }

    return bestSteps;
  }

  show(title) {
    if (title) console.log("---", title, "---");
    for (const row of this.grid) {
      const line = [];

      for (const cell of row) {
        if (cell === Infinity) {
          line.push("##");
        } else if (cell >= 10) {
          line.push(Math.floor(cell));
        } else if (cell >= 0) {
          line.push(" " + Math.floor(cell));
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
      row.push(undefined);
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
  grid[getRow(boundaries, pos)][getCol(boundaries, pos)] = Infinity;
}

function findPath(grid, startRow, startCol) {
  let cells = [{ row: startRow, col: startCol, steps: 0 }];

  grid[startRow][startCol] = undefined;

  while (cells.length) {
    const next = [];

    for (const cell of cells) {
      // Check if cell is outside the grid
      if ((cell.row < 0) || (cell.row >= grid.length) || (cell.col < 0) || (cell.col >= grid[cell.row].length)) continue;

      // Check if cell is already visited
      if (grid[cell.row][cell.col] >= 0) continue;

      grid[cell.row][cell.col] = cell.steps;
      next.push(...getAdjacentCellsStraight(cell, cell.steps));
      next.push(...getAdjacentCellsDiagonal(cell, cell.steps));
    }

    cells = next;
    cells.sort((a, b) => (a.steps - b.steps));
  }
}

function getAdjacentCellsStraight(cell, steps) {
  return [
    { row: cell.row, col: cell.col - 1, steps: steps + 1 },
    { row: cell.row, col: cell.col + 1, steps: steps + 1 },
    { row: cell.row - 1, col: cell.col, steps: steps + 1 },
    { row: cell.row + 1, col: cell.col, steps: steps + 1 },
  ];
}

const STEP_DIAGONAL = Math.sqrt(2);

function getAdjacentCellsDiagonal(cell, steps) {
  return [
    { row: cell.row - 1, col: cell.col - 1, steps: steps + STEP_DIAGONAL },
    { row: cell.row + 1, col: cell.col + 1, steps: steps + STEP_DIAGONAL },
    { row: cell.row - 1, col: cell.col + 1, steps: steps + STEP_DIAGONAL },
    { row: cell.row + 1, col: cell.col - 1, steps: steps + STEP_DIAGONAL },
  ];
}
