import engage from "./engage.js";
import maneuver from "./maneuver.js";

const LOG = false;

export default class Combat {

  run(units) {
    this.units = units;

    // Body skill "engage"
    const fights = engage(this);

    // Body skill "maneuver"
    const commands = maneuver(fights);

    if (LOG) log(units, commands);

    return commands;
  }

}

function log(units, commands) {
  const logs = [];

  for (const unit of units.values()) {
    logs.push(JSON.stringify(unit));
  }

  for (const command of commands) {
    logs.push(JSON.stringify(command));
  }

  console.log("\r\n#\r\n" + logs.join("\r\n"));
}
