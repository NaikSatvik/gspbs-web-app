var express = require('express');
var router = express.Router();

var database = require('../database');

/* GET Home Page. */
router.get('/home', function (request, response, next) {
    if (!request.session.FamilyID) {
        response.redirect('/');
    } else {
        if (request.session.FamilyID != "0000") {
            response.render('home', { session: request.session, message: request.flash('success'), messageRed: request.flash('danger') });
        }
    }
});

module.exports = router;