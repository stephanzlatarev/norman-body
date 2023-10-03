
export default async function(combat) {
}

async function performMove(combat, warrior, pos) {
  await combat.command({ unitTags: [warrior.tag], abilityId: 16, targetWorldSpacePos: pos, queueCommand: false });
}
