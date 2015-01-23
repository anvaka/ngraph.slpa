module.exports = slpa;

var randomAPI = require('ngraph.random');
var nodeMemory = require('./lib/nodeMemory.js');

/**
 * Implementation of Speaker-listener Label Propagation Algorithm (SLPA) of
 * Jierui Xie and Boleslaw K. Szymanski.
 *
 * @see http://arxiv.org/pdf/1109.5720v3.pdf
 * @see https://sites.google.com/site/communitydetectionslpa/
 */
function slpa(graph, T, r) {
  T = T || 100; // number of evaluation iterations. Should be at least 20. Influence memory consumption by O(n * T);
  r = r || 0.3; // community threshold on scale from 0 to 1. Value greater than 0.5 result in disjoint communities.
  var random = randomAPI.random(1331782216905);
  var shuffleRandom = randomAPI.random(1331782216906);
  var memory = init(graph);

  evaluate(graph, memory);

  return postProcess(graph, memory);

  function init(graph) {
    var memories = {};
    graph.forEachNode(initNodeMemory);
    return memories;

    function initNodeMemory(node) {
      var memory = nodeMemory(random);
      memory.add(node.id);
      memories[node.id] = memory;
    }
  }

  function evaluate(graph, memory) {
    var nodes = Object.keys(memory);
    var shuffle = randomAPI.randomIterator(nodes, shuffleRandom);

    for (var t = 0; t < T - 1; ++t) { // -1 is because one 'step' was during init phase
      shuffle.forEach(processNode);
    }

    /**
     * One iteration of SLPA.
     */
    function processNode(listenerId) {
      var listner = graph.getNode(listenerId);
      var saidWords = nodeMemory(random);

      graph.forEachLinkedNode(listenerId, saySomething);

      // selecting the most popular label from what it observed in the current step
      var heard = saidWords.getMostPopularFair();
      memory[listenerId].add(heard);

      function saySomething(speakerNode) {
        var word = memory[speakerNode.id].getRandomWord();
        saidWords.add(word);
      }
    }
  }

  function postProcess(graph, memory) {
    var communities = Object.create(null);
    var nodes = Object.create(null);

    graph.forEachNode(recordNodeCommunities);

    return {
      communities: communities,
      nodes: nodes
    };

    function recordNodeCommunities(node) {
      var nodeCommunities = calculateCommunities(memory[node.id], r * T),
        i;

      for (i = 0; i < nodeCommunities.length; ++i) {
        var communityName = nodeCommunities[i].name;
        if (communities[communityName]) {
          communities[communityName].push(node.id);
        } else {
          communities[communityName] = [node.id];
        }
      }
      nodes[node.id] = nodeCommunities;
    }
  }

  function calculateCommunities(nodeMemory, threshold) {
    var communities = [];
    nodeMemory.forEachUniqueWord(addAsCommunity);

    return communities;

    function addAsCommunity(word, count) {
      if (count > threshold) {
        communities.push({
          name: word,
          probability: count / T
        });
      } else {
        return true; // stop enumeration, nothing more popular after this word.
      }
    }
  }
}
