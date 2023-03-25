var express = require('express');
var router = express.Router();

var database = require('../database');

/* GET dashboard page. */
router.get('/dashboard', function (req, res, next) {
    if (!req.session.FamilyID) {
        res.redirect('/');
    } else {
        res.render('dashboard', { session: req.session });
    }
});

module.exports = router;