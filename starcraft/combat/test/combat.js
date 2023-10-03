import assert from "assert";
import Client from "./client.js";
import Combat from "../code/combat.js";

describe("Combat", function() {

  const client = new Client();

  it("No combat units", async function() {
    const combat = new Combat(client);
    await combat.run([], [], []);
    assert.equal(client.commands.length, 0, "Commands are issued");
  });

});
