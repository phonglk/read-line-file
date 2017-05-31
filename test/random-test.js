const fs = require("fs");
const path = require("path");

const bigFilePath = path.join(__dirname, 'mock/1GB.txt');

const readline = require("readline");
const readLineFile = require('../lib/read-line-file');

let i = 0;
readLineFile(bigFilePath, (line) => {
  if (i % 1000 === 0) {
    console.log(line.slice(0, 100))
  }
  i++;
}, () => {
  console.log('end');
}, (err) => {
  console.log('error', err);
});

// const rl = readline.createInterface({
//   input: fs.createReadStream(bigFilePath)
// });
// rl.on('line', (line) => {
//   if (i % 1000 === 0) {
//     console.log(line.slice(0, 100))
//   }
//   i++
// })
// .on('close', () => {
//   console.log('close')
// })