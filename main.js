// https://github.com/kookiatsuetrong/subscriber
var express  = require('express')
var server   = express()
var ejs      = require('ejs')
var mysql    = require('mysql')
var database = { host:'localhost', database: 'web',
                 user:'james',     password: 'bond'}
server.engine('html', ejs.renderFile)
server.listen(80)
server.get('/apply', showApplyPage)

function showApplyPage(req, res) {
  if (req.query.phone == null) {
    var conn = mysql.createConnection(database)
    conn.connect()
    conn.query('select * from service', function(error, data) {
      // res.send(data) // for web service
      res.render('apply.html', {service: data})
      conn.end()
    })
  } else {
    res.send(req.query)
  }
}
