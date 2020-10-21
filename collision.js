'use strict';
const assert = require('assert');

function range(n, m) {
  let out = [];
  for (let i = n; i <= m; i += 1) out.push(i);
  return out;
}
assert.deepEqual(range(0, 10), [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
assert.deepEqual(range(1, 3), [1, 2, 3]);

function hasCollisionX(a, b) {
  let out = false;
  let hasAX = [];
  let hasBX = [];
  let hasX = [];
  a.forEach(v => {
    hasAX.push(b.indexOf(v) > -1);
  });
  b.forEach(v => {
    hasBX.push(a.indexOf(v) > -1);
  });
  hasX = hasAX.concat(hasBX);
  hasX.forEach(v => {
    if (v) out = true;
  });
  return out;
}
assert.ok(hasCollisionX([1, 2, 3], [1, 2, 3]));
assert.ok(!hasCollisionX([2, 2, 2], [3, 3, 3]));

function hasCollisionY(a, b) {
  let out = false;
  let hasAY = [];
  let hasBY = [];
  let hasY = [];
  a.forEach(v => {
    hasAY.push(b.indexOf(v) > -1);
  });
  b.forEach(v => {
    hasBY.push(a.indexOf(v) > -1);
  });
  hasY = hasAY.concat(hasBY);
  hasY.forEach(v => {
    if (v) out = true;
  });
  return out;
}
assert.ok(hasCollisionY([1, 2, 3], [1, 2, 3]));
assert.ok(!hasCollisionY([2, 2, 2], [3, 3, 3]));
