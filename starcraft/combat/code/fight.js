import Path from "./path.js";

const WALK_PENALTY = 2;

export default class Fight {

  constructor(enemy, warriors, units) {
    this.enemy = enemy;

    const plan = planFight(enemy, warriors, units);

    this.attacks = plan.attacks;
    this.start = plan.start;
    this.end = plan.end;
  }

  getBand(warrior) {
    const band = [];

    for (const attack of this.attacks) {
      band.push(attack.warrior);

      if (warrior === attack.warrior) break;
    }

    return band;
  }

  getContribution(band) {
    let contribution = 0;

    for (const attack of this.attacks) {
      if (band.indexOf(attack.warrior) >= 0) {
        contribution += attack.contribution;
      }
    }

    return contribution;
  }

}

class Attack {

  constructor(warrior, enemy, units) {
    this.warrior = warrior;
    this.enemy = enemy;

    const path = new Path(warrior).calculate(units);
    const reach = path.getStepsToReach(enemy);
    const stepsToReachEnemy = (reach / warrior.body.speed) * WALK_PENALTY;
    const stepsToLoadWeapon = warrior.weapon.cooldown;

    this.start = Math.max(stepsToReachEnemy, stepsToLoadWeapon);
    this.damage = warrior.weapon.damage;
    this.speed = warrior.weapon.speed;

    this.cooldown = warrior.weapon.cooldown;
    this.contribution = 0;
  }

}

function planFight(enemy, warriors, units) {
  const attacks = [];

  for (const warrior of warriors) {
    attacks.push(new Attack(warrior, enemy, units));
  }

  attacks.sort((a, b) => (a.start - b.start));

  let steps = 0;
  let start = Infinity;
  let contributions = 0;

  for (let enemyHealth = enemy.armor.health; enemyHealth > 0; steps++) {
    for (const attack of attacks) {
      if (steps < attack.start) continue;

      if (attack.cooldown <= 0) {
        if (steps < start) start = steps;

        attack.contribution += attack.damage;
        attack.cooldown += attack.speed;

        contributions += attack.damage;
        enemyHealth -= attack.damage;
      } else {
        attack.cooldown--;
      }
    }
  }

  for (const attack of attacks) {
    attack.contribution /= contributions;
  }

  attacks.sort((a, b) => (b.contribution - a.contribution));

  return {
    attacks: attacks,
    start: start,
    end: steps,
  };
}
