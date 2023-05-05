var express = require('express');
var router = express.Router();
var crypto = require('crypto');

var database = require('../database');

/* GET Login Page. */
router.get('/', function (req, res, next) {
  res.render('login', { session: req.session });
});

/* Login API */
router.post('/login', function (request, response, next) {

  var family_id = request.body.family_id;

  const hash = crypto.createHash('sha256'); // creating hash object
  var Password = hash.update(request.body.user_password,'utf-8').digest('hex');

  if (family_id && Password) {
    query = `
      SELECT FamilyID, Surname, FirstName, EmailID FROM FamilyHeadMaster
      WHERE FamilyID = "${family_id}" and Password = "${Password}"
      `;

    database.query(query, function (error, data) {
      console.log(data);
      if (data.length == 1) {
        request.session.FamilyID = data[0].FamilyID;
        request.session.Surname = data[0].Surname;
        request.session.FirstName = data[0].FirstName;

        console.log(request.session.id);

        if (request.session.FamilyID == "0000") {
          let date_ob = new Date();
          let date = ("0" + date_ob.getDate()).slice(-2);
          let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
          let year = date_ob.getFullYear();
          let hours = date_ob.getHours();
          let minutes = date_ob.getMinutes();
          let seconds = date_ob.getSeconds();
          var timestamp = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
          var queryLoginHistory = `
    INSERT INTO loginhistory (SessionID, FamilyID, FirstName, Surname, loginAt, loggedOutAt)
    VALUES ("${request.session.id}", "${request.session.FamilyID}", "${request.session.FirstName}", "${request.session.Surname}", "${timestamp}", "-")
    `;
          database.query(queryLoginHistory, function (error, data) {
              if (error) {
                  throw error;
              } else {
                response.redirect("/dashboard");
              }
          });
        } else {
          let date_ob = new Date();
          let date = ("0" + date_ob.getDate()).slice(-2);
          let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
          let year = date_ob.getFullYear();
          let hours = date_ob.getHours();
          let minutes = date_ob.getMinutes();
          let seconds = date_ob.getSeconds();
          var timestamp = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
          var queryLoginHistory = `
    INSERT INTO loginhistory (SessionID, FamilyID, FirstName, Surname, loginAt, loggedOutAt)
    VALUES ("${request.session.id}", "${request.session.FamilyID}", "${request.session.FirstName}", "${request.session.Surname}", "${timestamp}", "-")
    `;
        database.query(queryLoginHistory, function (error, data) {
            if (error) {
                throw error;
            } else {
              response.redirect("/home");
            }
        });
        }
      } else {
        response.send('Invalid Credentials.');
      }
    });
  }
  else {
    response.send('Please Enter valid Family ID.');
    response.end();
  }
});

/* Logout API */
router.get('/logout', function (request, response, next) {
  query = `
      SELECT HistoryID FROM loginhistory WHERE SessionID = "${request.session.id}"
      `;
  database.query(query, function (error, data) {
    console.log(data);
    if (data.length == 1) {
      let date_ob = new Date();
        let date = ("0" + date_ob.getDate()).slice(-2);
        let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
        let year = date_ob.getFullYear();
        let hours = date_ob.getHours();
        let minutes = date_ob.getMinutes();
        let seconds = date_ob.getSeconds();
        var timestamp = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;

      var queryLoginHistory = `
      UPDATE loginhistory SET loggedOutAt="${timestamp}" WHERE HistoryID="${data[0].HistoryID}"
      `;

      database.query(queryLoginHistory, function (error, data) {
        if (error) {
            throw error;
        } else {
          request.session.destroy();
          response.redirect("/");
        }
      });
    }
  });
});

module.exports = router;