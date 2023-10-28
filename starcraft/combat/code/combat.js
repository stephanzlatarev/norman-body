import engage from "./engage.js";
import maneuver from "./maneuver.js";

const LOG = false;

export default class Combat {

  run(units) {

    // Body skill "engage"
    const battle = engage(units);

    // Body skill "maneuver"
    const commands = maneuver(battle);

    if (LOG) log(units, battle, commands);

    return commands;
  }

}

let step = 1;

function log(units, battle, commands) {
  const logs = [];

  for (const unit of units.values()) {
    const u = {...unit};
    delete u.combat;
    logs.push(JSON.stringify(u));
  }

  for (const fight of battle.fights) {
    logs.push(fight.toJsonString());
  }

  for (const command of commands) {
    logs.push(JSON.stringify(command));
  }

  console.log("\r\n\r\n# Step " + (step++) + "\r\n" + logs.join("\r\n"));
}
