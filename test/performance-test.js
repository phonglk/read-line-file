const fs = require("fs");
const path = require("path");

const smallFilePath = path.join(__dirname, 'mock/1MB.txt');
const bigFilePath = path.join(__dirname, 'mock/1GB.txt');

function createReporter() {
  const start = new Date().getTime();
  const counter = {
    lines: 0,
    bytes: 0,
  }
  return {
    count: (line) => {
      counter.lines++;
      counter.bytes += line.length;
    },
    end: () => {
      const elapsed = (new Date().getTime() - start) / 1000;
      const bps = Math.round(counter.bytes / elapsed);
      const lps = Math.round(counter.lines / elapsed);
      console.log(`Elapsed: ${elapsed}s, ${counter.bytes} bytes, ${counter.lines} lines, ${bps / 1000000} MB/s, ${lps} lines/s`);
      return {
        elapsed,
        bps,
        lps,
      }
    }
  }
}

const readline = require("readline");
const readLineFile = require('../lib/read-line-file');

function runCase(file, cb) {
  cb = cb || (() => {});
  console.log(file);
  let rlp;
  const rl = readline.createInterface({
    input: fs.createReadStream(file)
  });
  const rprl = createReporter();
  rl.on('line', (line) => {
    rprl.count(line);
  })
  .on('close', () => {
    console.log('readline')
    rlp = rprl.end();
    setTimeout(runRLF, 500)
  })

  function runRLF() {
    const rprlf = createReporter();
    readLineFile(file, (line) => {
      rprlf.count(line);
    }, () => {
      console.log('readlinefile')
      let rlfp = rprlf.end();
      console.log(`${Math.round((1 / (rlfp.elapsed / rlp.elapsed))*100) / 100}x`)
      setTimeout(cb, 500);
    }, (err) => {
      console.log('error', err);
    });
    // readLineFile(file)
    //   .on('line', line => rprlf.count(line))
    //   .on('close', () => rprlf.end())
    //   .on('error', (err) => console.log(err));
  }
}
let argvPath = process.argv[2];
if (argvPath) {
  if (argvPath[0] !== '/') argvPath = path.join(process.env.PWD, argvPath);
  runCase(argvPath);
} else {
  runCase(bigFilePath);
}