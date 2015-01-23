/**
 * A data structure which serves as node memory during SLPA execution. The main idea is to
 * simplify operations on memory such as
 *  - add word to memory,
 *  - get random word from memory, with probability proportional to word occurrence in the memory
 *  - get the most popular word in memory
 *
 * TODO: currently this structure is extremely inefficient in terms of memory. I think it could be
 * optimized.
 */
module.exports = nodeMemory;

function nodeMemory(random) {
  var wordsCount = {};
  var allWords = [];
  var dirtyPopularity = false;
  var uniqueWords = [];

  return {

    /**
     * Adds a new word to the collection of words.
     */
    add: add,

    /**
     * Gets number of occurrences for a given word. If word is not present in the dictionary
     * zero is returned.
     */
    getWordCount: getWordCount,

    /**
     * Gets the most popular word in the map. If multiple words are at the same position
     * random word among them is chosen.
     */
    getMostPopularFair: getMostPopularFair,

    /**
     * Selects a random word from map with probability proportional
     * to the occurrence frequency of words.
     */
    getRandomWord: getRandomWord,

    /**
     * Enumerates all unique words in the map, and calls
     *  callback(word, occurrenceCount) function on each word. Callback
     * can return true value to stop enumeration.
     *
     * Note: enumeration is guaranteed to run in decreasing order.
     */
    forEachUniqueWord: forEachUniqueWord
  };

  function forEachUniqueWord(callback) {
    if (typeof callback !== 'function') {
      throw new Error('Function callback is expected to enumerate all words');
    }
    var i;

    ensureUniqueWordsUpdated();

    for (i = 0; i < uniqueWords.length; ++i) {
      var word = uniqueWords[i],
        count = wordsCount[word];

      var stop = callback(word, count);
      if (stop) {
        break;
      }
    }
  }

  function getMostPopularFair() {
    if (allWords.length === 1) {
      return allWords[0]; // optimizes speed for simple case.
    }

    ensureUniqueWordsUpdated();

    var maxCount = 0,
      i;

    for (i = 1; i < uniqueWords.length; ++i) {
      if (wordsCount[uniqueWords[i - 1]] !== wordsCount[uniqueWords[i]]) {
        break; // other words are less popular... Not interested.
      } else {
        maxCount += 1;
      }
    }

    maxCount += 1; // to include upper bound. i.e. random words between [0, maxCount] (not [0, maxCount) ).
    return uniqueWords[random.next(maxCount)];
  }

  function getWordCount(word) {
    return wordsCount[word] || 0;
  }

  function add(word) {
    word = String(word);
    if (wordsCount.hasOwnProperty(word)) {
      wordsCount[word] += 1;
    } else {
      wordsCount[word] = 1;
    }

    allWords.push(word);
    dirtyPopularity = true;
  }

  function getRandomWord() {
    if (allWords.length === 0) {
      throw new Error('The occurrence map is empty. Cannot get empty word');
    }

    return allWords[random.next(allWords.length)];
  }

  function ensureUniqueWordsUpdated() {
    if (dirtyPopularity) {
      rebuildPopularityArray();
      dirtyPopularity = false;
    }
  }

  function rebuildPopularityArray() {
    var key;

    uniqueWords.length = 0;
    for (key in wordsCount) {
      if (wordsCount.hasOwnProperty(key)) {
        uniqueWords.push(key);
      }
    }

    uniqueWords.sort(byCount);
  }

  function byCount(x, y) {
    var result = wordsCount[y] - wordsCount[x];
    if (result) {
      return result;
    }

    // Not only number of occurrences matters but order of keys also does.
    // for ... in implementation in different browsers results in different
    // order, and if we want to have same categories across all browsers
    // we should order words by key names too:
    if (x < y) {
      return -1;
    }
    if (x > y) {
      return 1;
    }

    return 0;
  }
}
