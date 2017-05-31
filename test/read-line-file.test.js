"use strict";
const assert = require('assert');
const fs = require('fs') ;
const path = require('path') ;
const readLineFile = require('../index');

const mockData = [
  '1,AAA,BBBB,CCCCC',
  '2,AAA,BBBB,CCCCC',
  '3,AAA,BBBB,CCCCC',
  '4,AAA,BBBB,CCCCC',
  '5,AAA,BBBB,CCCCC',
];

// describe('Array', function() {
//   describe('#indexOf()', function() {
//     it('should return -1 when the value is not present', function() {
//       assert.equal(-1, [1,2,3].indexOf(4));
//     });
//   });
// });

function contentTest(ctx) {
  it('there are 5 lines', function() {
    assert.equal(ctx.i, 5);
  });
  for(let j = 0; j < 5; j++) {
    it(`Line ${j} should match with mock data ${mockData[j]}`, () => {
      assert.equal(mockData[j], ctx.lines[j]);
    });
  }
}

describe('Read line file', function() {
  before(() => {
    fs.writeFileSync(path.join(__dirname, './standard.mock'), mockData.join('\n'));
    fs.writeFileSync(path.join(__dirname, './empty.mock'), '');
    fs.writeFileSync(path.join(__dirname, './single.mock'), 'test');
    fs.writeFileSync(path.join(__dirname, './extra_end.mock'), mockData.concat(['']).join('\n'));
    fs.writeFileSync(path.join(__dirname, './extra_end2.mock'), mockData.concat(['','']).join('\n'));
    fs.writeFileSync(path.join(__dirname, './extra_lead.mock'), [''].concat(mockData).join('\n'));
    fs.writeFileSync(path.join(__dirname, './extra_both.mock'), [''].concat(mockData).concat(['']).join('\n'));
    fs.writeFileSync(path.join(__dirname, './holes.mock'), mockData.concat(['']).concat(mockData).join('\n'));
  })
  after(() => {
    fs.readdirSync(path.join(__dirname))
      .forEach((filename) => {
        if (/\.mock$/.test(filename) === true) {
          fs.unlinkSync(path.join(__dirname, filename));
        }
      });
  })
  describe('standard', function() {
    const ctx = {
      i: 0,
      lines: [],
    }
    before((done) => {
      readLineFile(path.join(__dirname, './standard.mock'), (line) => {
        ctx.lines[ctx.i] = line;
        ctx.i++;
      }, done, () => {}) 
    })
    contentTest(ctx);
  });
  describe('empty', function() {
    const ctx = {
      i: 0,
      lines: [],
    }
    before((done) => {
      readLineFile(path.join(__dirname, './empty.mock'), (line) => {
        ctx.lines[ctx.i] = line;
        ctx.i++;
      }, done, () => {}) 
    })
    it('empty', () => {
      assert.equal(ctx.i, 0);
    })
  });
  describe('single line', function() {
    const ctx = {
      i: 0,
      lines: [],
    }
    before((done) => {
      readLineFile(path.join(__dirname, './single.mock'), (line) => {
        ctx.lines[ctx.i] = line;
        ctx.i++;
      }, done, () => {}) 
    })
    it('there is 1 single line', () => {
      assert.equal(ctx.i, 1);
    })
    it('the line is matched', () => {
      assert.equal(ctx.lines[0], 'test');
    })
  });
  describe('extra line break', function() {
    const ctx = {
      i: 0,
      lines: [],
    }
    before((done) => {
      readLineFile(path.join(__dirname, './extra_end.mock'), (line) => {
        ctx.lines[ctx.i] = line;
        ctx.i++;
      }, done, () => {}) 
    })
    contentTest(ctx);
  });
  describe('two extra line break', function() {
    const ctx = {
      i: 0,
      lines: [],
    }
    before((done) => {
      readLineFile(path.join(__dirname, './extra_end2.mock'), (line) => {
        ctx.lines[ctx.i] = line;
        ctx.i++;
      }, done, () => {}) 
    })
    for(let j = 0; j < 5; j++) {
      it(`Line ${j} should match with mock data ${mockData[j]}`, () => {
        assert.equal(mockData[j], ctx.lines[j]);
      });
    }
  });
  describe('line break at lead', function() {
    const ctx = {
      i: 0,
      lines: [],
    }
    before((done) => {
      readLineFile(path.join(__dirname, './extra_lead.mock'), (line) => {
        ctx.lines[ctx.i] = line;
        ctx.i++;
      }, done, () => {}) 
    })
    it('there are 6 lines', function() {
      assert.equal(ctx.i, 6);
    });
    for(let j = 1; j <= 5; j++) {
      it(`Line ${j} should match with mock data ${mockData[j-1]}`, () => {
        assert.equal(mockData[j-1], ctx.lines[j]);
      });
    }
  });
  describe('line break at lead and tail', function() {
    const ctx = {
      i: 0,
      lines: [],
    }
    before((done) => {
      readLineFile(path.join(__dirname, './extra_both.mock'), (line) => {
        ctx.lines[ctx.i] = line;
        ctx.i++;
      }, done, () => {}) 
    })
    it('there are 6 lines', function() {
      assert.equal(ctx.i, 6);
    });
    for(let j = 1; j <= 5; j++) {
      it(`Line ${j} should match with mock data ${mockData[j-1]}`, () => {
        assert.equal(mockData[j-1], ctx.lines[j]);
      });
    }
  });
  describe('hole in data', function() {
    const ctx = {
      i: 0,
      lines: [],
    }
    before((done) => {
      readLineFile(path.join(__dirname, './holes.mock'), (line) => {
        ctx.lines[ctx.i] = line;
        ctx.i++;
      }, done, () => {}) 
    })
    it('there are 11 lines', function() {
      assert.equal(ctx.i, 11);
    });
    for(let j = 0; j < 5; j++) {
      it(`Line ${j} should match with mock data ${mockData[j]}`, () => {
        assert.equal(mockData[j], ctx.lines[j]);
      });
    }
    it(`Line 5 is an empty line`, () => {
      assert.equal(ctx.lines[5],'');
    })
    for(let j = 6; j < 11; j++) {
      it(`Line ${j} should match with mock data ${mockData[j-6]}`, () => {
        assert.equal(mockData[j-6], ctx.lines[j]);
      });
    }
  });
});