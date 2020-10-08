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
  })
});
