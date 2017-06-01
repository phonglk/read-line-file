const fs = require("fs");
const path = require("path");

const bigFilePath = path.join(__dirname, 'mock/1GB.txt');
const smallFilePath = path.join(__dirname, 'mock/100KB.txt');

const readline = require("readline");
const readLineFile = require('../lib/read-line-file');

let i = 0;
const rlf = readLineFile(smallFilePath, { highWaterMark: 1024 * 16}, (line) => {
  console.log(i, line.slice(0, 100))
  if ((i+1) % 10 === 0) {
    rlf.pause();
    console.log('pause');
    setTimeout(() => {
      console.log('resume');
      rlf.resume();
    }, 500);
    // console.log('pause')
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