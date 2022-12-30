var express = require('express');
var router = express.Router();

var database = require('../database');

/* GET login page. */
router.get('/', function (req, res, next) {
  res.render('login', { title: 'Express', session: req.session });
});

/* Login API */
router.post('/login', function (request, response, next) {

  var family_id = request.body.family_id;

  var Password = request.body.user_password;

  if (family_id && Password) {
    query = `
      SELECT * FROM FamilyHead 
      WHERE FamilyID = "${family_id}"
      `;

    database.query(query, function (error, data) {

      console.log(data.length);
      if (data.length > 0) {
        for (var count = 0; count < data.length; count++) {
          if (data[count].Password == Password) {
            request.session.FamilyID = data[count].FamilyID;
            request.session.Surname = data[count].Surname;
            request.session.FirstName = data[count].FirstName;
            // console.log(data);
            console.log(request.session);

            if (request.session.FamilyID == "0000") {
              response.redirect("/dashboard");
            } else {
              response.redirect("/");
            }
          }
          else {
            response.send('Incorrect Password');
          }
        }
      }
      else {
        response.send('Incorrect Family ID');
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