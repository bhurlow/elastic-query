
var Query = require('./index')

var q = new Query
q.size(10)

q.fetch((err, res) => {
  console.log(err)
  console.log(res)
})

