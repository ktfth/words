'use strict';
const chalk = require('chalk');
const assert = require('assert');

const { collide, range } = require('./collision');

const GS = 10; // Grid span

let bag = [
  'apple',
  'grape',
  'orange',
  'banana',
]
exports.bag = bag;
function treatWord(v) {
  return v.split(' ').join('');
}
exports.treatWord = treatWord;
function gridLimit(l) {
  let out = null;
  l
    .map(v => treatWord(v))
    .forEach(v => out = Math.max(out, v.length));
  return out;
}
exports.gridLimit = gridLimit;
function alphabet() {
  let out = [];
  for (let i = 97, l = 122; i <= l; i += 1) {
    out.push(String.fromCharCode(i));
  }
  return out;
}
function rand(n) {
  return Math.round(Math.random() * n);
}
function generateLine(n) {
  let out = new Array(n).fill(0);
  let _alphabet = alphabet();
  out = out.map(v => _alphabet[rand(_alphabet.length - 1)]);
  return out;
}
exports.generateLine = generateLine;
function generateColumn(n, m=gridLimit(bag)) {
  let out = new Array(n).fill(0);
  out = out.map(v => generateLine(m));
  return out;
}
exports.generateColumn = generateColumn;

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
      out.push({ value: w[i], x: x + i, y: y });
    }
  } else if (w.length <= n && o === 'horizontal' && t === 'right-to-left') {
    for (let i = w.length - 1, j = 0; i >= 0; i -= 1) {
      out.push({ value: w[i], x: x + j, y: y });
      j += 1;
    }
  } else if (w.length <= n && o === 'vertival' && t === 'top-to-down') {
    for (let i = 0; i < w.length; i += 1) {
      out.push({ value: w[i], x: x, y: y + i });
    }
  } else if (w.length <= n && o === 'vertical' && t === 'down-to-top') {
    for (let i = w.length - 1, j = 0; i >= 0; i -= 1) {
      out.push({ value: w[i], x: x, y: y + j });
      j += 1;
    }
  } else if (w.length <= n && o === 'transversal' && t === 'left-to-right') {
    for (let i = 0; i < w.length; i += 1) {
      out.push({ value: w[i], x: x + i, y: y + i });
    }
  } else if (w.length <= n && o === 'transversal' && t === 'right-to-left') {
    for (let i = w.length - 1, j = 0; i >= 0; i -= 1) {
      out.push({ value: w[i], x: x + j, y: y + j });
      j += 1;
    }
  }
  return out;
}
exports.placeCells = placeCells;

exports.range = range;

exports.collide = collide;

let grid = generateColumn(gridLimit(bag) + GS, gridLimit(bag) + GS);
let gridSize = gridLimit(bag) + GS;
let gs = gridSize;

let orientations = ['horizontal', 'vertical', 'transversal'];
let htTraces = ['left-to-right', 'right-to-left'];
let vTraces = ['top-to-down', 'down-to-top'];
let slots = range(0, gs - 1);
let orientation = () => orientations[Math.max(0, Math.round(Math.random() * orientations.length - 1))];
let htTrace = () => htTraces[Math.max(0, Math.round(Math.random() * (htTraces.length - 1)))];
let vTrace = () => vTraces[Math.max(0, Math.round(Math.random() * (vTraces.length - 1)))];

function randint(n, m) {
  return Math.max(n, rand(m));
}

// placing fixed words from bag
let positionedWords = [];
let callStackCounter = 0;
bag.forEach(w => {
  let x = 0;
  let y = 0;
  let o = null;
  let t = null;

  let hasCollision = false;

  o = orientation();
  if (o === 'horizontal' || o === 'transversal') {
    t = htTrace();
  } else if (o === 'vertical') {
    t = vTrace();
  }
  x = y = Math.max(0, Math.round(Math.random() * gs - 1));

  hasCollision = positionedWords
    .filter(pw => {
      let a = {
        x: pw.x,
        y: pw.y,
      }; // positioned word
      let b = {}; // current word

      if (o === 'horizontal') {
        b.x = [x, x + (w.length - 1)];
        b.y = [y, y];
        if (b.x[1] >= (gs - 1) || b.y[0] >= (gs - 1)) {
          return true;
        }
      } if (o === 'vertical') {
        b.x = [x, x];
        b.y = [y, y + (w.length - 1)];
        if (b.y[1] >= (gs - 1) || b.x[0] >= (gs - 1)) {
          return true;
        }
      } if (o === 'transversal') {
        b.x = [x, x + (w.length - 1)];
        b.y = [y, y + (w.length - 1)];
        if (b.x[1] >= (gs - 1) || b.y[1] >= (gs - 1)) {
          return true;
        }
      }

      return collide(a, b);
    }).length > 0;

  while (hasCollision) {
    o = orientation();
    if (o === 'horizontal' || o === 'transversal') {
      t = htTrace();
    } else if (o === 'vertical') {
      t = vTrace();
    }
    x = y = Math.max(0, Math.round(Math.random() * gs - 1));

    hasCollision = positionedWords
      .filter(pw => {
        let a = {
          x: pw.x,
          y: pw.y,
        }; // positioned word
        let b = {}; // current word

        if (o === 'horizontal') {
          b.x = [x, x + (w.length - 1)];
          b.y = [y, y];
          if (b.x[1] >= (gs - 1) || b.y[0] >= (gs - 1)) {
            return true;
          }
        } if (o === 'vertical') {
          b.x = [x, x];
          b.y = [y, y + (w.length - 1)];
          if (b.y[1] >= (gs - 1) || b.x[0] >= (gs - 1)) {
            return true;
          }
        } if (o === 'transversal') {
          b.x = [x, x + (w.length - 1)];
          b.y = [y, y + (w.length - 1)];
          if (b.x[1] >= (gs - 1) || b.y[1] >= (gs - 1)) {
            return true;
          }
        }

        return collide(a, b);
      }).length > 0;

    // if (!module.parent && process.env.DEBUG === 'WORDS') {
    //   console.log(w, x, y, o, t, hasCollisionHandler());
    // }
  }

  // if (hasCollisionHandler() && callStackCounter <= 10000) {
  //   callStackCounter += 1;
  //   return prepareCells();
  // }
  //

  if (!module.parent && process.env.DEBUG === 'WORDS') {
    console.log(w, x, y, o, t);
  }

  placeCells(w, gs, x, y, o, t)
    .forEach(v => {
      if (process.env.DEBUG === 'WORDS') {
        if (grid[v['y']] !== undefined && grid[v['y']][v['x']] !== undefined) {
          grid[v['y']][v['x']] = chalk.green(v['value'].toUpperCase());
        }
      } else {
        if (grid[v['y']] !== undefined && grid[v['y']][v['x']] !== undefined) {
          grid[v['y']][v['x']] = v['value'];
        }
      }
    });

  let p = {
    word: w,
    o: o,
    t: t,
  };

  if (o === 'horizontal') {
    p.x = [x, x + (w.length - 1)];
    p.y = [y, y];
  } if (o === 'vertical') {
    p.x = [x, x];
    p.y = [y, y + (w.length - 1)];
  } if (o === 'transversal') {
    p.x = [x, x + (w.length - 1)];
    p.y = [y, y + (w.length - 1)];
  }
  positionedWords.push(p);
});

if (!module.parent) {
  showGrid(grid);
}
