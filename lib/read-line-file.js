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
      var lastLineIdx = lines.length - 1;
      for(var i = 0; i < lines.length; i++) {
        var line = lines[i];
        if (i === 0) {
          line = [remains, line].join('');
          lineHandler(line)
        } else if ( i === lastLineIdx) {
          remains = line;
        } else {
          lineHandler(line)
        }
      }
    })
    .on('close', () => {
      if (remains.length > 0) lineHandler(remains);
      closeHandler();
    })
    .on('error', error => errorHandler(error));
  return evt;
}

module.exports = readLineFile;