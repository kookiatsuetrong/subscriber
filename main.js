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
    var phone = req.query.phone || ''
    var name  = req.query.name  || ''
    var address = req.query.address || ''
    if (phone == '') {
      res.redirect('/apply')
    } else {
      var sql = "insert into member(phone,name,address) values"+
                "(?,?,?)"
      var conn = mysql.createConnection(database)
      conn.connect()
      conn.query(sql, [phone, name, address], function() {
        res.redirect('/apply')
        conn.end()
      })
    }
  }
}
