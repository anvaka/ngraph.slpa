var test = require('tap').test;
var findComminuities = require('../');
var dot = require('ngraph.fromdot');

test('it finds communities', function(t) {
  var g = dot([
    'graph {',
    // first cluster:
    '{a b c d} -- {a b c d};',
    // second cluster
    '{e f g h} -- {e f g h};',
    // and a bridge between two:
    'a -- e',
    '}'
  ].join(' '));

  var results = findComminuities(g);

  // let's get communities of node `a`:
  var communitesOfA = results.nodes.a;
  // Since the graph is constructed this way, we anticipate only one community
  // for node a:
  t.equals(communitesOfA.length, 1, 'Only one community for node a');

  var mainCommunityOfA = communitesOfA[0];
  // now that we have main community of `a` we can confirm that `b`, `c` and `d`
  // are also there:
  t.ok(mainCommunityOfA.probability > 0.5, 'node `a` is certainly here');
  var allNodesInFirstCommunity = results.communities[mainCommunityOfA.name];
  t.equals(allNodesInFirstCommunity.length, 4, 'Four neighbours with a');
  t.ok(allNodesInFirstCommunity.indexOf('a') >= 0, 'neighbour is here');
  t.ok(allNodesInFirstCommunity.indexOf('b') >= 0, 'neighbour is here');
  t.ok(allNodesInFirstCommunity.indexOf('c') >= 0, 'neighbour is here');
  t.ok(allNodesInFirstCommunity.indexOf('d') >= 0, 'neighbour is here');

  // And do the same for communities of `e`
  var communitesOfE = results.nodes.e;
  // Since the graph is constructed this way, we anticipate only one community
  // for node a:
  t.equals(communitesOfE.length, 1, 'Only one community for node e');

  var mainCommunityOfE = communitesOfE[0];
  // now that we have main community of `a` we can confirm that `b`, `c` and `d`
  // are also there:
  t.ok(mainCommunityOfE.probability > 0.5, 'node `e` is certainly here');
  var allNodesInSecondCommunity = results.communities[mainCommunityOfA.name];
  t.equals(allNodesInSecondCommunity.length, 4, 'Four neighbours with e');
  t.ok(allNodesInSecondCommunity.indexOf('a') >= 0, 'neighbour is here');
  t.ok(allNodesInSecondCommunity.indexOf('b') >= 0, 'neighbour is here');
  t.ok(allNodesInSecondCommunity.indexOf('c') >= 0, 'neighbour is here');
  t.ok(allNodesInSecondCommunity.indexOf('d') >= 0, 'neighbour is here');

  t.end();
});
