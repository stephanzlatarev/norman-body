
The combat body skill controls units that are not controlled by mind skills, i.e. there's no link between the unit and a skill in memory.

This skill works on two levels:

* Fight or rally - Available warriors are engaged in fights over one enemy unit or rallies to gathering points on the map. Mind skills can influence how warriors are engaged in fights or rallies by creating fight nodes or rally nodes in memory and linking warrior units to them.

* Warrior - Warriors engaged in fights are maneuvered to attack the enemy unit or to move to better positions. Warriors in rally are commanded to move to the corresponding rally points. Mind skills can influence how warriors maneuver in fights or rallies by linking the warrior nodes in memory to the controlling skill and issuing attack or move commands in memory.

### Enagement in fights

A fight is created for each enemy unit.
Each available warrior is initially engaged in the fight it will inflict the most damage to the enemy.
The engagements of warriors to fights are then optimized by considering individual transfers of one warrior to different fight.
A transfer is considered good when the overall damage inflicted by our warriors to the enemy units is much more than the damage taken comparing the warrior engaged in one fight versus engaging in the other fight.

### Maneuver in fights

Available warriors engaged in fights are commanded to move to positions that minimize the threat of being damaged by enemy units and that maximize the opportunity to damage enemy units.
