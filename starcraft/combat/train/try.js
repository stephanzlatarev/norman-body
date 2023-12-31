import sample from "./playbook/approach.js";

function show(one) {
  const SPLIT = 4;
  const input = [""];

  for (const i of one.input) {
    if (((input.length % SPLIT) === 0) && (input.length > 1)) {
      input.push("\n");
    }

    input.push(i.toFixed(2));
  }

  console.log("Shape:", one.input.length, ":", one.output.length);
  console.log("Input:");
  console.log(input.join("\t"));
  console.log("Output:");
  console.log("\t", one.output[0].toFixed(2), "\t", one.output[1].toFixed(2));
  console.log();
}

const limit = 10000;
let showat = limit / 3;
let count = 0;
let failed = 0;
let one;

const startTime = Date.now();

while ((count < 10000) || !one) {
  one = sample();

  if (one) {
    count++;

    if (count >= showat) {
      show(one);
      showat += (limit / 3);
    }
  } else {
    failed++;
  }
}

const endTime = Date.now();

console.log("Total samples count:", count);
console.log("Failed samples count:", failed);
console.log("Seconds:", ((endTime - startTime) / 1000).toFixed(2));
console.log("Samples per second:", (count * 1000 / (endTime - startTime)).toFixed(2));
