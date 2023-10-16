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
    console.log(
      "engage:", bestEngagement.warriors.map(w => w.nick).join(" "),
      "vs", bestEngagement.enemy.nick,
      "score:", Math.floor(bestScore)
    );

    remove(enemies, bestEngagement.enemy);
    remove(warriors, ...bestEngagement.warriors);
  }

  if (warriors.length) {
    console.log("TODO: Assign remaining warriors to closest fight");
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

  console.log("score:", Math.floor(gain - loss), "=", Math.floor(gain), "-", Math.floor(loss),
      "\ttill:", end,
      "\t", fight.enemy.nick, "vs", band.map(w => w.nick).join(" "),
  );

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
