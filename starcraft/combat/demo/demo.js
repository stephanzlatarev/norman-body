import engage from "../code/engage.js";

const WIDTH = 600;
const HEIGHT = 600;

let ID = 1;
const selectors = new Set();
const toggles = new Map();

let cases;
let selectedStep;
let selectedUnit;

$(document).ready(async function() {
  display()
    .append($("<div id='cases' class='panel'>"))
    .append($("<div id='field' class='panel'>"))
    .append($("<div id='battles' class='panel'>"))
    .append($("<div id='unit' class='panel'>"));

  await loadCases();
  await loadCase(cases[0]);
});

function show(step) {
  selectedStep = step;

  if (!step.boundaries || !step.battles) {
    step.boundaries = calculateBoundaries(step);
    step.battles = calculateBattles(step);
  }

  showCases();
  showField(selectedStep);
  showBattles();
  showUnit();
}

function display() {
  for (const selector of selectors) {
    $("body").off("click", selector);
  }

  selectors.clear();

  return $("body").empty();
}

function onClick(selector, handler) {
  if (!selectors.has(selector)) {
    $("body").on("click", selector, handler);
    selectors.add(selector);
  }
}

function id() {
  return "ID" + (ID++);
}

function toggle(id) {
  toggles.set(id, !toggles.get(id));
}

async function loadCases() {
  return new Promise(function(resolve) {
    $.get("/list", function(data) {
      cases = data.map(one => ({ id: id(), file: one, title: one.split(".")[0], steps: [] }));
      resolve();
    });
  });
}

async function loadCase(one) {
  return new Promise(function(resolve) {
    $.get("/test/cases/" + one.file, function(data) {
      const lines = data.split("\n");
      let step;

      one.steps = [];

      for (const line of lines) {
        if (!line.trim().length) continue;

        if (line.startsWith("#")) {
          if (step && step.units.size) {
            one.steps.push(step);
          }
          
          step = {
            id: id(),
            title: line.slice(1).trim(),
            units: new Map(),
          };
        } else {
          const json = JSON.parse(line);
  
          if (json.tag) {
            if (!json.nick) json.nick = (json.tag.length > 3) ? json.tag.slice(json.tag.length - 3) : json.tag;
            if (!json.weapon.damage) json.armor.health = 0;
            step.units.set(json.tag, json);
          }
        }
      }

      if (step && step.units.size) {
        one.steps.push(step);
      }

      if (one.steps.length) {
        show(one.steps[0]);
      }

      resolve();
    });
  });
}

function showCases() {
  const list = [];

  list.push("<ul>");

  for (const one of cases) {
    if (one.steps.length) {
      list.push("<li>");
      list.push(one.title);
      list.push("<ul>");

      for (const step of one.steps) {
        const style = ["cursor: pointer"];
        if (step === selectedStep) style.push("font-weight: bold");

        list.push(`<li id="${step.id}" style="${style.join(';')}">`);
        list.push(step.title);
        list.push("</li>");

        onClick("#" + step.id, () => show(step));
      }

      list.push("</ul>");
      list.push("</li>");
    } else {
      list.push("<li id='" + one.id + "' style='cursor: pointer'>");
      list.push(one.title);
      list.push("</li>");

      onClick("#" + one.id, () => loadCase(one));
    }
  }

  list.push("</ul>");

  $("#cases").empty().append(list.join(" "));
}

function showField(step) {
  const svg = [];

  svg.push(`<svg width="${WIDTH}" height="${HEIGHT}">`);

  for (const unit of selectedStep.units.values()) {
    const id = step.id + "-unit-" + unit.nick;

    const cx = getX(unit.body.x);
    const cy = getY(unit.body.y);
    const rx = getWidth(unit.body.radius);
    const ry = getHeight(unit.body.radius);
    const wx = unit.weapon.range ? getWidth(unit.body.radius + unit.weapon.range) : 0;
    const wy = unit.weapon.range ? getHeight(unit.body.radius + unit.weapon.range) : 0;

    const hf = unit.isWarrior ? "rgb(100, 200, 100)" : "rgb(200, 100, 100)";
    const hx = rx * unit.armor.health / selectedStep.boundaries.health;
    const hy = ry * unit.armor.health / selectedStep.boundaries.health;

    const uf = (unit === selectedUnit) ? "black" : hf;

    svg.push(`<g id="${id}" style="cursor: pointer">`);
    svg.push(`<ellipse cx=${cx} cy=${cy} rx=${wx} ry=${wy} style="fill:none;stroke-width:5;stroke:${uf};stroke-dasharray:1,1" />`);
    svg.push(`<ellipse cx=${cx} cy=${cy} rx=${rx} ry=${ry} style="fill:none;stroke-width:5;stroke:${uf}" />`);
    svg.push(`<ellipse cx=${cx} cy=${cy} rx=${hx} ry=${hy} style="fill:${hf}" />`);

    svg.push(`<text x=${cx - rx*unit.nick.length/3} y=${cy + ry/3} style="font-size:${ry}">${unit.nick}</text>`);
    svg.push(`</g>`);

    onClick("#" + id, () => selectUnit(unit));
  }

  for (const unit of selectedStep.units.values()) {
    if (unit.enemy) {
      const wx = getX(unit.body.x);
      const wy = getY(unit.body.y);
      const ex = getX(unit.enemy.body.x);
      const ey = getY(unit.enemy.body.y);
      const width = getWidth(unit.body.radius / 4);

      svg.push(`<path d="M${wx},${wy} L${ex},${ey}" style="fill:none;stroke-width:${width};stroke:rgba(200,0,0,0.5)" />`);
    }
  }

  svg.push(`</svg>`);

  $("#field").empty().append(svg.join(""));
}

function selectUnit(unit) {
  selectedUnit = unit;
  showField(selectedStep);
  showBattles();
  showUnit();
}

function showUnit() {
  const list = [];

  if (selectedUnit) {
    const unit = selectedUnit;

    list.push(unit.nick);

    list.push("<ul>");
    list.push(li("Tag:", unit.tag));

    list.push("<li>Body:<ul>");
    list.push(li("Location:", unit.body.x.toFixed(1), ":", unit.body.x.toFixed(1)));
    list.push(li("Radius:", unit.body.radius.toFixed(1)));
    list.push("</ul></li>");

    list.push("<li>Armor:<ul>");
    list.push(li("Health:", unit.armor.health.toFixed(2)));
    list.push("</ul></li>");

    if (unit.weapon.damage) {
      list.push("<li>Weapon:<ul>");
      list.push(li("Cooldown:", unit.weapon.cooldown.toFixed(2)));
      list.push(li("Range:", unit.weapon.range.toFixed(1)));
      list.push(li("Damage:", unit.weapon.damage));
      list.push(li("Attacks:", unit.weapon.attacks));
      list.push(li("Damage per step:", (unit.weapon.damage / unit.weapon.speed).toFixed(2)));
      list.push("</ul></li>");
    }

    list.push("</ul>");
  }

  $("#unit").empty().append(list.join(" "));
}

function showBattles() {
  const list = [];

  list.push("<ul>");

  for (const battle of selectedStep.battles) {
    list.push("<li>");
    list.push(`<span id="${battle.id}" style="cursor: pointer">`, battle.summary, "</span>");

//    if (battle.isSelected) {
//      list.push(...showAlternatives(battle));
//    }

    list.push("</li>");

    onClick("#" + battle.id, () => toggleBattle(battle));
  }

  list.push("</ul>");

  $("#battles").empty().append(list.join(""));
}

function showAlternatives(battle) {
  const warriors = Array.from(selectedStep.units.values()).filter(unit => unit.isWarrior).sort((a, b) => (Number(a.nick) - Number(b.nick)));
  const enemies = Array.from(selectedStep.units.values()).filter(unit => unit.isEnemy).sort((a, b) => (Number(a.nick) - Number(b.nick)));
  const table = [];

  table.push("<table border='1'>");

  const row = [];
  row.push("");
  for (const enemy of enemies) {
    row.push(showHeader(enemy.nick, (enemy === selectedUnit)));
  }
  table.push("<tr>", "<td>", row.join("</td><td>"), "</td>", "</tr>");

  for (const warrior of warriors) {
    const row = [];

    row.push(showHeader(warrior.nick, (warrior === selectedUnit)));

    for (const enemy of enemies) {
      const alternative = battle.derive(warrior, enemy);
      if (!alternative.id) alternative.id = battle.id + "-" + warrior.nick + "-" + enemy.nick;

      row.push(showBattleDetails(alternative, warrior, warriors, enemy, enemies, battle));
    }

    table.push("<tr>", "<td>", row.join("</td><td>"), "</td>", "</tr>");
  }

  table.push("</table>");

  return table.join("");
}

function showBattleDetails(battle, focusWarrior, warriors, focusEnemy, enemies, baseBattle) {
  const details = [];
  const detailsId = battle.id + "-details-" + focusWarrior.nick + "-" + focusEnemy.nick;

  const style = ["cursor: pointer"];
  if (!battle.isWarriorContributing(focusWarrior)) style.push("text-decoration: line-through");
  if (baseBattle.isWarriorEngagingEnemy(focusWarrior, focusEnemy)) style.push("font-weight: bold");
  details.push(`<div id="${detailsId}" style="${style.join(';')}">`);
  details.push(battle.score.toFixed(4));
  details.push("</div>");

  onClick("#" + detailsId, function() { toggle(detailsId); showBattles(); });

  if (!toggles.get(detailsId)) return details.join(" ");

  details.push("<table border='1'>");

  const row = [];
  row.push("");
  for (const enemy of enemies) {
    const fight = battle.fights.find(fight => (fight.enemy === enemy));

    if (fight) {
      const header = [];
      header.push(showHeader(fight.enemy.nick, (fight.enemy === selectedUnit)));
      header.push(showFightDetails(fight, battle.end));
      row.push(header.join(" "));
    }
  }
  details.push("<tr>", "<td>", row.join("</td><td>"), "</td>", "</tr>");

  for (const warrior of warriors) {
    const row = [];
    let isAttacking = false;

    row.push(showHeader(warrior.nick, (warrior === selectedUnit)));

    for (const enemy of enemies) {
      const fight = battle.fights.find(fight => (fight.enemy === enemy));

      if (fight) {
        const attack = fight.attacks.find(attack => (attack.warrior === warrior));

        if (attack) {
          row.push(showAttackDetails(attack));
          isAttacking = true;
        } else {
          row.push("");
        }
      }
    }

    if (isAttacking) {
      details.push("<tr>", "<td>", row.join("</td><td>"), "</td>", "</tr>");
    }
  }

  details.push("</table>");

  return details.join(" ");
}

function showFightDetails(fight, battleEnd) {
  const details = [];

  details.push("<ul>");
  details.push(li("Steps to kill:", Math.round(fight.stepsToKill)));
  details.push(li("Score:", fight.score.toFixed(4)));
  details.push(li("Reduce:", ((battleEnd * fight.enemy.weapon.damage / fight.enemy.weapon.speed) - fight.score).toFixed(4)));
  details.push("</ul>");

  return details.join(" ");
}

function showAttackDetails(attack) {
  const details = [];

  details.push("<ul>");
  details.push(li("Start:", Math.round(attack.start), "(" + Math.round(attack.stepsToReachEnemy) + "|" + Math.round(attack.stepsToLoadWeapon) + ")"));
  details.push("</ul>");

  return details.join(" ");
}

function showHeader(text, isBold) {
  return (isBold ? "<span style='font-weight: bold'>" : "<span>") + text + "</span>";
}

function li(...texts) {
  return "<li>" + texts.join(" ") + "</li>";
}

function toggleBattle(battle) {
  battle.isSelected = !battle.isSelected;
  showBattles();
}

function calculateBoundaries(step) {
  const boundaries = { top: -Infinity, left: Infinity, right: -Infinity, bottom: Infinity, scaleX: 0, scaleY: 0, health: 1 };

  for (const unit of step.units.values()) {
    boundaries.top = Math.max(boundaries.top, unit.body.y + unit.body.radius);
    boundaries.right = Math.max(boundaries.right, unit.body.x + unit.body.radius);
    boundaries.bottom = Math.min(boundaries.bottom, unit.body.y - unit.body.radius);
    boundaries.left = Math.min(boundaries.left, unit.body.x - unit.body.radius);
    boundaries.health = Math.max(boundaries.health, unit.armor.health);
  }

  boundaries.top = Math.ceil(boundaries.top);
  boundaries.right = Math.ceil(boundaries.right);
  boundaries.bottom = Math.floor(boundaries.bottom);
  boundaries.left = Math.floor(boundaries.left);

  const width = (boundaries.right - boundaries.left);
  const height = (boundaries.top - boundaries.bottom);
  const size = Math.max(width, height);

  if (width !== height) {
    if (width < size) {
      const gap = (size - width) / 2;
      boundaries.left -= gap;
      boundaries.right += gap;
    } else if (height < size) {
      const gap = (size - height) / 2;
      boundaries.top -= gap;
      boundaries.bottom += gap;
    }
  }

  boundaries.scaleX = WIDTH / size;
  boundaries.scaleY = HEIGHT / size;

  return boundaries;
}

function calculateBattles(step) {
  const battles = [];

  const battle = engage(step.units, function(battle) {
    battle.id = id();
    battle.summary = battle.change ? battle.change.warrior.nick + " → " + battle.change.enemy.nick : "Start";
    battles.push(battle);
    battle.show();
  });

  battle.isSelected = true;

  // Set attacks
  for (const warrior of battle.warriors) {
    const fight = battle.fights.find(fight => fight.hasEngagedWarrior(warrior));

    if (fight) {
      const attack = fight.attacks.find(attack => (attack.warrior === warrior));
      warrior.enemy = attack.enemy;
    } else {
      warrior.enemy = null;
    }
  }

  return battles;
}

function getX(x) {
  return (x - selectedStep.boundaries.left) * selectedStep.boundaries.scaleX;
}

function getY(y) {
  return HEIGHT - (y - selectedStep.boundaries.bottom) * selectedStep.boundaries.scaleY;
}

function getWidth(width) {
  return width * selectedStep.boundaries.scaleX;
}

function getHeight(height) {
  return height * selectedStep.boundaries.scaleY;
}
