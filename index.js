'use strict';
const chalk = require('chalk');
const assert = require('assert');

const GS = 10; // Grid span

let bag = [
  'apple',
  'grape',
  'orange',
  'banana'
]
assert.equal(bag.length, 4);
function treatWord(v) {
  return v.split(' ').join('');
}
for (let word in bag) {
  assert.equal(treatWord(word), word.split(' ').join(''));
}
function gridLimit(l) {
  let out = null;
  l
    .map(v => treatWord(v))
    .forEach(v => out = Math.max(out, v.length));
  return out;
}
assert.equal(gridLimit(bag), 6);
function alphabet() {
  let out = [];
  for (let i = 97, l = 122; i <= l; i += 1) {
    out.push(String.fromCharCode(i));
  }
  return out;
}
function randint(n) {
  return Math.round(Math.random() * n);
}
function generateLine(n) {
  let out = new Array(n).fill(0);
  let _alphabet = alphabet();
  out = out.map(v => _alphabet[randint(_alphabet.length - 1)]);
  return out;
}
assert.equal(generateLine(gridLimit(bag)).length, 6);
for (let chr of generateLine(gridLimit(bag))) {
  let alphabet = [];
  for (let i = 97, l = 122; i <= l; i += 1) {
    alphabet.push(String.fromCharCode(i));
  }
  assert.ok(alphabet.indexOf(chr) > -1);
}
function generateColumn(n, m=gridLimit(bag)) {
  let out = new Array(n).fill(0);
  out = out.map(v => generateLine(m));
  return out;
}
assert.equal(generateColumn(gridLimit(bag)).length, 6);

function showGrid(g=generateColumn(gridLimit(bag))) {
  for (let line of g) {
    for (let i in line) {
      let chr = line[i];
      if (i == line.length - 1) {
        process.stdout.write(`${chr}\n`);
      } else {
        process.stdout.write(`${chr} | `);
      }
    }
  }
}
// showGrid()

// place cells
// w - word
// n - grid limit
// x - horizontal axis
// y - vertical axis
// o - orientation
// t - trace
function placeCells(w, n, x, y, o, t) {
  let out = [];
  if (w.length <= n && o === 'horizontal' && t === 'left-to-right') {
    for (let i = 0; i < w.length; i += 1) {
      out.push({ value: w[i], x: i, y: y });
    }
  } else if (w.length <= n && o === 'horizontal' && t === 'right-to-left') {
    for (let i = w.length - 1, j = 0; i >= 0; i -= 1) {
      out.push({ value: w[i], x: j, y: y });
      j += 1;
    }
  } else if (w.length <= n && o === 'vertival' && t === 'top-to-down') {
    for (let i = 0; i < w.length; i += 1) {
      out.push({ value: w[i], x: x, y: i });
    }
  } else if (w.length <= n && o === 'vertical' && t === 'down-to-top') {
    for (let i = w.length - 1, j = 0; i >= 0; i -= 1) {
      out.push({ value: w[i], x: x, y: j });
      j += 1;
    }
  } else if (w.length <= n && o === 'transversal' && t === 'left-to-right') {
    for (let i = 0; i < w.length; i += 1) {
      out.push({ value: w[i], x: i, y: i });
    }
  } else if (w.length <= n && o === 'transversal' && t === 'right-to-left') {
    for (let i = w.length - 1, j = 0; i >= 0; i -= 1) {
      out.push({ value: w[i], x: j, y: j });
      j += 1;
    }
  }
  return out;
}
assert.deepEqual(placeCells('apple', 9, 0, 0, 'horizontal', 'left-to-right'), [
  { value: 'a', x: 0, y: 0 },
  { value: 'p', x: 1, y: 0 },
  { value: 'p', x: 2, y: 0 },
  { value: 'l', x: 3, y: 0 },
  { value: 'e', x: 4, y: 0 },
], 'horizontal placement');
assert.deepEqual(placeCells('apple', 9, 0, 0, 'vertival', 'top-to-down'), [
  { value: 'a', x: 0, y: 0 },
  { value: 'p', x: 0, y: 1 },
  { value: 'p', x: 0, y: 2 },
  { value: 'l', x: 0, y: 3 },
  { value: 'e', x: 0, y: 4 },
], 'vertical placement');
assert.deepEqual(placeCells('apple', 9, 0, 0, 'horizontal', 'right-to-left'), [
  { value: 'e', x: 0, y: 0 },
  { value: 'l', x: 1, y: 0 },
  { value: 'p', x: 2, y: 0 },
  { value: 'p', x: 3, y: 0 },
  { value: 'a', x: 4, y: 0 },
], 'horizontal placement right to left');
assert.deepEqual(placeCells('apple', 9, 0, 0, 'vertical', 'down-to-top'), [
  { value: 'e', x: 0, y: 0 },
  { value: 'l', x: 0, y: 1 },
  { value: 'p', x: 0, y: 2 },
  { value: 'p', x: 0, y: 3 },
  { value: 'a', x: 0, y: 4 },
], 'vertical placement down to top');
assert.deepEqual(placeCells('apple', 9, 0, 0, 'transversal', 'left-to-right'), [
  { value: 'a', x: 0, y:0 },
  { value: 'p', x: 1, y:1 },
  { value: 'p', x: 2, y:2 },
  { value: 'l', x: 3, y:3 },
  { value: 'e', x: 4, y:4 },
], 'transversal placement left to right');
assert.deepEqual(placeCells('apple', 9, 0, 0, 'transversal', 'right-to-left'), [
  { value: 'e', x: 0, y: 0 },
  { value: 'l', x: 1, y: 1 },
  { value: 'p', x: 2, y: 2 },
  { value: 'p', x: 3, y: 3 },
  { value: 'a', x: 4, y: 4 },
], 'transversal placement right to left');

function collide(a, b) {
  return (a.o === b.o && (a.x === b.x && a.y === b.y));
}
assert.ok(
  collide({
    w: 'apple',
    x: 0,
    y: 0,
    o: 'horizontal'
  }, {
    w: 'grape',
    x: 0,
    y: 0,
    o: 'horizontal'
  }), 'collision not detected');

let grid = generateColumn(gridLimit(bag) + GS, gridLimit(bag) + GS);

// placing fixed words from bag
let x = 0;
let y = 0;
bag.forEach(w => {
  let gridSize = gridLimit(bag) + GS;
  let gs = gridSize;
  let orientations = ['horizontal', 'vertical', 'transversal'];
  let htTraces = ['left-to-right', 'right-to-left'];
  let vTraces = ['top-to-down', 'down-to-top'];
  let orientation = () => orientations[Math.max(0, Math.round(Math.random() * orientations.length - 1))];
  let htTrace = () => htTraces[Math.max(0, Math.round(Math.random() * (htTraces.length - 1)))];
  let vTrace = () => vTraces[Math.max(0, Math.round(Math.random() * (vTraces.length - 1)))];
  let o = orientation();
  let t = null;
  if (o === 'horizontal' || o === 'transversal') {
    t = htTrace();
  } else if (o === 'vertical') {
    t = vTrace();
  }
  let positionedWords = [];
  function prepareCells() {
    x = y = Math.max(0, randint(gs));
    console.log((new Array(61)).fill('=').join(''));
    console.log(w, o, t, x, y);
    console.log((new Array(61)).fill('=').join(''));
    placeCells(w, gs, x, y, o, t)
      .forEach(v => {
        // if (grid[v['y']][v['x']] !== v['value']) {
        //   prepareCells();
        // }

        if (process.env.DEBUG === 'WORDS') {
          grid[v['y']][v['x']] = chalk.green(v['value'].toUpperCase());
        } else {
          grid[v['y']][v['x']] = v['value'];
        }
      });
    positionedWords.push({
      word: w,
      x: [ x, x + w.length ],
      y: [ y, y + w.length ],
      o: o,
      t: t,
    });
  }
  prepareCells();
});

showGrid(grid);
