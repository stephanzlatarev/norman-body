import Battle from "./battle.js";
import Path from "./path.js";

const LIMIT_ITERATIONS = 20;

export default function(units, callback) {
  let battle = startBattle(units);
  let iteration = 0;
  let update;

  if (callback) callback(battle);

  while ((iteration++ < LIMIT_ITERATIONS) && (update = updateBattle(battle))) {
    battle = update;

    if (callback) callback(battle);
  }

  return battle;
}

function startBattle(units) {
  const warriors = [];
  const enemies = [];

  for (const unit of units.values()) {
    if (unit.isEnemy) {
      enemies.push(unit);
    } else if (unit.isWarrior) {
      sync(unit, units);
      warriors.push(unit);
    }
  }

  return new Battle(warriors, enemies);
}

function sync(unit, units) {
  if (!unit.combat) {
    unit.combat = {
      targetUnitTag: null,
    };
  }

  unit.combat.path = new Path(unit).calculate(units);
}

function updateBattle(battle) {
  let bestBattle = battle;
  let efficiency = -Infinity;

  for (const warrior of battle.warriors) {
    let bestWarriorAlternative;
    let bestWarriorEnemy;
    let bestWarriorEfficiency = -Infinity;

    for (const enemy of battle.enemies) {
      const alternative = battle.derive(warrior, enemy);

      if (alternative.isWarriorContributing(warrior) && (alternative.efficiency > bestWarriorEfficiency)) {
        bestWarriorAlternative = alternative;
        bestWarriorEnemy = enemy;
        bestWarriorEfficiency = alternative.efficiency;
      }
    }

    if (bestWarriorAlternative && (bestWarriorEfficiency > efficiency) && !battle.isWarriorEngagingEnemy(warrior, bestWarriorEnemy)) {
      bestBattle = bestWarriorAlternative;
      efficiency = bestWarriorEfficiency;
    }
  }

  if ((bestBattle !== battle) && bestBattle.change) {
    const warrior = bestBattle.change.warrior;
    const enemy = bestBattle.change.enemy;

    // Engage enemy with this warrior
    warrior.combat.targetUnitTag = enemy.tag;

    return bestBattle;
  }
}
