var express = require('express');
var router = express.Router();

var database = require('../database');

/* GET dashboard page. */
router.get('/dashboard', function (req, res, next) {
    if (!req.session.FamilyID) {
        res.redirect('/');
    } else {
        var query = "SELECT * FROM Requests WHERE req_status = 0";
        database.query(query, function (error, data) {
            if (error) {
                throw error;
            } else {
                res.render('dashboard', { session: req.session, user_requests_count: data.length });
            }
        });
    }
});

module.exports = router;