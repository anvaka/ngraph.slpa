# ngraph.slpa [![Build Status](https://travis-ci.org/anvaka/ngraph.slpa.svg)](https://travis-ci.org/anvaka/ngraph.slpa)

Graph community detection algorithm. This work is based on ["Towards Linear Time Overlapping Community
Detection in Social Networks"](http://arxiv.org/pdf/1202.2465v1.pdf) paper from
Jierui Xie and Boleslaw K. Szymanski. The paper describes an algorithm which finds
overlapping communities within random graph.

This project is part of [`ngraph`](https://github.com/anvaka/ngraph) family

# usage

``` javascript
// To find communities of graph `G`, where G is `ngraph.graph` object:
var findCommunities = require('ngraph.slpa');
var searchResult = findCommunities(G);

// now we can find all communites for node `foo`:
var nodeFooCommunities = searchResult.node.foo;

console.log('Node `foo` belongs to:');
for (var i = 0; i < nodeFooCommunities.length; ++i) {
  console.log(
    'Community  name:', nodeFooCommunities[i].name,
    'With probablity:', nodeFooCommunities[i].probablity
  );
}

// We can also find what other nodes belong to `foo`'s
// first community:
var firstCommunityName = nodeFooCommunities[i].name;
var otherNodesFromCommunity = searchResult.communities[firstCommunityName];

console.log('Nodes inside community', firstCommunityName);
for (var j = 0; j < otherNodesFromCommunity.length; ++j) {
  console.log(otherNodesFromCommunity[j]);
}
```

According to the paper, performance of community calculation is `O(T * m)`,
where `T` is a number of iteration for the algorithm, and `m` is total number of
edges. You can set number of iteration by passing it as a second argument:

``` javascript
var searchResult = findCommunities(G, 100);
```

Memory-wise current implementation is `O(scary)` and needs lots of improvements.
I'm not happy with how I've implemented `nodeMemory` object, and I believe
it can be done better.

# install

With [npm](https://npmjs.org) do:

```
npm install ngraph.slpa
```

# license

MIT
