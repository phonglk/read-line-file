"use strict";
// Usage: node gen-test mock/{file} line_num
const fs = require("fs");
const path = require("path");
const LINE_NUM = 1000000;
function getRandomId(length) {
    if (!length) {
        return '';
    }

    const possible =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    let array;

    array = new Array(length);

    for (let i = 0; i < length; i++) {
        array[i] = Math.floor(Math.random() * 62);
    }

    for (let i = 0; i < length; i++) {
        result += possible.charAt(array[i] % 62);
    }

    return result;
}

function getRandomLine(i) {
  const g = getRandomId;
  return [('0000000' + i).substr(-7,7),g(200),g(200),g(200),g(199),g(188)].join(',')
}

function dump(file, lineNum) {
  const ws = fs.createWriteStream(file);
  for(let i = 0; i <= lineNum; i++) {
    ws.write(getRandomLine(i)+'\n');
  }
}

if (require.main === module) {
    dump(path.join(process.env.PWD, process.argv[2]), process.argv[3])
} else {
    module.exports = dump;
}