// https://github.com/kookiatsuetrong/subscriber
var express  = require('express')
var server   = express()
var ejs      = require('ejs')
var mysql    = require('mysql')
var database = { host:'localhost', database: 'web',
                 user:'james',     password: 'bond'}
var bodyParser = require('body-parser')
var readBody   = bodyParser.urlencoded({extended:true})
server.engine('html', ejs.renderFile)
server.listen(80)
server.get ('/apply', showApplyPage)
server.post('/apply', readBody, saveMemberData)

function showApplyPage(req, res) {
  var conn = mysql.createConnection(database)
  conn.connect()
  conn.query('select * from service', function(error, data) {
    // res.send(data) // for web service
    res.render('apply.html', {service: data})
    conn.end()
  })
}
function saveMemberData(req, res) {
  var phone   = req.body.phone   || ''
  var name    = req.body.name    || ''
  var address = req.body.address || ''
  if (phone == '') {
    res.redirect('/apply')
  } else {
    var sql = "insert into member(phone,name,address) values" +
              "(?,?,?)"
    var data = [phone, name, address]
    var conn = mysql.createConnection(database)
    conn.connect()
    conn.query(sql, data, function() {
      conn.end()
      // เก็บข้อมูลแต่ละบริการเข้า Table
    })
  }
}
