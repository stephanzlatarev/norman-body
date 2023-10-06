import engage from "./engage.js";
import maneuver from "./maneuver.js";

const LOG = false;

export default class Combat {

  run(units) {
    // Update combat properties of units
    for (const unit of units.values()) {
      sync(unit);
    }

    // Body skill "engage"
    const fights = engage(units);

    // Body skill "maneuver"
    const commands = maneuver(fights);

    if (LOG) log(units, commands);

    return commands;
  }

}

function sync(unit) {
  if (unit.combat) {
    // Update combat properties
    unit.combat.health = unit.health + unit.shield;
  } else {
    // Initialize combat properties
    unit.combat = {
      // Fixed properties
      isWarrior: (unit.owner === 1) && unit.kind && (unit.kind.damage > 0),
      isEnemy: (unit.owner === 2),
      isObstacle: !unit.kind || !unit.kind.damage,

      // Changing properties
      health: unit.health + unit.shield,
    };
  }
}

function log(units, commands) {
  const logs = [];

  for (const unit of units.values()) {
    const order = {};
    order.abilityId = unit.order.abilityId;
    if (unit.order.targetUnitTag) order.targetUnitTag = unit.order.targetUnitTag;
    if (unit.order.targetWorldSpacePos) order.targetUnitTag = unit.order.targetWorldSpacePos;

    logs.push(JSON.stringify({
      tag: unit.tag,
      kind: unit.kind,
      owner: unit.owner,
      pos: { x: Number(unit.pos.x.toFixed(2)), y: Number(unit.pos.y.toFixed(2)) },
      order: order,
      radius: unit.radius,
      health: unit.health,
      shield: unit.shield,
    }));
  }

  for (const command of commands) {
    logs.push(JSON.stringify(command));
  }

  console.log("\r\n#\r\n" + logs.join("\r\n"));
}
