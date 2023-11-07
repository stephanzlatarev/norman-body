import Battle from "./battle.js";
import Fight from "./fight.js";
import Path from "./path.js";

export default function(units, callback) {
  const { warriors, enemies } = sync(units);
  if (!warriors.length || !enemies.length) return null;

  const potential = enemies.map(enemy => new Battle(warriors, enemies).addFight(warriors, enemy));

  potential.sort((a, b) => (a.score - b.score));

  const targets = potential.map(battle => battle.fights[0].enemy);

  let battle = potential[0];

  if (callback) callback(battle);

  for (let i = 1; i < targets.length; i++) {
    const alternative = createBattle(warriors, enemies, targets.slice(0, i + 1));

    if (callback) callback(alternative);

    if (alternative.score < battle.score) {
      battle = alternative;
    } else if (alternative.score > battle.score) {
      break;
    }
  }

  return battle;
}

function sync(units) {
  const warriors = [];
  const enemies = [];

  for (const unit of units.values()) {
    if (unit.isEnemy) {
      enemies.push(unit);
    } else if (unit.isWarrior) {
      if (!unit.combat) {
        unit.combat = {};
      }
      unit.combat.path = new Path(unit).calculate(units);

      warriors.push(unit);
    }
  }

  return { warriors: warriors, enemies: enemies };
}

function createBattle(warriors, enemies, targets) {
  const battle = new Battle(warriors, enemies);
  const fights = [];
  const engagements = new Map();
  const engagedWarriors = new Set();

  for (const target of targets) {
    fights.push(new Fight(warriors, target));
    engagements.set(target, []);
  }

  let warrior;
  while (warrior = selectUnengagedWarrior(fights, engagedWarriors)) {
    const target = findClosestTarget(warrior, fights);

    if (!target) break;

    engagements.get(target).push(warrior);
    engagedWarriors.add(warrior);
    removeWarriorFromOtherFights(fights, warrior, target);
  }

  for (const [target, warriors] of engagements) {
    if (warriors.length) {
      battle.addFight(warriors, target);
    }
  }

  return battle;
}

function selectUnengagedWarrior(fights, engagedWarriors) {
  for (const fight of fights) {
    for (const attack of fight.attacks) {
      if (!engagedWarriors.has(attack.warrior)) {
        return attack.warrior;
      }
    }
  }
}

function findClosestTarget(warrior, fights) {
  let bestTarget;
  let bestStart = Infinity;

  for (const fight of fights) {
    const attack = fight.attacks.find(attack => (attack.warrior === warrior));

    if (attack && (attack.start < bestStart)) {
      bestStart = attack.start;
      bestTarget = fight.enemy;
    }
  }

  return bestTarget;
}

function removeWarriorFromOtherFights(fights, warrior, target) {
  for (let i = fights.length - 1; i >= 0; i--) {
    const fight = fights[i];
    if (fights[i].enemy === target) continue;

    const index = fight.warriors.indexOf(warrior);
    if (index >= 0) {
      if (fight.warriors.length > 1) {
        const warriors = [...fight.warriors];
        warriors.splice(index, 1);
        fights[i] = new Fight(warriors, fight.enemy);
      } else {
        fights.splice(i, 1);
      }
    }
  }
}
