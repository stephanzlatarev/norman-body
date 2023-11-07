
The combat body skill controls warrior units in missions.

### Missions

Mission types:
* Assault - Warriors are directed to the location of assault missions to attack the enemies near it. There may be multiple assault missions, and warriors engage in their nearest one.
* Future - Locations with enemy units, which our warriors cannot engage become future missions. They will become fight missions when we build stronger army.
* Scout - Detectors, light warriors, or workers are directed to scout target locations to detect enemy presence.
* Diversion - Locations with enemy economy structures or other places the enemy monitors may be selected as targets for diversion missions. Fast and stealth warriors are directed to them to distract the enemy or deal strategic damage.

The combat body skill will maintain a single mission at all times, except if there are missions created by mind skills.

If there are one or more visible enemy units, it will be an **assault** mission targeted at the enemy unit which is closest to own base. Any previous assault missions will become **future** missions.

Otherwise, if there are *future* missions, the one which is closest to own base transitions to **assault** mission. In the future, selected future missions may become *scout* missions before one becomes an *assault* mission.

Otherwise, it will be a **scout** mission at a random location on the map.

### Engaging warriors

The combat body skill engages warriors in missions by:
* Selecting special units like detectors for scout missions and cloaked units for diversion missions, if any.
* Splitting warriors to engage in their closest assault mission.

### Commanding warriors

The combat body skill commands warriors by issue move and attack commands:
* When a warrior is outside range of mission target, a move command is issued to the warrior to approach the target of the mission.
* When a warrior is within range, a move or attack command is issued to perform the mission.
