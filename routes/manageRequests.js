var express = require('express');
var router = express.Router();

var database = require('../database');

/* GET Requests page. */
router.get('/view-requests', function (req, res, next) {
    if (!req.session.FamilyID) {
        res.redirect('/');
    } else {
        var query = "SELECT * FROM Requests";
        database.query(query, function (error, data) {
            if (error) {
                throw error;
            } else {
                var query = "SELECT * FROM Requests WHERE req_status = 0";
                database.query(query, function (error, data1) {
                    if (error) {
                        throw error;
                    } else {
                        res.render('viewRequests', { session: req.session,action: 'list', queriedData: data, user_requests_count: data1.length, message: req.flash('success'), messageRed: req.flash('danger') });     
                    }
                });
            }
        });
    }
});

/* GET Reject Request. */
router.get('/delete_request/:RequestID', function (request, response, next) {
    if (!request.session.FamilyID) {
        response.redirect('/');
    } else {
        var request_id = request.params.RequestID;

        var query = `
    UPDATE Requests SET req_status = 2 WHERE RequestID = "${request_id}"
    `;

        database.query(query, function (error, data) {
            if (error) {
                throw error;
            } else {
                request.flash('danger', '#' + request_id + ' rejected successfully.');
                response.redirect("/view-requests");
            }
        });
    }
});

module.exports = router;