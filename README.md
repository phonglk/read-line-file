# ReadLineFile

High performance readline module

Tested on Macbook Pro: 3.38x faster than built-in readline (1GB File)

Support both pub-sub and callback

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