'use strict';
const chalk = require('chalk');
const assert = require('assert');

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
function randint(n) {
  return Math.round(Math.random() * n);
}
function generateLine(n) {
  let out = new Array(n).fill(0);
  let _alphabet = alphabet();
  out = out.map(v => _alphabet[randint(_alphabet.length - 1)]);
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
exports.placeCells = placeCells;

function range(n=0, m) {
  let out = [];
  for (let i = n; i <= m; i += 1) {
    out.push(i);
  }
  return out;
}
exports.range = range;

function collide(a, b) {
  let out = false;
  let aX = range(a.x[0], a.x[1]);
  let bX = range(b.x[0], b.x[1]);
  let aY = range(a.y[0], a.y[1]);
  let bY = range(b.y[0], b.y[1]);
  let hasCollisionX = [];
  let hasCollisionY = [];

  if (a.o === 'horizontal' && b.o === 'horizontal') {
    aX.forEach((v, i) => {
      if (bX[i] === v) hasCollisionX.push(true);
    });

    aY.forEach((v, i) => {
      if (bY[i] === v) hasCollisionY.push(true);
    });
  }

  if (a.o === 'transversal' && b.o === 'horizontal') {
    aX.forEach((v, i) => {
      if (bX[i] === v) hasCollisionX.push(true);
    });

    aY.forEach((v, i) => {
      if (bY[i] === v) hasCollisionY.push(true);
    });
  }

  if (a.o === 'vertical' && b.o === 'horizontal') {
    aX.forEach((v, vi) => {
      bX.forEach((w, wi) => {
        if (v === w) {
          hasCollisionX.push(true);
          bX = bX.splice(wi, 1);
        }
      });
    });

    aY.forEach((v, vi) => {
      bY.forEach((w, wi) => {
        if (v === w) {
          hasCollisionY.push(true);
          bY = bY.splice(wi, 1);
        }
      });
    });
  }

  if (a.o === 'horizontal' && b.o === 'transversal') {
    aX.forEach((v, vi) => {
      bX.forEach((w, wi) => {
        if (v === w) {
          hasCollisionX.push(true);
          bX = bX.splice(wi, 1);
        }
      });
    });

    aY.forEach((v, vi) => {
      bY.forEach((w, wi) => {
        if (v === w) {
          hasCollisionY.push(true);
          bY = bY.splice(wi, 1);
        }
      });
    });
  }

  if (a.o === 'transversal' && b.o === 'vertical') {
    aX.forEach((v, vi) => {
      bX.forEach((w, wi) => {
        if (v === w) {
          hasCollisionX.push(true);
          bX = bX.splice(wi, 1);
        }
      });
    });

    aY.forEach((v, vi) => {
      bY.forEach((w, wi) => {
        if (v === w) {
          hasCollisionY.push(true);
          bY = bY.splice(wi, 1);
        }
      });
    });
  }

  if (hasCollisionX.length > 0 || hasCollisionY.length > 0) {
    out = true;
  }
  return out;
}
exports.collide = collide;

let grid = generateColumn(gridLimit(bag) + GS, gridLimit(bag) + GS);

// placing fixed words from bag
let x = 0;
let y = 0;
let positionedWords = [];
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
  function prepareCells() {
    x = y = Math.max(0, randint(gs));
    let hasCollision = false;
    if (o === 'horizontal') {
      hasCollision = positionedWords
        .filter(pw => {
          return collide({
            word: pw.word,
            x: pw.x,
            y: pw.y,
            o: pw.o
          }, {
            word: w,
            x: [x, w.length - 1],
            y: [y, y],
            o: o
          });
        }).length > 0;
    } if (o === 'vertical') {
      hasCollision = positionedWords
        .filter(pw => {
          return collide({
            word: pw.word,
            x: pw.x,
            y: pw.y,
            o: pw.o
          }, {
            word: w,
            x: [x, x],
            y: [y, w.length - 1],
            o: o
          });
        }).length > 0;
    } if (o === 'transversal') {
      let _x = [];
      let _y = [];
      for (let i = 0; i < w.length; i += 1) {
        _x.push(i);
      }
      for (let i = 0; i < w.length; i += 1) {
        _y.push(i);
      }
      hasCollision = positionedWords
        .filter(pw => {
          return collide({
            word: pw.word,
            x: pw.x,
            y: pw.y,
            o: pw.o
          }, {
            word: w,
            x: _x,
            y: _y,
            o: o
          });
        }).length > 0;
    }

    if (!module.parent) {
      console.log(w, x, y, o, hasCollision);
    }

    if (hasCollision) {
      return prepareCells();
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
    positionedWords.push({
      word: w,
      x: [ x, x + w.length - 1 ],
      y: [ y, y + w.length - 1 ],
      o: o,
      t: t,
    });
  }
  prepareCells();
});

if (!module.parent) {
  showGrid(grid);
}
