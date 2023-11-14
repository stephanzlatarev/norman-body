import sample from "./playbook/focus-fire.js";

let count = 0;
let one;

while ((count < 10000) || !one) {
  one = sample();
  count++;
}

console.log("samples:", count);

for (let r = 0, i = 0; r <= 20; r++) {
  const line = [];

  for (let c = 0; c <= 20; c++, i++) {
    line.push(one.input[i]);
  }
  console.log(line.join(" "));
}
console.log("---");
for (let r = 0, i = 0; r <= 20; r++) {
  const line = [];

  for (let c = 0; c <= 20; c++, i++) {
    line.push(one.input[441 + i]);
  }
  console.log(line.join(" "));
}
console.log("---");
console.log(one.output);
