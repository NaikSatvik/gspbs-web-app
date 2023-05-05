var express = require('express');
var router = express.Router();
var database = require('../database');

/* GET View Family page. */
router.get('/login-report', function (req, res, next) {
    if (!req.session.FamilyID) {
        res.redirect('/');
    } else {
        var query = "SELECT * FROM loginhistory";
        database.query(query, function (error, data) {
            if (error) {
                throw error;
            } else {
                res.render('viewLoginReport', { session: req.session, action: 'list', queriedData: data, message: req.flash('success'), messageRed: req.flash('danger') });
            }
        });
    }
});

module.exports = router;