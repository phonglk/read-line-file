[![https://nodei.co/npm/read-line-file.png?downloads=true&downloadRank=true&stars=true](https://nodei.co/npm/read-line-file.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/read-line-file)


# ReadLineFile

High performance readline module for file, better than built-in one.

- Callback or subscribe to event, your choice
- No deps
- Order is guaranteed
- Limited Pause/Resume

## Performance

- Tested on Macbook Pro (SSD): ~3.38x faster than built-in readline (1GB File)
- Tested on Centos (HD): ~3.78x faster than built-in readline (1GB-2GB File)
- Windows 7 (SSD): ~1.3x faster (1GB File)

# Usage
## callbacks

RECOMMEND for a bit faster

`readLineFile(file, [options], lineCb, closeCallback, errorCallback)`

## EventEmitter

`readLineFile(file, [options]).on(<event>, handler)`

which events are: `line`, `close`, `error`

## Pause/Resume

readLineFile return an object which has `pause()` and `resume()` methods which help to control the flow

Almot like built-in `readline`, `pause()` do not guaranteed the event `line` will be stopped, It still flushing the buffer out until the buffer is empty.

Example

```javascript
const rlf = readLineFile(file,
  (line) => {
    if (memoryIsNearThreshold) {
      rlf.pause();
      ...
      rlf.resume();
    }
  },
  ...
)
```

# Example

```javascript
const readLineFile = require("read-line-file");
readLineFile(file,
  (line) => processLine(line),
  () => console.log('close'),
  (err) => console.log('error')
)
```

# Options

Options object will be passed to fs.createReadStream

default options: `{ encoding: 'utf8', highWaterMark: 512 * 1024 }`

*highWaterMark is buffer size

# Tests

Unit test : `npm test`

Performance test: `node {module}/test/performance-test.js {file}`

# Known Issues

- The maximum length of line should be less than buffer size (highWaterMark)

# TODOs

