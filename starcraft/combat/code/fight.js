
const WALK_PENALTY = 1;

export default class Fight {

  constructor(enemy, warriors) {
    this.enemy = enemy;
    this.allWarriors = warriors;
    this.warriors = [];

    this.steps = new Map();
    for (const warrior of warriors) {
      this.steps.set(warrior, calculateSteps(warrior, enemy));
    }
  }

  engageWarrior(warrior) {
    const index = this.warriors.indexOf(warrior);

    if (index < 0) {
      this.warriors.push(warrior);
      return true;
    }

    return false;
  }

  disengageWarrior(warrior) {
    const index = this.warriors.indexOf(warrior);

    if (index >= 0) {
      this.warriors.splice(index, 1);
      return true;
    }

    return false;
  }

  efficiency(assessEngagedWarriors) {
    const warriors = assessEngagedWarriors ? this.warriors : this.allWarriors;

    const warriorAttacks = [];
    for (const warrior of warriors) {
      warriorAttacks.push({ start: this.steps.get(warrior), dps: warrior.weapon.damage / warrior.weapon.speed });
    }

    const stepsToKillEnemy = stepsToKill(this.enemy, warriorAttacks);
    const enemyDamagePerStep = this.enemy.weapon.damage / this.enemy.weapon.speed;
    const gain = enemyDamagePerStep / stepsToKillEnemy;

    const enemyAttacks = [{ start: 0, dps: this.enemy.weapon.damage / this.enemy.weapon.speed / warriors.length }];

    let loss = 0;

    for (const warrior of warriors) {
      const stepsToReach = this.steps.get(warrior);
      const stepsToDie = stepsToKill(warrior, enemyAttacks);
      const damagePerStep = warrior.weapon.damage / warrior.weapon.speed;

      loss += (damagePerStep / stepsToDie) * (1 + stepsToReach / stepsToKillEnemy);
console.log(
  "\t", warrior.nick,
  "loss value:", damagePerStep.toFixed(4), stepsToDie.toFixed(4), (damagePerStep / stepsToDie).toFixed(4),
  "loss waste:", stepsToReach.toFixed(4), stepsToKillEnemy.toFixed(4), (stepsToReach / stepsToKillEnemy).toFixed(4),
);
    }

if (warriors.length) console.log("fight:", warriors.map(w => w.nick).join(" "), "->", this.enemy.nick,
  "gain:", gain.toFixed(4), "loss:", loss.toFixed(4), "efficiency:", (gain / loss).toFixed(4)
);
    return {
      gain: gain,
      loss: loss,
      efficiency: gain / loss,
    }
  }

  toJsonString() {
    const warriors = this.warriors.map(w => w.tag);
    warriors.sort();

    return JSON.stringify({ warriors: warriors, enemy: this.enemy.tag });
  }
}

function calculateSteps(warrior, enemy) {
  const reach = warrior.path.getStepsToReach(enemy);
  const stepsToReachEnemy = (reach / warrior.body.speed) * WALK_PENALTY;
  const stepsToLoadWeapon = warrior.weapon.cooldown;

  return Math.max(stepsToReachEnemy, stepsToLoadWeapon);
}

function stepsToKill(unit, attacks) {
  let health = unit.armor.health;
  let dps = 0;
  let step = 0;

  attacks.sort((a, b) => (a.start - b.start));

  for (const attack of attacks) {
    const steps = attack.start - step;
    const damage = steps * dps;

    if (damage >= health) break;

    health -= damage;
    dps += attack.dps;
    step += steps;
  }

  return step + health / dps;
}
