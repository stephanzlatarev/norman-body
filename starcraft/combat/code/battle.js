
const WALK_PENALTY = 1;
const COLLISION_TOLERANCE = 0.2;

export default class Battle {

  constructor(warriors, enemies) {
    this.warriors = warriors;
    this.enemies = enemies;
    this.fights = [];

    if (warriors && enemies) {
      for (const enemy of enemies) {
        const engagedWarriors = [];

        for (const warrior of warriors) {
          if (warrior.combat.targetUnitTag === enemy.tag) {
            engagedWarriors.push(warrior);
          }
        }

        if (engagedWarriors.length) {
          this.fights.push(new Fight(engagedWarriors, enemy));
        }
      }

      this.calculate();
    }
  }

  derive(warrior, enemy) {
    for (const fight of this.fights) if (fight.hasEngagedWarrior(warrior) && fight.hasEngagedEnemy(enemy)) return this;

    const battle = new Battle();
    const fights = [];

    let isEnemyEngaged = false;

    for (const fight of this.fights) {
      if (fight.hasEngagedEnemy(enemy)) {
        fights.push(new Fight([...fight.warriors, warrior], enemy));
        isEnemyEngaged = true;
      } else if (fight.hasEngagedWarrior(warrior)) {
        if (fight.warriors.length > 1) {
          const warriors = [...fight.warriors];
          warriors.splice(warriors.indexOf(warrior), 1);
          fights.push(new Fight(warriors, fight.enemy));
        }
      } else {
        fights.push(fight);
      }
    }

    if (!isEnemyEngaged) {
      fights.push(new Fight([warrior], enemy));
    }

    battle.warriors = this.warriors;
    battle.enemies = this.enemies;
    battle.change = { warrior: warrior, enemy: enemy };
    battle.fights = fights;
    battle.calculate();

    return battle;
  }

  calculate() {
    let gain = 0;
    let loss = 0;

    for (const fight of this.fights) {
      gain += fight.gain;
      loss += fight.loss;
    }

    this.efficiency = gain / loss;
  }

  isWarriorEngagingEnemy(warrior, enemy) {
    return !!this.fights.find(fight => fight.isWarriorEngagingEnemy(warrior, enemy));
  }

  isWarriorContributing(warrior) {
    return !!this.fights.find(fight => fight.isWarriorContributing(warrior));
  }

}

class Fight {

  constructor(warriors, enemy) {
    this.warriors = warriors;
    this.enemy = enemy;

    this.attacks = getAttacks(warriors, enemy);
    this.stepsToKill = calculateStepsToKill(enemy, this.attacks);

    let activeAttacksCount = 0;
    for (const attack of this.attacks) {
      if (attack.start < this.stepsToKill) {
        attack.isActive = true;
        activeAttacksCount++;
      } else {
        attack.isActive = false;
      }
    }

    const enemyDamagePerStep = enemy.weapon.damage / enemy.weapon.speed;
    this.gain = enemyDamagePerStep / this.stepsToKill;

    let loss = 0;
    for (const attack of this.attacks) {
      if (attack.isActive) {
        loss += attack.calculateLoss(activeAttacksCount, this.stepsToKill);
      }
    }
    this.loss = loss;

    this.efficiency = this.gain / this.loss;
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

    this.damagePerStep = warrior.weapon.damage / warrior.weapon.speed;
    this.radius = warrior.body.radius;

    this.calculate([]);
  }

  calculate(attacks) {
    const contact = this.warrior.combat.path.contact(this.enemy, attacks);
    const stepsToReachEnemy = (contact.steps / this.warrior.body.speed) * WALK_PENALTY;
    const stepsToLoadWeapon = this.warrior.weapon.cooldown;

    this.x = contact.x;
    this.y = contact.y;
    this.steps = Math.max(stepsToReachEnemy, stepsToLoadWeapon);
    this.start = this.steps;

    this.end = 0;
    this.loss = 0;
  }

  calculateLoss(activeAttacksCount, stepsToKill) {
    const enemyDamagePerStep = this.enemy.weapon.damage / this.enemy.weapon.speed / activeAttacksCount;

    this.end = this.warrior.armor.health / enemyDamagePerStep;
    this.loss = (this.damagePerStep / this.end) * (1 + this.start / stepsToKill);

    return this.loss;
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
