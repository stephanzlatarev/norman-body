import Fight from "./fight.js";

export default function(combat) {
  const fights = [];
  const warriors = [];
  const enemies = [];

  for (const unit of combat.units.values()) {
     if (unit.isEnemy) {
      fights.push(new Fight(combat, unit));
      enemies.push(unit);
    } else if (unit.isWarrior) {
      warriors.push(unit);
    }
  }

  if (warriors.length && enemies.length && fights.length) {
    for (const fight of fights) fight.calculate();

    let isImproving = true;
    while (isImproving) {
      isImproving = false;

      for (const warrior of warriors) {
        let bestEfficiency = -Infinity;
        let bestFight;
        let lastFight;

        for (const fight of fights) {
          if (fight.isEngagedWarrior(warrior)) {
            lastFight = fight;
          }

          fight.disengageWarrior(warrior);
        }

        for (const fight of fights) {
          let damageGiven = 0;
          let damageTaken = 0;

          for (const f of fights) {
            const damage = f.calculateDamage(200, (f === fight) ? warrior : null);
            damageGiven += damage.given;
            damageTaken += damage.taken;
          }

          const efficiency = damageGiven / damageTaken;

          if (efficiency > bestEfficiency) {
            bestEfficiency = efficiency;
            bestFight = fight;
          }
        }

        if (bestFight) {
          bestFight.engageWarrior(warrior);

          if (bestFight !== lastFight) {
            isImproving = true;
          }
        }
      }
    }
  } else {
    fights.length = 0;
  }

  return fights;
}
