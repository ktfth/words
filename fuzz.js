'use strict';
const words = require('./');

function fuzz(buf) {
  words.generateColumn([...buf]);
}

module.exports = {
  fuzz
};
