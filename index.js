
var _ = require('lodash')
var request = require('superagent')
var assert = require('assert')

module.exports = Query

function Query(opts) {
  this.query = {}
  this.api = 'search'
}

Query.prototype.size = function(size) {
  this.query.size = size
  return this
}

Query.prototype.sort = function(field, order) {
  order = order || 'asc'
  this.query.sort = {}
  this.query.sort[field] = order
  return this
}

Query.prototype.queryString = function(queryString) {
  var queryObject = {
    query_string: {
      analyze_wildcard: true,
      query: queryString
    }
  }
  _.set(this.query, 'query.filtered.query', queryObject)
  return this
}

Query.prototype.range = function(field, start, end) {
  var rangeObj = { }
  rangeObj[field] = {
    "gte": +start,
    "lte": +end
  }
  _.set(this.query, 'filter.bool.must[0].range', rangeObj)
  return this
}

Query.prototype.term = function(field, value) {
  this.query.filter.bool.must = this.query.filter.bool.must || []
  var clause = { term: {} }
  clause.term[field] = value
  this.query.filter.bool.must.push(clause)
  return this
}

Query.prototype.agg = function(type, name, field) {
  this.query.aggs = this.query.aggs || {}
  var setStr = `aggs.${name}.${type}`
  _.set(this.query, setStr, {
    field: field,
  })
  // must set the 'size' param to 0
  // in a terms aggregation to get all facets
  if (type === 'terms') {
    _.set(this.query, setStr + '.size', 0) 
  }

  if (type === 'date_histogram') {
    _.set(this.query, setStr + '.interval', '1d')
  }

  return this
}

Query.prototype.make = function() {
  return this.query
}

Query.prototype.fetch = function(fn) {

  var ES_INDEX = process.env.ES_INDEX
  var ES_URL = process.env.ES_URL

  assert(ES_URL, 'must define ES_URL env var')
  assert(ES_INDEX, 'must define ES_INDEX env var')

  var suffix = '/_' + this.api
  var url = ES_URL + '/' + ES_INDEX + suffix
  var req = request.post(url).send(this.query)

  // if callback is supplied use it 
  if (fn) {
    return req.end(fn)
  }

  // otherwise return promise
  return new Promise((resolve, reject) => {
    req.end((err, res) => {
      if (err) return reject(err)
      return resolve(res)
    })
  })
}


