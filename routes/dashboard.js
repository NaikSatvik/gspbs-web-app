var express = require('express');
var router = express.Router();

var database = require('../database');

/* GET dashboard page. */
router.get('/dashboard', function (req, res, next) {
    if (!req.session.FamilyID) {
        res.redirect('/');
    } else {
        res.render('dashboard', { title: 'Express', session: req.session });
    }
});

/* GET Add Family page. */
router.get('/add-family', function (req, res, next) {
    if (!req.session.FamilyID) {
        res.redirect('/');
    } else {
        function extractValue(arr, prop) {
            // extract value from property
            let extractedValue = arr.map(item => item[prop]);
            return extractedValue;
        }

        var query = "SELECT MAX(FamilyID) FROM FamilyHead";
        database.query(query, function (error, data) {
            if (error) {
                throw error;
            } else {
                fam_id = Number(extractValue(data, 'MAX(FamilyID)')) + 1;
                res.render('addFamily', { title: 'Express', session: req.session, family_id: fam_id });
            }
        });
    }
});

/* POST Add-Family-Head. */
router.post('/add_family_head', function (request, response, next) {
    if (!req.session.FamilyID) {
        res.redirect('/');
    } else {
        var family_id = request.body.family_id;
        var gender = request.body.gender;
        var surname = request.body.surname;
        var gotra = request.body.gotra;
        var first_name = request.body.first_name;
        var middle_name = request.body.middle_name;
        var mobile = request.body.mobile;
        var email = request.body.email;
        var native = request.body.native;
        var aadhar = request.body.aadhar;
        var tandc = request.body.tandc;

        var query = `
    INSERT INTO FamilyHead
    (FamilyID, Password, Gender, Surname, Gotra, FirstName, MiddleName, Mobile, EmailID, Native, Aadhar, TandC)
    VALUES ("${family_id}", "GSPBS", "${gender}", "${surname}", "${gotra}", "${first_name}", "${middle_name}", "${mobile}", "${email}", "${native}", "${aadhar}", "${tandc}")
    `;

        database.query(query, function (error, data) {
            if (error) {
                throw error;
            } else {
                response.redirect('/add-family');
            }
        });
    }
});

module.exports = router;