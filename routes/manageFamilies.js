var express = require('express');
var router = express.Router();
var crypto = require('crypto');

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

        var query = "SELECT MAX(FamilyID) FROM FamilyHeadMaster";
        database.query(query, function (error, data) {
            if (error) {
                throw error;
            } else {
                fam_id = Number(extractValue(data, 'MAX(FamilyID)')) + 1;
                res.render('addFamily', { title: 'Express', session: req.session, family_id: fam_id, message: req.flash('success') });
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

        const hash = crypto.createHash('sha256'); // creating hash object
        var Password = hash.update("GSPBS",'utf-8').digest('hex');

        var query = `
    INSERT INTO FamilyHeadMaster
    (FamilyID, Password, Gender, Surname, Gotra, FirstName, MiddleName, Mobile, EmailID, Native, Aadhar, TandC)
    VALUES ("${family_id}", "${Password}", "${gender}", "${surname}", "${gotra}", "${first_name}", "${middle_name}", "${mobile}", "${email}", "${native}", "${aadhar}", "${tandc}")
    `;

        database.query(query, function (error, data) {
            if (error) {
                throw error;
            } else {
                request.flash('success', 'Family Head added successfully.');
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
        var query = "SELECT * FROM FamilyHeadMaster";
        database.query(query, function (error, data) {
            if (error) {
                throw error;
            } else {
                // fam_id = Number(extractValue(data, 'MAX(FamilyID)')) + 1;
                res.render('viewFamily', { session: req.session, action: 'list', queriedData: data, message: req.flash('success'), messageRed: req.flash('danger') });
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
    UPDATE FamilyHeadMaster
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
                request.flash('success', '#' + family_id + ' Family Head updated successfully.');
                response.redirect('/view-family');
            }
        });
    }
});

/* GET Delete Family Head. */
router.get('/delete_family_head/:FamilyID', function (request, response, next) {
    if (!request.session.FamilyID) {
        response.redirect('/');
    } else {
        var family_id = request.params.FamilyID;

        var query = `
    DELETE FROM FamilyHeadMaster WHERE FamilyID = "${family_id}"
    `;

        database.query(query, function (error, data) {
            if (error) {
                throw error;
            } else {
                request.flash('danger', '#' + family_id + ' Family Head removed successfully.');
                response.redirect("/view-family");
            }
        });
    }
});

/* GET Family Member Details. */
router.get('/view_family_members/:FamilyID', function (request, response, next) {
    if (!request.session.FamilyID) {
        response.redirect('/');
    } else {
        var family_id = request.params.FamilyID;

        var query = `
    SELECT * FROM FamilyMemberMaster WHERE FamilyID = "${family_id}"
    `;

        database.query(query, function (error, data) {
            if (error) {
                throw error;
            } else {
                response.render('viewFamilyMembers', { session: request.session, action: 'list', queriedData: data, family_id: family_id, message: request.flash('success'), messageRed: request.flash('danger') });
            }
        });
    }
});

/* POST Update Family Member Details. */
router.post('/update_family_member', function (request, response, next) {
    if (!request.session.FamilyID) {
        response.redirect('/');
    } else {
        var member_id = request.body.MemberID.trim();
        var family_id = request.body.familyId.trim();
        var gender = request.body.Gender.trim();
        var surname = request.body.Surname.trim();
        var gotra = request.body.Gotra.trim();
        var first_name = request.body.FirstName.trim();
        var middle_name = request.body.MiddleName.trim();
        var mobile = request.body.Mobile.trim();
        var RelationToFamHead = request.body.RelationToFamHead.trim();
        var email = request.body.Email.trim();
        var native = request.body.Native.trim();
        var aadhar = request.body.Aadhar.trim();

        console.log(member_id);

        var query = `
    UPDATE FamilyMemberMaster
    SET Gender = "${gender}", 
    Surname = "${surname}", 
    Gotra = "${gotra}", 
    FirstName = "${first_name}", 
    MiddleName = "${middle_name}", 
    Mobile = "${mobile}",
    RelationToFamHead = "${RelationToFamHead}",
    EmailID = "${email}", 
    Native = "${native}", 
    Aadhar = "${aadhar}"
    WHERE MemberID = "${member_id}"
    `;

        database.query(query, function (error, data) {
            if (error) {
                throw error;
            } else {
                request.flash('success', '(#' + family_id + ') Family Member updated successfully.');
                response.redirect('/view_family_members/' + family_id);
            }
        });
    }
});

/* GET Delete Family Member. */
router.get('/delete_family_member/:MemberID/:FamilyID', function (request, response, next) {
    if (!request.session.FamilyID) {
        response.redirect('/');
    } else {
        var member_id = request.params.MemberID;
        var family_id = request.params.FamilyID;

        var query = `
    DELETE FROM FamilyMemberMaster WHERE MemberID = "${member_id}"
    `;

        database.query(query, function (error, data) {
            if (error) {
                throw error;
            } else {
                request.flash('danger', '(#' + family_id + ') Family Member removed successfully.');
                response.redirect('/view_family_members/' + family_id);
            }
        });
    }
});

/* GET Add Family Member page. */
router.get('/add-family-member', function (req, res, next) {
    if (!req.session.FamilyID) {
        res.redirect('/');
    } else {
        var query = "SELECT DISTINCT FamilyID FROM FamilyHeadMaster";
        database.query(query, function (error, data) {
            if (error) {
                throw error;
            } else {
                res.render('addFamilyMember', { session: req.session, all_family_ids: data, message: req.flash('success') });
            }
        });
    }
});

/* POST Add-Family-Member. */
router.post('/add_family_member', function (request, response, next) {
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
        var RelationToFamHead = request.body.RelationToFamHead;
        var email = request.body.email;
        var native = request.body.native;
        var aadhar = request.body.aadhar;
        var tandc = request.body.tandc;

        var query = `
    INSERT INTO FamilyMemberMaster
    (FamilyID, Gender, Surname, Gotra, FirstName, MiddleName, Mobile, RelationToFamHead, EmailID, Native, Aadhar, TandC)
    VALUES ("${family_id}", "${gender}", "${surname}", "${gotra}", "${first_name}", "${middle_name}", "${mobile}", "${RelationToFamHead}", "${email}", "${native}", "${aadhar}", "${tandc}")
    `;

        database.query(query, function (error, data) {
            if (error) {
                throw error;
            } else {
                request.flash('success', 'Family Member added successfully.');
                response.redirect('/add-family-member');
            }
        });
    }
});

module.exports = router;