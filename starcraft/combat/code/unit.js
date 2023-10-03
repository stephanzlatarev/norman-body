
export default class Unit {

  constructor(unit, type) {
    this.tag = unit.tag;
    this.type = type;

    sync(this, unit);
  }

  sync(units) {
    const unit = units.get(this.tag);

    if (unit) {
      sync(this, unit);
    } else {
      this.isDead = true;
    }

    return !!unit;
  }

}

function sync(image, unit) {
  image.isBusy = unit.isBusy;
  image.isSelected = unit.isSelected;
  image.pos = { x: unit.pos.x, y: unit.pos.y };
  image.radius = unit.radius;
  image.unitType = unit.unitType;
  image.order = unit.orders.length ? unit.orders[0] : { abilityId: 0 };
  image.health = unit.health + unit.shield;

  image.isMilitary = unit.isMilitary;
  image.damage = unit.damage;
  image.dps = unit.dps;
  image.speed = unit.speed;
  image.range = unit.range;
  image.cooldown = unit.cooldown;
}
