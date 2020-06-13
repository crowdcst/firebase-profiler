const { exec: _exec } = require("child_process");
const { promisify } = require("util");

const { schedule } = require("node-cron");

const exec = promisify(_exec);

const run = async (cmd) => {
  console.log(`--> ${cmd}`);
  const { stdout } = await exec(cmd);
  console.log(stdout);
};

const main = async () => {
  const time = new Date().toISOString();

  console.log(time);

  await run(
    `firebase database:profile --project firebase-crowdcast -o logs/${time}.txt -d 120`
  );
};

schedule("*/2 * * * *", main);
