const fs = require("fs");
const { spawn } = require("child_process");
 
const watchPaths = [];
let script;
 
for (let i = 2; i < process.argv.length; i++) {
  if (process.argv[i] === "--watch") {
    i++;
    watchPaths.push(process.argv[i]);
  } else {
    script = process.argv[i];
  }
}
function start() {
  return spawn("node", [script], { stdio: "inherit" });
}
 
let procces = start();
let timer;
 
function restart() {
  console.log("update");
  procces.kill();
  procces = start();
}
for (const p of watchPaths) {
  const isDir = fs.statSync(p).isDirectory();
  fs.watch(p, { recursive: isDir }, () => {
    clearTimeout(timer);
    timer = setTimeout(restart, 100);
  });
}
