var test = require('tap').test;
var nodeMemory = require('../lib/nodeMemory.js');

test('occuranceMapCountsWords', function(t) {
  var random = require('ngraph.random').random(123);
  var map = nodeMemory(random);
  for (var i = 0; i < 15; ++i) {
    map.add('hello');
  }
  map.add('world');

  var helloCount = map.getWordCount('hello'),
    worldCount = map.getWordCount('world'),
    randomWordCount = map.getWordCount('he-he');

  t.equals(helloCount, 15, 'Hello word should be added 15 times');
  t.equals(worldCount, 1, 'Only one occurance of world should be in the map');
  t.equals(randomWordCount, 0, 'This word should not be in the map!');
  t.end();
});

test('occuranceMapFindsMostPopularWord', function(t) {
  var random = require('ngraph.random').random(123);
  var map = nodeMemory(random);

  map.add('hello');
  map.add('world');
  map.add('!');
  map.add('hello');
  map.add('world');
  map.add('hello');

  var mostPopular = map.getMostPopularFair();

  t.equals(mostPopular, 'hello', 'expected most popular word');
  t.end();
});

test('occuranceMapFindsMostPopularWordWithSameRank', function(t) {
  var random = require('ngraph.random').random(123);
  var map = nodeMemory(random);

  for (var i = 0; i < 100; ++i) {
    if (i < 50) {
      map.add('hello');
    } else {
      map.add('world');
    }
  }

  var helloFound = false,
    worldFound = false;
  for (i = 0; i < 10; ++i) {
    var word = map.getMostPopularFair();
    if (word === 'hello') {
      helloFound = true;
    }
    if (word === 'world') {
      worldFound = true;
    }
  }

  t.ok(helloFound && worldFound, 'Both words should appear. Well. Potentially...This is non-determenistic test');
  t.end();
});

test('occuranceMapReturnsRandomWord', function(t) {
  var random = require('ngraph.random').random(123);
  var map = nodeMemory(random);
  var dictionary = {};

  for (var i = 0; i < 15; ++i) {
    var word = 'hello' + i;
    map.add(word);
    dictionary[word] = 1;
  }

  for (i = 0; i < 15; ++i) {
    var actual = map.getRandomWord();
    t.ok(dictionary.hasOwnProperty(actual), 'The random word is there');
  }
  t.end();
});

test('occuranceMapEnumeratesAllWords', function(t) {
  var random = require('ngraph.random').random(123);
  var map = nodeMemory(random);
  var dictionary = {};

  map.add('hello');
  map.add('world');
  map.add('!');
  map.add('hello');
  map.add('world');
  map.add('hello');

  var prevCount = 4;
  map.forEachUniqueWord(function(word, count) {
    t.ok(count <= prevCount, "Enumeration should go in non increasing order");
    t.ok(!dictionary.hasOwnProperty(word), "Enumeration should go through unique words only");

    dictionary[word] = count;
  });

  t.equals(dictionary.hello, 3, "Expected number of 'hello'");
  t.equals(dictionary.world, 2, "Expected number of 'world'");
  t.equals(dictionary['!'], 1, "Expected number of '!'");
  t.end();
});
