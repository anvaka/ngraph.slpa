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

  var communities = findComminuities(g);
  var names = communities.getNames();
  var nodes = communities.getNodes();
  var firstCommunity = nodes.a[0];
  var secondCommunity = nodes.e[0];

  t.ok(names.length > 1, 'At least two communities are found');
  t.ok(isPartOfCommunity(['a', 'b', 'c', 'd'], firstCommunity), 'first community has expected members');
  t.ok(isPartOfCommunity(['e', 'f', 'g', 'h'], secondCommunity), 'second community has expected members');

  t.end();
});
