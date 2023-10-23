import engage from "./engage.js";
import maneuver from "./maneuver.js";

const LOG = false;

export default class Combat {

  run(units) {

    // Body skill "engage"
    const fights = engage(units);

    // Body skill "maneuver"
    const commands = maneuver(fights);

    if (LOG) log(units, fights, commands);

    return commands;
  }

}

function log(units, fights, commands) {
  const logs = [];

  for (const unit of units.values()) {
    const u = {...unit};
    delete u.path;
    logs.push(JSON.stringify(u));
  }

  for (const fight of fights) {
    logs.push(fight.toJsonString());
  }

  for (const command of commands) {
    logs.push(JSON.stringify(command));
  }

  console.log("\r\n#\r\n" + logs.join("\r\n"));
}
