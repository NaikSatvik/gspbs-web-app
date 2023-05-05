var express = require('express');
var router = express.Router();

var database = require('../database');

/* GET Register Page. */
router.get('/register', function (request, response, next) {
    if (!request.session.FamilyID) {
        response.redirect('/');
    } else {
        if (request.session.FamilyID != "0000") {
            response.render('registration', { session: request.session, message: request.flash('success'), messageRed: request.flash('danger') });
        }
    }
});

/* POST User_Request_Register. */
router.post('/register-user-request', function (request, response, next) {
    if (!request.session.FamilyID) {
        response.redirect('/');
    } else {
        var gender = request.body.gender;
        var surname = request.body.surname;
        var gotra = request.body.gotra;
        var first_name = request.body.first_name;
        var mobile = request.body.mobile;
        var email = request.body.email;
        var native = request.body.native;

        var query = `
    INSERT INTO Requests
    (Gender, Surname, Gotra, FirstName, Mobile, EmailID, Native, req_status)
    VALUES ("${gender}", "${surname}", "${gotra}", "${first_name}", "${mobile}", "${email}", "${native}", 0)
    `;

        database.query(query, function (error, data) {
            if (error) {
                throw error;
            } else {
                // request.flash('success', 'Details send successfully.');
                response.redirect('/register');
            }
        });
    }
});

module.exports = router;