# es-query-builder
build elasticsearch queries the sane way

# Install

```
npm install --save es-query-builder
```

# Motivation

the elasticsearch json query syntax pure pain


# Setup

`es-query-builder` expects both `ES_URL` and `ES_INDEX` environment variables to be definied 

so you may have a config file that looks something like:

```
export ES_INDEX=events
export ES_URL=https://mysearch:9200
```

# Usage

```js
var Query = require('es-query-builder')

// create a fresh query:
var q = new Query

// chain modifications:
q.size(10) 
q.queryString('event.type:foo')
q.range('timestamp', 1467817775660, 1467817785860)
q.agg('min', 'min_timestamp', 'timestamp')
q.agg('max', 'max_timestamp', 'timestamp')

// call it!
q.fetch() // no args returns a promise

q.fetch(function(err, res) {
  // or with callback 
})
```