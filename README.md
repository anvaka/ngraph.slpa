# ngraph.slpa 

[![build status](https://github.com/anvaka/ngraph.slpa/actions/workflows/tests.yaml/badge.svg)](https://github.com/anvaka/ngraph.slpa/actions/workflows/tests.yaml)

Graph community detection algorithm. This work is based on ["Towards Linear Time Overlapping Community
Detection in Social Networks"](http://arxiv.org/pdf/1202.2465v1.pdf) paper from
Jierui Xie and Boleslaw K. Szymanski.

This project is part of [`ngraph`](https://github.com/anvaka/ngraph) family.

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
var firstCommunityName = nodeFooCommunities[0].name;
var otherNodesFromCommunity = searchResult.communities[firstCommunityName];

console.log('Community name:', firstCommunityName);
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
