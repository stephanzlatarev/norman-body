import Fight from "./fight.js";

export default function(combat) {
  const units = Array.from(combat.units.values());
  const warriors = [];
  const enemies = [];
  const engagements = []

  for (const unit of units) {
    if (unit.isEnemy) {
      enemies.push(unit);
    } else if (unit.isWarrior) {
      warriors.push(unit);
    }
  }

  while (warriors.length && enemies.length) {
    const fights = enemies.map(enemy => new Fight(enemy, warriors, units));
    const end = calculateEnd(fights);

    let bestScore = -Infinity;
    let bestEngagement;

    for (const fight of fights) {
      for (const warrior of warriors) {
        const band = fight.getBand(warrior);
        const score = calculateScore(fight, band, end, fights);

        if (score > bestScore) {
          bestScore = score;
          bestEngagement = { enemy: fight.enemy, warriors: band };
        }
      }
    }

    if (!bestEngagement) break;

    engagements.push(bestEngagement);

    remove(enemies, bestEngagement.enemy);
    remove(warriors, ...bestEngagement.warriors);
  }

  // TODO: Assign remaining warriors to closest fight
  while (warriors.length && engagements.length) {
    for (const fight of engagements) {
      const warrior = warriors[warriors.length - 1];
      fight.warriors.push(warrior);
      warriors.length = warriors.length - 1;
      if (!warriors.length) break;
    }
  }

  return engagements;
}

function calculateEnd(fights) {
  let end = 0;

  for (const fight of fights) {
    end += fight.end;
  }

  return end;
}

function calculateScore(fight, band, end, fights) {
  const gain = calculateContribution(fight, band, end);

  let loss = 0;

  for (const other of fights) {
    if (other === fight) continue;

    loss += calculateContribution(other, band, end);
  }

  loss /= fights.length;

  return gain - loss;
}

function calculateContribution(fight, band, end) {
  const contribution = fight.getContribution(band);
  const enemyDamagePerStep = fight.enemy.weapon.damage / fight.enemy.weapon.speed;
  // TODO: Alternatively use the end of fight with the given band instead of the end of fight with all warriors?
  const reductionOfEnemyLife = end - fight.end;

  return contribution * enemyDamagePerStep * reductionOfEnemyLife;
}

function remove(list, ...units) {
  for (const unit of units) {
    const index = list.indexOf(unit);

    if (index >= 0) {
      list.splice(index, 1);
    }
  }
}
