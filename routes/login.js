var crypto = require('crypto');
var hash = crypto.createHash('sha256'); // creating hash object
var express = require('express');
const { type } = require('os');
var router = express.Router();

var database = require('../database');

/* GET Login Page. */
router.get('/', function (req, res, next) {
  res.render('login', { session: req.session });
});

/* Login API */
router.post('/login', function (request, response, next) {

  var family_id = request.body.family_id;

  var Password = request.body.user_password;

  if (family_id && Password) {
    query = `
      SELECT * FROM FamilyHeadMaster
      WHERE FamilyID = "${family_id}" and Password = "${Password}"
      `;

    database.query(query, function (error, data) {
      if (data.length == 1) {
        request.session.FamilyID = data[0].FamilyID;
        request.session.Surname = data[0].Surname;
        request.session.FirstName = data[0].FirstName;

        console.log(request.session.id);
        console.log(hash.update('nodejsera', 'utf-8').digest('hex'));

        if (request.session.FamilyID == "0000") {
          response.redirect("/dashboard");
        } else {
          response.redirect("/home");
        }
      }
      response.end();
    });
  }
  else {
    response.send('Please Enter Family ID and Password Details');
    response.end();
  }
});

/* Logout API */
router.get('/logout', function (request, response, next) {

  request.session.destroy();

  response.redirect("/");

});

module.exports = router;