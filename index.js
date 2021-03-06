'use strict';
const chalk = require('chalk');
const assert = require('assert');

const { collide } = require('./collision');

const GS = 40; // Grid span

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
  } if (w.length <= n && o === 'horizontal' && t === 'right-to-left') {
    for (let i = w.length - 1, j = 0; i >= 0; i -= 1) {
      out.push({ value: w[i], x: x + j, y: y });
      j += 1;
    }
  } if (w.length <= n && o === 'vertical' && t === 'top-to-down') {
    for (let i = 0; i < w.length; i += 1) {
      out.push({ value: w[i], x: x, y: y + i });
    }
  } if (w.length <= n && o === 'vertical' && t === 'down-to-top') {
    for (let i = w.length - 1, j = 0; i >= 0; i -= 1) {
      out.push({ value: w[i], x: x, y: y + j });
      j += 1;
    }
  } if (w.length <= n && o === 'transversal' && t === 'left-to-right') {
    for (let i = 0; i < w.length; i += 1) {
      out.push({ value: w[i], x: x + i, y: y + i });
    }
  } if (w.length <= n && o === 'transversal' && t === 'right-to-left') {
    for (let i = w.length - 1, j = 0; i >= 0; i -= 1) {
      out.push({ value: w[i], x: x + j, y: y + j });
      j += 1;
    }
  }
  return out;
}
exports.placeCells = placeCells;

let grid = generateColumn(gridLimit(bag) + GS, gridLimit(bag) + GS);
let gridSize = gridLimit(bag) + GS;
let gs = gridSize;

let orientations = ['horizontal', 'vertical', 'transversal'];
let htTraces = ['left-to-right', 'right-to-left'];
let vTraces = ['top-to-down', 'down-to-top'];
let orientation = () => orientations[Math.max(0, Math.round(Math.random() * orientations.length - 1))];
let htTrace = () => htTraces[Math.max(0, Math.round(Math.random() * (htTraces.length - 1)))];
let vTrace = () => vTraces[Math.max(0, Math.round(Math.random() * (vTraces.length - 1)))];

function randint(n, m) {
  return Math.max(n, rand(m));
}

// placing fixed words from bag
let positionedWords = [];
let callStackCounter = 0;
function placementCells() {
  for (let i = 0; i < bag.length; i += 1) {
    let w = bag[i];
    let x = 0;
    let y = 0;
    let o = null;
    let t = null;

    // let hasCollision = false;

    o = orientation();
    if (o === 'horizontal' || o === 'transversal') {
      t = htTrace();
    } else if (o === 'vertical') {
      t = vTrace();
    }

    function hasCollision(out) {
      if (out >= gs - 1 || out + (w.length - 1) >= gs - 1) return true;
      return positionedWords
      .filter(pw => {
        let a = {};
        let b = {
          x: pw.x,
          y: pw.y
        };

        if (o === 'horizontal') {
          a.x = [out, out + (w.length - 1)],
          a.y = [out, out];
        } else if (o === 'vertical') {
          a.x = [out, out];
          a.y = [out, out + (w.length - 1)];
        } else if (o === 'transversal') {
          a.x = [out, out + (w.length - 1)];
          a.y = [out, out + (w.length - 1)];
        }

        return collide(a, b);
      }).length > 0;
    }

    function randomPos() {
      let out = Math.max(0, Math.round(Math.random() * gs - 1));
      while (hasCollision(out)) {
        out = Math.max(0, Math.round(Math.random() * gs - 1));
      }
      return out;
    }
    x = y = randomPos();

    if (!module.parent && process.env.DEBUG === 'WORDS') {
      console.log(w, x, y, o, t);
    }

    let place = placeCells(w, gs - 1, x, y, o, t)

    for (let i = 0; i < place.length; i += 1) {
      let v = place[i];
      if (process.env.DEBUG === 'WORDS') {
        if (grid[v['y']] !== undefined && grid[v['y']][v['x']] !== undefined) {
          grid[v['y']][v['x']] = chalk.green(v['value'].toUpperCase());
        } else {
          return placementCells();
        }
      } else {
        if (grid[v['y']] !== undefined && grid[v['y']][v['x']] !== undefined) {
          grid[v['y']][v['x']] = v['value'];
        } else {
          return placementCells();
        }
      }
    }

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
  }
}
placementCells();

if (!module.parent) {
  showGrid(grid);
}
