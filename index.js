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
