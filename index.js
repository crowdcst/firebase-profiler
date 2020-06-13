const { exec: _exec } = require("child_process");
const { promisify } = require("util");
const { schedule } = require("node-cron");
const path = require('path')
const fs = require('fs')
const AWS = require('aws-sdk')

const s3 = new AWS.S3({
  accessKeyId: process.env.S3_KEY_ID,
  secretAccessKey: process.env.S3_KEY_SEC
});


const exec = promisify(_exec);
const token = process.env.FIREBASE_TOKEN;

const run = async (cmd) => {
  console.log(`--> ${cmd}`);
  const { stdout } = await exec(cmd);
  console.log(stdout);
};

const main = async () => {
  const time = new Date().toISOString();

  console.log(time);

  await run(
    `firebase database:profile --token ${token} --project firebase-crowdcast -o logs/${time}.txt -d 120`
  );

  const filePath = path.join(__dirname, `./logs/${time}.txt`)

  const fileContent = fs.readFileSync(filePath);

    // Setting up S3 upload parameters
    const params = {
        Bucket: 'cc-firebase-profiler',
        Key: `${time}.txt`, // File name you want to save as in S3
        Body: fileContent
    };

    // Uploading files to the bucket
    s3.upload(params, function(err, data) {
        if (err) {
          console.log("Error uploading to S3", error)
        } else {
        console.log(`File uploaded successfully. ${data.Location}`);
      }
    });
};

schedule("*/2 * * * *", main);
