import Fight from "./fight.js";

export default class Battle {

  constructor(warriors, enemies) {
    this.warriors = warriors;
    this.enemies = enemies;
    this.fights = [];

    if (warriors && enemies) {
      for (const warrior of warriors) {
        warrior.weapon.dps = warrior.weapon.damage / warrior.weapon.speed;
      }

      for (const enemy of enemies) {
//        const engagedWarriors = [];
//
//        for (const warrior of warriors) {
//          if (warrior.combat.targetUnitTag === enemy.tag) {
//            engagedWarriors.push(warrior);
//          }
//        }
//
//        if (engagedWarriors.length) {
//          this.fights.push(new Fight(engagedWarriors, enemy));
//        }

        enemy.weapon.dps = enemy.weapon.damage / enemy.weapon.speed;
      }

      this.calculate();
    }
  }

  addFight(warriors, enemy) {
    this.fights.push(new Fight(warriors, enemy));
    this.calculate();

    return this;
  }

  derive(warrior, enemy) {
    return this;
//    for (const fight of this.fights) if (fight.hasEngagedWarrior(warrior) && fight.hasEngagedEnemy(enemy)) return this;
//
//    const battle = new Battle();
//    const fights = [];
//
//    let isEnemyEngaged = false;
//
//    for (const fight of this.fights) {
//      if (fight.hasEngagedEnemy(enemy)) {
//        fights.push(new Fight([...fight.warriors, warrior], enemy));
//        isEnemyEngaged = true;
//      } else if (fight.hasEngagedWarrior(warrior)) {
//        if (fight.warriors.length > 1) {
//          const warriors = [...fight.warriors];
//          warriors.splice(warriors.indexOf(warrior), 1);
//          fights.push(new Fight(warriors, fight.enemy));
//        }
//      } else {
//        fights.push(fight);
//      }
//    }
//
//    if (!isEnemyEngaged) {
//      fights.push(new Fight([warrior], enemy));
//    }
//
//    battle.warriors = this.warriors;
//    battle.enemies = this.enemies;
//    battle.change = { warrior: warrior, enemy: enemy };
//    battle.fights = fights;
//    battle.calculate();
//
//    return battle;
  }

  calculate() {
    const unengagedEnemies = this.enemies.filter(enemy => !this.fights.find(fight => (fight.enemy === enemy)));

    let score = 0;
    let step = 0;
    let dps = 0;
    let healthOfUnengagedEnemies = calculateTotalHealth(unengagedEnemies);

    this.fights.sort((a, b) => (a.stepsToKill - b.stepsToKill));

    // Calculate the score for the steps between different fights end
    for (const fight of this.fights) {
      if (fight.stepsToKill === Infinity) continue;

      const steps = fight.stepsToKill - step;

      if (steps * dps <= healthOfUnengagedEnemies) {
        for (const one of this.fights) {
          if (one.stepsToKill >= fight.stepsToKill) {
            score += steps * one.enemy.weapon.dps;
          }
        }
        for (const enemy of unengagedEnemies) {
          score += steps * enemy.weapon.dps;
        }

        step = fight.stepsToKill;
        healthOfUnengagedEnemies -= steps * dps;
        dps += calculateTotalDamagePerStep(fight.warriors);
      } else {
        for (const one of this.fights) {
          if (one.stepsToKill > step) {
            unengagedEnemies.push(one.enemy);
            healthOfUnengagedEnemies += Math.max((one.enemy.armor.health - calculateDamageUntilStep(one.attacks, step)), 0);
          }
        }

        break;
      }
    }

    // Calculate the score for all unengaged enemies after all fights have ended
    const remainingSteps = healthOfUnengagedEnemies / calculateTotalDamagePerStep(this.warriors);
    for (const enemy of unengagedEnemies) {
      score += remainingSteps * enemy.weapon.dps;
    }

    this.score = score;
  }

  isWarriorEngagingEnemy(warrior, enemy) {
    return !!this.fights.find(fight => fight.isWarriorEngagingEnemy(warrior, enemy));
  }

  isWarriorContributing(warrior) {
    return !!this.fights.find(fight => fight.isWarriorContributing(warrior));
  }

  show() {
    const line = [];

    line.push(this.score.toFixed(2));

    for (const fight of this.fights) {
      line.push("|");

      for (const attack of fight.attacks) {
        line.push(attack.warrior.nick);
        line.push("(" + Math.round(attack.start) + ")");
      }

      line.push("->");
      line.push(fight.enemy.nick);
    }

    console.log(line.join(" "));
  }
}

function calculateDamageUntilStep(attacks, end) {
  let damage = 0;
  let dps = 0;
  let step = 0;

  for (const attack of attacks) {
    const steps = Math.min(attack.start - step, end - step);

    damage += steps * dps;
    step += steps;

    if (step >= end) break;
  }

  return damage;
}

function calculateTotalDamagePerStep(units) {
  let total = 0;

  for (const unit of units) {
    total += unit.weapon.dps;
  }

  return total;
}

function calculateTotalHealth(units) {
  let total = 0;

  for (const unit of units) {
    total += unit.armor.health;
  }

  return total;
}
