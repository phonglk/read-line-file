# ReadLineFile

High performance readline module

- Tested on Macbook Pro (SSD): ~3.38x faster than built-in readline (1GB File)
- Tested on Centos (HD): ~3.78x faster than built-in readline (1GB-2GB File)
- Windows 7 (SSD): ~1.3x faster (1GB File)

Support both pub-sub and callback

install `npm install read-line-file`

No deps.

# Usage
## callbacks

RECOMMEND for a bit faster

`readLineFile(file, [options], lineCb, closeCallback, errorCallback)`

## EventEmitter

`readLineFile(file, [options]).on(<event>, handler)`

which events are: `line`, `close`, `error`

# Example

```const readLineFile = require("read-line-file");
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

