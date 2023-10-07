
export default class Fight {

  constructor(enemy) {
    this.enemy = enemy;
    this.enemyStrength = 0;
    this.attacks = new Map();
    this.warriors = new Set();
  }

  getAttack(warrior) {
    return this.attacks.get(warrior);
  }

  addAttack(warrior, attack) {
    this.attacks.set(warrior, attack);
  }

  engageWarrior(warrior) {
console.log(warrior.tag, "engages", this.enemy.tag, "distance:", this.attacks.get(warrior));
    this.warriors.add(warrior);
  }

  disengageWarrior(warrior) {
console.log(warrior.tag, "disengages", this.enemy.tag, "distance:", this.attacks.get(warrior));
    this.warriors.delete(warrior);
  }

}
