'use strict';
const assert = require('assert');
const words = require('./');

describe('Words', () => {
  it('should be bag filled', () => {
    assert.equal(words.bag.length, 4);
  });

  it('should treat words', () => {
    for (let word in words.bag) {
      assert.equal(words.treatWord(word), word.split(' ').join(''));
    }
  });

  it('should grid have a limit', () => {
    assert.equal(words.gridLimit(words.bag), 6);
  });

  it('should grid line have a limit', () => {
    assert.equal(words.generateLine(words.gridLimit(words.bag)).length, 6);
  });

  it('should be placed alphabet chars', () => {
    for (let chr of words.generateLine(words.gridLimit(words.bag))) {
      let alphabet = [];
      for (let i = 97, l = 122; i <= l; i += 1) {
        alphabet.push(String.fromCharCode(i));
      }
      assert.ok(alphabet.indexOf(chr) > -1);
    }
  });

  it('should grid colum have a limit', () => {
    assert.equal(words.generateColumn(words.gridLimit(words.bag)).length, 6);
  });

  it('should be place horiziontal left to right', () => {
    assert.deepEqual(words.placeCells('apple', 9, 0, 0, 'horizontal', 'left-to-right'), [
      { value: 'a', x: 0, y: 0 },
      { value: 'p', x: 1, y: 0 },
      { value: 'p', x: 2, y: 0 },
      { value: 'l', x: 3, y: 0 },
      { value: 'e', x: 4, y: 0 },
    ], 'horizontal placement');
  });

  it('should be place vertical top to down', () => {
    assert.deepEqual(words.placeCells('apple', 9, 0, 0, 'vertival', 'top-to-down'), [
      { value: 'a', x: 0, y: 0 },
      { value: 'p', x: 0, y: 1 },
      { value: 'p', x: 0, y: 2 },
      { value: 'l', x: 0, y: 3 },
      { value: 'e', x: 0, y: 4 },
    ], 'vertical placement');
  });

  it('should be place horizontal right to left', () => {
    assert.deepEqual(words.placeCells('apple', 9, 0, 0, 'horizontal', 'right-to-left'), [
      { value: 'e', x: 0, y: 0 },
      { value: 'l', x: 1, y: 0 },
      { value: 'p', x: 2, y: 0 },
      { value: 'p', x: 3, y: 0 },
      { value: 'a', x: 4, y: 0 },
    ], 'horizontal placement right to left');
  });

  it('should be place vertical down to top', () => {
    assert.deepEqual(words.placeCells('apple', 9, 0, 0, 'vertical', 'down-to-top'), [
      { value: 'e', x: 0, y: 0 },
      { value: 'l', x: 0, y: 1 },
      { value: 'p', x: 0, y: 2 },
      { value: 'p', x: 0, y: 3 },
      { value: 'a', x: 0, y: 4 },
    ], 'vertical placement down to top');
  });

  it('should be place transversal left to right', () => {
    assert.deepEqual(words.placeCells('apple', 9, 0, 0, 'transversal', 'left-to-right'), [
      { value: 'a', x: 0, y:0 },
      { value: 'p', x: 1, y:1 },
      { value: 'p', x: 2, y:2 },
      { value: 'l', x: 3, y:3 },
      { value: 'e', x: 4, y:4 },
    ], 'transversal placement left to right');
  });

  it('should be place transversal right to left', () => {
    assert.deepEqual(words.placeCells('apple', 9, 0, 0, 'transversal', 'right-to-left'), [
      { value: 'e', x: 0, y: 0 },
      { value: 'l', x: 1, y: 1 },
      { value: 'p', x: 2, y: 2 },
      { value: 'p', x: 3, y: 3 },
      { value: 'a', x: 4, y: 4 },
    ], 'transversal placement right to left');
  });
});
