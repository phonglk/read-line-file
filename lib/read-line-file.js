var fs = require("fs");
var EventEmitter = require('events');
function readLineFile(file, userOptions, fn1, fn2, fn3) {
  var evt = new EventEmitter();
  var lineCallback, closeCallback, errorCallback;
  if (typeof userOptions === "function") {
    lineCallback = userOptions;
    closeCallback = fn1;
    errorCallback = fn2;
    userOptions = false;
  } else {
    lineCallback = fn1;
    closeCallback = fn2;
    errorCallback = fn3;
  }
  var useCallback = typeof lineCallback === "function";
  userOptions = userOptions || {}
  var options = Object.assign({ encoding: 'utf8', highWaterMark: 512 * 1024 }, userOptions);

  var readStream = fs.createReadStream(file, options)
  
  var lineHandler = line => evt.emit('line', line);
  var closeHandler = () => evt.emit('close');
  var errorHandler = (error) => evt.emit('error', error);
  if (useCallback) {
    lineHandler = lineCallback;
    closeHandler = closeCallback;
    errorHandler = errorCallback;
  }
  var remains = '';
  readStream
    .on('data', (chunk) => {
      var lines = chunk.split('\n');

      // first line
      var firstLine = lines[0];
      lineHandler([remains, firstLine].join(''));

      // edge case
      if (lines.length === 1) return;

      // last line
      var lastLineIdx = lines.length - 1;
      remains = lines[lastLineIdx];

      // other lines
      for(var i = 1; i < lastLineIdx; i++) {
        var line = lines[i];
        lineHandler(line);
      }
    })
    .on('close', () => {
      if (remains.length > 0) lineHandler(remains);
      closeHandler();
    })
    .on('error', error => errorHandler(error));

  evt.pause = () => readStream.pause();
  evt.resume = () => readStream.resume();
  return evt;
}

module.exports = readLineFile;