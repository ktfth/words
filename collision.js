'use strict';
const assert = require('assert');

function range(n, m) {
  let out = [];
  for (let i = n; i <= m; i += 1) out.push(i);
  return out;
}
assert.deepEqual(range(0, 10), [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
