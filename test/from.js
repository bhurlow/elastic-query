
var test = require('tape')
var Query = require('../index')
var _ = require('lodash')

function fromQuery(from, cb) {
  var q1 = new Query
  q1.size(5)
  q1.from(from)
  q1.sort('timestamp', 'asc')
  q1.fetch((err, res) => {
    cb(res.body.hits.hits)
  })
}

test('from req', function (t) {

  fromQuery(10, function(hits) {
    var ids1 = hits.map(x => x._id)
    // console.log(ids1)
    fromQuery(14, function(hits) {

      var ids2 = hits.map(x => x._id)
      // console.log(ids2)
      var d = _.intersection(ids1, ids2)

      t.equal(d.length, 0)
      t.end()

    })
  })

})
