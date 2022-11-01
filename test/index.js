var test = require('tap').test;
var findCommunities = require('../');
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

  var results = findCommunities(g);

  // let's get communities of node `a`:
  var communitiesOfA = results.nodes.a;
  // Since the graph is constructed this way, we anticipate only one community
  // for node a:
  t.equals(communitiesOfA.length, 1, 'Only one community for node a');

  var mainCommunityOfA = communitiesOfA[0];
  // now that we have main community of `a` we can confirm that `b`, `c` and `d`
  // are also there:
  t.ok(mainCommunityOfA.probability > 0.5, 'node `a` is certainly here');
  var allNodesInFirstCommunity = results.communities[mainCommunityOfA.name];
  t.equals(allNodesInFirstCommunity.length, 4, 'Four neighbors with a');
  t.ok(allNodesInFirstCommunity.indexOf('a') >= 0, 'neighbor is here');
  t.ok(allNodesInFirstCommunity.indexOf('b') >= 0, 'neighbor is here');
  t.ok(allNodesInFirstCommunity.indexOf('c') >= 0, 'neighbor is here');
  t.ok(allNodesInFirstCommunity.indexOf('d') >= 0, 'neighbor is here');

  // And do the same for communities of `e`
  var communitiesOfE = results.nodes.e;
  // Since the graph is constructed this way, we anticipate only one community
  // for node a:
  t.equals(communitiesOfE.length, 1, 'Only one community for node e');

  var mainCommunityOfE = communitiesOfE[0];
  // now that we have main community of `a` we can confirm that `b`, `c` and `d`
  // are also there:
  t.ok(mainCommunityOfE.probability > 0.5, 'node `e` is certainly here');
  var allNodesInSecondCommunity = results.communities[mainCommunityOfE.name];
  t.equals(allNodesInSecondCommunity.length, 4, 'Four neighbors with e');
  t.ok(allNodesInSecondCommunity.indexOf('e') >= 0, 'neighbor is here');
  t.ok(allNodesInSecondCommunity.indexOf('f') >= 0, 'neighbor is here');
  t.ok(allNodesInSecondCommunity.indexOf('g') >= 0, 'neighbor is here');
  t.ok(allNodesInSecondCommunity.indexOf('h') >= 0, 'neighbor is here');

  t.end();
});
