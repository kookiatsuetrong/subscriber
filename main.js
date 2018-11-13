var express  = require('express')
var server   = express()
var ejs      = require('ejs')
var mysql    = require('mysql')
var database = { host:'localhost', database: 'web',
                 user:'james',     password: 'bond'}
server.listen(80)
server.get('/apply', showApplyPage)

function showApplyPage(req, res) {
  var conn = mysql.createConnection(database)
  conn.connect()
  conn.query('select * from service', function(error, data) {
    res.send(data)
    conn.end()
  })
}
