import sample from "./playbook/focus-fire.js";

function show(one) {
  console.log("===");

  for (let r = 0, i = 0; r <= 20; r++) {
    const line = [];

    for (let c = 0; c <= 20; c++, i++) {
      line.push(((r === 10) && (c === 10)) ? "+" : one.input[i]);
    }
    console.log(line.join(" "));
  }

  console.log("---");

  for (let r = 0, i = 0; r <= 20; r++) {
    const line = [];

    for (let c = 0; c <= 20; c++, i++) {
      line.push(((r === 10) && (c === 10)) ? "+" : one.input[441 + i]);
    }
    console.log(line.join(" "));
  }

  console.log("---");
  console.log(one.output);
}

let count = 0;
let showat = 1000;
let one;

while ((count < 10000) || !one) {
  one = sample();
  count++;

  if (one && (count >= showat)) {
    show(one);
    showat += 1000;
  }
}

console.log("Total samples count:", count);
