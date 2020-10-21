# Words

## Description

A basic game of words in a grid to be founded

### Usage

Normal mode

```
[sudo] node index.js
```

Development mode

```
export DEBUG=WORDS; [sudo] node index.js
```

Increase the stack size to avoid collision

```
export DEBUG=WORDS; node --stack-size=50000 index.js
```

### Tests

```
mocha index.test.js
```
