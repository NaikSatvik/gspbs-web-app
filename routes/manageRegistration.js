var express = require('express');
var router = express.Router();

const fs = require('fs');
const multer = require('multer');
const { google } = require('googleapis');

const GOOGLE_API_FOLDER_ID = '1m5k7Ccnq2xt62llRZD0PFg4JfsrFQT22';

var database = require('../database');

const auth = new google.auth.GoogleAuth({
    keyFile: './gspbs_gKey_secret.json',
    scopes: ['https://www.googleapis.com/auth/drive']
});

const drive = google.drive({ version: 'v3', auth });

const upload = multer({
    dest: 'EventUploads/'
});

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
router.post('/register-user-request', upload.single('file'), async function (request, response, next) {
    if (!request.session.FamilyID) {
        response.redirect('/');
    } else {
        try {
            var gender = request.body.gender;
            var surname = request.body.surname;
            var gotra = request.body.gotra;
            var first_name = request.body.first_name;
            var mobile = request.body.mobile;
            var email = request.body.email;
            var native = request.body.native;

            let date_ob = new Date();
            let date = ("0" + date_ob.getDate()).slice(-2);
            let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
            let year = date_ob.getFullYear();
            let hours = date_ob.getHours();
            let minutes = date_ob.getMinutes();
            let seconds = date_ob.getSeconds();
            var timestamp = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;

            const file = request.file;
            const fileName = "aadhar_" + timestamp + file.originalname;

            const filePath = file.path;
            const fileMetadata = {
                name: fileName,
                'parents': [GOOGLE_API_FOLDER_ID]
            };
            const media = {
                mimeType: file.mimetype,
                body: fs.createReadStream(filePath)
            };
            const uploadedFile = await drive.files.create({
                resource: fileMetadata,
                media: media,
                fields: 'id'
            });

            var imageUrl = 'https://drive.google.com/uc?id=' + uploadedFile.data.id;

            var query = `
        INSERT INTO Requests
        (Gender, Surname, Gotra, FirstName, Mobile, EmailID, Native, req_status, aadhar, ImageUrl, createdAt, LastModified)
        VALUES ("${gender}", "${surname}", "${gotra}", "${first_name}", "${mobile}", "${email}", "${native}", 0, "${uploadedFile.data.id}", "${imageUrl}", "${timestamp}", "${timestamp}")
        `;

            database.query(query, function (error, data) {
                if (error) {
                    throw error;
                } else {
                    // request.flash('success', 'Details send successfully.');
                    response.redirect('/register');
                }
            });

        } catch (error) {
            console.log(error);
            response.send(error);
        }
    }
});

module.exports = router;