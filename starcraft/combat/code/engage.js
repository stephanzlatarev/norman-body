import Fight from "./fight.js";
import Path from "./path.js";

export default function(units) {
  const warriors = [];
  const enemies = [];

  for (const unit of units.values()) {
    if (unit.isEnemy) {
      enemies.push(unit);
    } else if (unit.isWarrior) {
      unit.path = new Path(unit).calculate(units);
      warriors.push(unit);
    }
  }

  const fights = [];
  for (const enemy of enemies) {
    fights.push(new Fight(enemy, warriors));
  }

  const engagements = new Map();
  const efficiencies = new Map();
  for (const warrior of warriors) {
    efficiencies.set(warrior, -Infinity);
  }

  while (true) {
    let bestEfficiency = -Infinity;
    let engageWarrior;
    let engageFight;

    for (const warrior of warriors) {
      for (const fight of fights) {
        let thisEfficiency = efficiency(fights, fight, warrior);

        console.log(thisEfficiency.toFixed(2), "\t", warrior.nick, "->", fight.enemy.nick, "|", show(fights));

        if ((thisEfficiency > bestEfficiency) && (thisEfficiency > efficiencies.get(warrior))) {
          bestEfficiency = thisEfficiency;
          engageWarrior = warrior;
          engageFight = fight;
        }
      }
    }

    if (engageWarrior && engageFight) {
      console.log(bestEfficiency.toFixed(2), "\t", "engage:", engageWarrior.nick, engageFight.enemy.nick);

      const previousFight = engagements.get(engageWarrior);
      if (previousFight) previousFight.disengageWarrior(engageWarrior);

      engagements.set(engageWarrior, engageFight);
      engageFight.engageWarrior(engageWarrior);

      efficiencies.set(engageWarrior, bestEfficiency);

      engageWarrior = null;
      engageFight = null;
    } else {
      break;
    }
  }

  return fights.filter(fight => !!fight.warriors.length);
}

function efficiency(fights, fight, warrior) {
  let totalGain = 0;
  let totalLoss = 0;
  let potential = 0;

  for (const f of fights) {
    let engaged = false;

    if (fight && warrior) {
      if (f === fight) {
        engaged = f.engageWarrior(warrior);
      } else {
        engaged = f.disengageWarrior(warrior);
      }
    }

    if (f == fight) {
      potential = fight.efficiency(false).efficiency;
    }

    const { gain, loss } = f.efficiency(true);

    totalGain += gain;
    totalLoss += loss;

    if (engaged) {
      if (f === fight) {
        f.disengageWarrior(warrior);
      } else {
        f.engageWarrior(warrior);
      }
    }
  }

  return Math.max(totalGain / totalLoss, potential);
}

function show(fights) {
  const line = [];

  for (const fight of fights) {
    if (fight.warriors.length) {
      line.push(...fight.warriors.map(w => w.nick), "->", fight.enemy.nick);
    }
  }

  return line.join(" | ");
}
