const { execSync } = require("child_process");

const self_pid = process.pid.toString();
const data = [];
const sum = (/** @type {number[]} */ a) => a.reduce((p, c) => p + c, 0);
const lastLog = Date.now();
const second = 1000; /* ms */

function measure_memory() {
  let total = 0;
  const tasks = execSync("tasklist").toString().split("\n").slice(3, -1);
  for (let i = 0; i < tasks.length; ++i) {
    const task = tasks[i];
    const [name, pid, , , memory] = task.split(/\s+/);
    if (name.toLowerCase().includes("node") && pid !== self_pid) {
      total += +memory.replaceAll(/,/g, "");
    }
  }
  data.push(total);

  if (Date.now() - lastLog > 2 * second) {
    const min = Math.round(data.reduce((min, c) => (c < min ? c : min)) / 1000);
    const max = Math.round(data.reduce((max, c) => (c > max ? c : max)) / 1000);
    const avg = Math.round(sum(data) / data.length / 1000);
    console.log(`avg ${avg} MB, min ${min} MB, max ${max} MB`);
  }

  if (total !== 0) {
    setTimeout(measure_memory, 100);
  }
}

setTimeout(measure_memory, 100);
