import sample from "./playbook/attack.js";

function show(one) {
  console.log("Warriors:");

  for (let i = 0; i < 4; i++) {
    const x = one.input[i * 3 + 12];
    const y = one.input[i * 3 + 13];
    const h = one.input[i * 3 + 14];

    console.log(x.toFixed(2), ":", y.toFixed(2), "health:", Math.round(h));
  }

  console.log("Enemies:");

  for (let i = 0; i < 4; i++) {
    const x = one.input[i * 3];
    const y = one.input[i * 3 + 1];
    const h = one.input[i * 3 + 2];

    console.log(x.toFixed(2), ":", y.toFixed(2), "health:", Math.round(h));
  }

  console.log("Target:");

  console.log(one.output[0].toFixed(2), ":", one.output[1].toFixed(2));

  console.log();
}

let count = 0;
let failed = 0;
let showat = 1000;
let one;

while ((count < 10000) || !one) {
  one = sample();

  if (one) {
    count++;

    if (count >= showat) {
      show(one);
      showat += 1000;
    }
  } else {
    failed++;
  }
}

console.log("Total samples count:", count);
console.log("Failed samples count:", failed);
