// https://github.com/kookiatsuetrong/subscriber
var express  = require('express')
var server   = express()
var ejs      = require('ejs')
var mysql    = require('mysql')
var database = { host:'localhost', database: 'web',
                 user:'james',     password: 'bond'}
var pool     = mysql.createPool(database)
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
    pool.query('select * from member where phone=?', [phone], function(e,r) {
      if (r.length == 0) { // เป็นเบอร์โทรศัพท์ใหม่
        var sql = "insert into member(phone,name,address) values" +
                  "(?,?,?)"
        var data = [phone, name, address]
        pool.query(sql, data, function(error, result) {
          saveService(req, res, result.insertId)
        })
      } else { // เบอร์โทรศัพท์เคยสมัครมาแล้ว r[0].id
        saveService(req, res, r[0].id)
      }
    })
  }
}
function saveService(req, res, id) {
  for (var i in req.body) {
    if (i.startsWith("service-") && req.body[i] == "on") {
      var index = parseInt( i.substring(8) ) // หาว่า subscribe อะไร
      var sql = "insert into subscribe(member,service,first_day,next) values" +
                "(?,?,?,?)"
      var data = [id, req.body.available[index], 
                  req.body.day[index] + ' ' + req.body.month[index],
                  req.body.next[index] ]
      pool.query(sql, data, function() { } )
    }
  }
  res.send(req.body)
}
