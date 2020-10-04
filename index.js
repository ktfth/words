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
