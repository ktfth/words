'use strict';
const assert = require('assert');

let bag = [
  'apple',
  'grape',
  'orange',
  'pine apple'
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
assert.equal(gridLimit(bag), 9);
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
assert.equal(generateLine(gridLimit(bag)).length, 9);
for (let chr of generateLine(gridLimit(bag))) {
  let alphabet = [];
  for (let i = 97, l = 122; i <= l; i += 1) {
    alphabet.push(String.fromCharCode(i));
  }
  assert.ok(alphabet.indexOf(chr) > -1);
}
function generateColumn(n) {
  let out = new Array(n).fill(0);
  out = out.map(v => generateLine(gridLimit(bag)));
  return out;
}
assert.equal(generateColumn(gridLimit(bag)).length, 9);

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
function placeCells(w, n, x, y, o) {
  let out = [];
  if (w.length <= n && o === 'horizontal') {
    for (let i = 0; i < w.length; i += 1) {
      out.push({ value: w[i], x: i, y: y });
    }
  } else if (w.length <= n && o === 'vertival') {
    for (let i = 0; i < w.length; i += 1) {
      out.push({ value: w[i], x: x, y: i });
    }
  }
  return out;
}
assert.deepEqual(placeCells('apple', 9, 0, 0, 'horizontal'), [
  { value: 'a', x: 0, y: 0 },
  { value: 'p', x: 1, y: 0 },
  { value: 'p', x: 2, y: 0 },
  { value: 'l', x: 3, y: 0 },
  { value: 'e', x: 4, y: 0 },
], 'horizontal placement');
assert.deepEqual(placeCells('apple', 9, 0, 0, 'vertival'), [
  { value: 'a', x: 0, y: 0 },
  { value: 'p', x: 0, y: 1 },
  { value: 'p', x: 0, y: 2 },
  { value: 'l', x: 0, y: 3 },
  { value: 'e', x: 0, y: 4 },
], 'vertical placement');
