import engage from "./engage.js";
import maneuver from "./maneuver.js";

const LOG = false;

export default class Combat {

  run(units) {

    if (LOG) logBefore(units);

    // Body skill "engage"
    const battle = engage(units);

    // Body skill "maneuver"
    const commands = maneuver(battle);

    if (LOG) logAfter(battle, commands);

    return commands;
  }

}

let step = 1;

function logBefore(units) {
  const logs = [];

  for (const unit of units.values()) {
    logs.push(JSON.stringify({
      ...unit,
      combat: {
        targetUnitTag: unit.combat ? unit.combat.targetUnitTag : undefined,
      }
    }));
  }

  console.log("\r\n\r\n# Step " + (step++) + "\r\n" + logs.join("\r\n"));
}

function logAfter(battle, commands) {
  const logs = [];

  for (const fight of battle.fights) {
    logs.push(fight.toJsonString());
  }

  for (const command of commands) {
    logs.push(JSON.stringify(command));
  }

  console.log("\r\n\r\n" + logs.join("\r\n"));
}
