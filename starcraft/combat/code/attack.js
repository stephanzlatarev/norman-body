
export default async function(combat) {
}

async function performAttack(combat, warrior, enemy) {
  if (warrior.order && (warrior.order.targetUnitTag === enemy.tag)) return true;

  return await combat.command({ unitTags: [warrior.tag], abilityId: 3674, targetUnitTag: enemy.tag, queueCommand: false });
}
