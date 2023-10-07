import Fight from "./fight.js";

export default function(units) {
  const fights = [];
  const warriors = [];
  const enemies = [];

  for (const unit of units.values()) {
     if (unit.combat.isEnemy) {
      fights.push(new Fight(unit));
      enemies.push(unit);
    } else if (unit.combat.isWarrior) {
      warriors.push(unit);
    }
  }

  if (warriors.length && enemies.length) {
    assessVulnerability(fights, enemies);
    assessAttacks(fights, warriors);
    engageClosestWarriors(fights, warriors);
    optimizeFights(fights, enemies);
  } else {
    fights.length = 0;
  }

  return fights;
}

// Assess strength of enemy units based on the health, damage, weapon speed, and distance by movement speed of the unit and its supporting units.
function assessVulnerability(fights, enemies) {
  for (const fight of fights) {
    fight.enemyStrength = 0;

    for (const enemy of enemies) {
      if (fight.enemy !== enemy) {
        fight.enemyStrength += support(fight.enemy, enemy);
      }
    }
  }

  fights.sort((a, b) => (a.enemyStrength - b.enemyStrength));
}

function support(a, b) {
  const d = distance(a, b);
  return (d < 10) ? (10 - d) : 0;
}

// Assess attacks of a warrior in a fight by warrior's damage, weapon speed, time to load weapon, and distance by movement speed avoiding obstacles.
function assessAttacks(fights, warriors) {
  for (const fight of fights) {
    for (const warrior of warriors) {
      fight.addAttack(warrior, distance(warrior, fight.enemy));
    }
  }
}

// Match warriors with the closest enemy unit.
function engageClosestWarriors(fights, warriors) {
  for (const warrior of warriors) {
    let selectedFight;
    let selectedDistance = Infinity;

    for (const fight of fights) {
      // TODO: Use smarter way to choose which warrior to enage first with an enemy
      if (isEnemyOverPowered(fight)) continue;

      const distance = fight.attacks.get(warrior);

      if (distance < selectedDistance) {
        selectedFight = fight;
        selectedDistance = distance;
      }
    }

    selectedFight.engageWarrior(warrior);
  }
}

// Make sure the most vulnerable enemies are engaged with priority, and that all enemies are outpowered.
function optimizeFights(fights) {
  for (let i = 0; i < fights.length; i++) {
    const fight = fights[i];

    if (!isEnemyOverPowered(fight)) {
      // Find warriors from later fights that can over-power the enemy in this fight
      const supports = [];

      for (let j = i + 1; j < fights.length; j++) {
        const lessImportantFight = fights[j];

        for (const warrior of lessImportantFight.warriors) {
          if (areAttacksComparable(lessImportantFight.getAttack(warrior), fight.getAttack(warrior))) {
            supports.push({ warrior: warrior, fight: lessImportantFight });
          }
        }
      }

      if (isEnemyOverPowered(fight, supports.map(one => one.warrior))) {
        // The supporting warriors will over-power the enemy
        for (const support of supports) {
          fight.engageWarrior(support.warrior);
          support.fight.disengageWarrior(support.warrior);

          if (isEnemyOverPowered(fight)) break;
        }
      }
    }
  }
}

// An enemy is over-powered when the attacking warriors can kill it before it kills them
function isEnemyOverPowered(fight, ...supportWarriors) {
  const warriorsCount = fight.warriors.size + (supportWarriors ? supportWarriors.length : 0);

  return (warriorsCount >= 2);
}

// A second attack is comparable to the first attack if its wasted damage is not very much
function areAttacksComparable(first, second) {
  // Currently the attack is simply the distance between the warrior and enemy
  return (second - first < 1);
}

function distance(a, b) {
  return Math.sqrt((a.pos.x - b.pos.x) * (a.pos.x - b.pos.x) + (a.pos.y - b.pos.y) * (a.pos.y - b.pos.y));
}
