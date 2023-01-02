var express = require('express');
var router = express.Router();

var database = require('../database');

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
    if (!request.session.FamilyID) {
        response.redirect('/');
    } else {
        var family_id = request.body.family_id
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

/* GET View Family page. */
router.get('/view-family', function (req, res, next) {
    if (!req.session.FamilyID) {
        res.redirect('/');
    } else {
        var query = "SELECT * FROM FamilyHead";
        database.query(query, function (error, data) {
            if (error) {
                throw error;
            } else {
                // fam_id = Number(extractValue(data, 'MAX(FamilyID)')) + 1;
                res.render('viewFamily', { session: req.session, action: 'list', queriedData: data });
            }
        });
    }
});

/* POST Update Family Head. */
router.post('/update_family_head', function (request, response, next) {
    if (!request.session.FamilyID) {
        response.redirect('/');
    } else {
        var family_id = request.body.familyId.trim();
        var gender = request.body.Gender.trim();
        var surname = request.body.Surname.trim();
        var gotra = request.body.Gotra.trim();
        var first_name = request.body.FirstName.trim();
        var middle_name = request.body.MiddleName.trim();
        var mobile = request.body.Mobile.trim();
        var email = request.body.Email.trim();
        var native = request.body.Native.trim();
        var aadhar = request.body.Aadhar.trim();

        var query = `
    UPDATE FamilyHead
    SET Gender = "${gender}", 
    Surname = "${surname}", 
    Gotra = "${gotra}", 
    FirstName = "${first_name}", 
    MiddleName = "${middle_name}", 
    Mobile = "${mobile}", 
    EmailID = "${email}", 
    Native = "${native}", 
    Aadhar = "${aadhar}"
    WHERE FamilyID = "${family_id}"
    `;

        database.query(query, function (error, data) {
            if (error) {
                throw error;
            } else {
                response.redirect('/view-family');
            }
        });
    }
});

/* Delete Family Head. */
router.get('/delete_family_head/:FamilyID', function (request, response, next) {
    if (!request.session.FamilyID) {
        response.redirect('/');
    } else {
        var family_id = request.params.FamilyID;

        var query = `
    DELETE FROM FamilyHead WHERE FamilyID = "${family_id}"
    `;

        database.query(query, function (error, data) {
            if (error) {
                throw error;
            } else {
                response.redirect("/view-family");
            }
        });
    }
});

module.exports = router;