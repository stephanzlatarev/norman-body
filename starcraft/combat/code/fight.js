
const COLLISION_TOLERANCE = 0.2;

export default class Fight {

  constructor(warriors, enemy) {
    this.warriors = warriors;
    this.enemy = enemy;

    this.attacks = getAttacks(warriors, enemy);
    this.stepsToKill = calculateStepsToKill(enemy, this.attacks);

    for (const attack of this.attacks) {
      attack.isActive = (attack.start < this.stepsToKill);
    }

    this.score = this.enemy.weapon.dps * this.stepsToKill;
  }

  hasEngagedEnemy(enemy) {
    return (this.enemy === enemy);
  }

  hasEngagedWarrior(warrior) {
    return (this.warriors.indexOf(warrior) >= 0);
  }

  isWarriorEngagingEnemy(warrior, enemy) {
    return !!this.attacks.find(attack => (attack.warrior === warrior) && (attack.enemy === enemy));
  }

  isWarriorContributing(warrior) {
    return !!this.attacks.find(attack => attack.isActive && (attack.warrior === warrior));
  }

  toJsonString() {
    const warriors = this.warriors.map(w => w.tag);
    warriors.sort();
    
    return JSON.stringify({ warriors: warriors, enemy: this.enemy.tag });
  }

}

class Attack {

  constructor(warrior, enemy) {
    this.warrior = warrior;
    this.enemy = enemy;

    this.damagePerStep = warrior.weapon.dps;
    this.radius = warrior.body.radius;

    this.calculate([]);
  }

  calculate(attacks) {
    const contact = this.warrior.combat.path.contact(this.enemy, attacks);

    this.stepsToReachEnemy = (contact.steps / this.warrior.body.speed);
    this.stepsToLoadWeapon = this.warrior.weapon.cooldown;
    this.start = Math.max(this.stepsToReachEnemy, this.stepsToLoadWeapon);

    this.x = contact.x;
    this.y = contact.y;
  }

  accepts(attack) {
    const distanceX = this.x - attack.x;
    const distanceY = this.y - attack.y;
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

    return (distance - this.radius - attack.radius > COLLISION_TOLERANCE);
  }

  static orderByStart(a, b) {
    return a.start - b.start;
  }

}

function getAttacks(warriors, enemy) {
  const attacks = [];
  const confirmed = [];

  for (const warrior of warriors) {
    attacks.push(new Attack(warrior, enemy));
  }

  attacks.sort(Attack.orderByStart);

  for (const attack of attacks) {
    if (!attack.accepts(confirmed)) {
      attack.calculate(confirmed);
    }

    confirmed.push(attack);
  }

  attacks.sort(Attack.orderByStart);

  return attacks;
}

function calculateStepsToKill(unit, attacks) {
  let health = unit.armor.health;
  let dps = 0;
  let step = 0;

  for (const attack of attacks) {
    const steps = attack.start - step;
    const damage = steps * dps;

    if (damage >= health) break;

    health -= damage;
    dps += attack.damagePerStep;
    step += steps;
  }

  return step + health / dps;
}
