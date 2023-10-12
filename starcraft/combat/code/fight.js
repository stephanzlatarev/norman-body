import Path from "./path.js";

export default class Fight {

  constructor(combat, enemy) {
    this.combat = combat;
    this.enemy = enemy;
    this.warriors = new Set();
  }

  engageWarrior(warrior) {
    this.warriors.add(warrior);
  }

  isEngagedWarrior(warrior) {
    return this.warriors.has(warrior);
  }

  canEngageWarrior(warrior) {
    if (warrior.weapon.isMelee) {
      let count = 0;

      for (const warrior of this.warriors) {
        if (warrior.weapon.isMelee) {
          count++;
        }
      }

      if (count >= 2) {
        return false;
      }
    }

    return true;
  }

  disengageWarrior(warrior) {
    this.warriors.delete(warrior);
  }

  calculate() {
    this.attacks = assessAttacks(this.combat, this.enemy);
    this.collateralDamagePerStep = assessCollateralDamagePerStep(this.combat, this.enemy);
  }

  calculateDamage(stepsLimit, includeWarrior, excludeWarrior) {
    let steps = 0;
    let damageGiven = 0;
    let damageTaken = 0;

    const attacks = [];
    for (const warrior of this.warriors) {
      if (warrior !== excludeWarrior) {
        attacks.push({
          stepsToEngage: this.attacks.get(warrior).stepsToEngage,
          damage: warrior.weapon.damage,
          speed: warrior.weapon.speed,
          cooldown: 0,
        });
      }
    }

    if (includeWarrior && !this.warriors.has(includeWarrior)) {
      attacks.push({
        stepsToEngage: this.attacks.get(includeWarrior).stepsToEngage,
        damage: includeWarrior.weapon.damage,
        speed: includeWarrior.weapon.speed,
        cooldown: 0,
      });
    }

    // TODO: Check if at least one warrior can damage this particular enemy unit
    if (!attacks.length) return { given: 0, taken: stepsLimit * this.collateralDamagePerStep };

    attacks.sort((a, b) => (b.stepsToEngage - a.stepsToEngage));

    for (let enemyHealth = this.enemy.armor.health; (enemyHealth > 0) && (steps < stepsLimit); steps++) {
      for (const attack of attacks) {
        if (steps < attack.stepsToEngage) continue;

        if (attack.cooldown <= 0) {
          damageGiven += attack.damage;
          enemyHealth -= attack.damage;
          attack.cooldown += attack.speed;
        } else {
          attack.cooldown--;
        }
      }
    }

    damageTaken = steps * this.collateralDamagePerStep;

    if (steps < stepsLimit) {
      let damageGivenPerStep = 0;

      for (const attack of attacks) {
        damageGivenPerStep += attack.damage / attack.speed;
      }

      damageGiven += (stepsLimit - steps) * damageGivenPerStep;
    }

    return {
      given: damageGiven,
      taken: damageTaken,
    };
  }

}

class Attack {

  constructor(combat, warrior, enemy) {
    this.combat = combat;
    this.warrior = warrior;
    this.enemy = enemy;

    this.stepsToEngage = Infinity;
  }

  calculate() {
    const path = new Path(this.warrior).calculate(Array.from(this.combat.units.values()));
    const reach = path.getStepsToReach(this.enemy);
    const stepsToReachEnemy = reach / this.warrior.body.speed;
    const stepsToLoadWeapon = this.warrior.weapon.cooldown;

    this.stepsToEngage = Math.max(stepsToReachEnemy, stepsToLoadWeapon);
  }

}

// Assess attacks in a fight by warrior's damage, weapon speed, time to load weapon, and distance by movement speed avoiding obstacles.
function assessAttacks(combat, enemy) {
  const attacks = new Map();

  for (const unit of combat.units.values()) {
    if (unit.isWarrior) {
      attacks.set(unit, new Attack(combat, unit, enemy));
    }
  }

  for (const attack of attacks.values()) {
    attack.calculate();
  }

  return attacks;
}

// Assess collateral damage of enemy unit and its supporters based on damage, weapon speed, and distance by movement speed.
function assessCollateralDamagePerStep(combat, enemy) {
  let dps = enemy.weapon.damage / enemy.weapon.speed;

  for (const another of combat.units.values()) {
    if ((enemy !== another) && another.isEnemy) {
      dps += enemy.weapon.damage / enemy.weapon.speed / distance(enemy.body, another.body);
    }
  }

  return dps;
}

function distance(a, b) {
  return Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y));
}
