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

/* GET View Events Page. */
router.get('/view-events', function (request, response, next) {
    if (!request.session.FamilyID) {
        response.redirect('/');
    } else {
        var query = "SELECT * FROM EventCover";
        database.query(query, function (error, data) {
            if (error) {
                throw error;
            } else {
                response.render('viewEvents', { session: request.session, action: 'list', queriedData: data, message: request.flash('success'), messageRed: request.flash('danger') });
            }
        });
    }
});

/* GET Add Event Page. */
router.get('/add-event', function (request, response, next) {
    if (!request.session.FamilyID) {
        response.redirect('/');
    } else {
        response.render('addEvent', { session: request.session, message: request.flash('success'), messageRed: request.flash('danger') });
    }
});

/* POST Add-Event. */
router.post('/add_event', upload.single('file'), async function (request, response, next) {
    if (!request.session.FamilyID) {
        response.redirect('/');
    } else {
        try {
            let date_ob = new Date();
            let date = ("0" + date_ob.getDate()).slice(-2);
            let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
            let year = date_ob.getFullYear();
            let hours = date_ob.getHours();
            let minutes = date_ob.getMinutes();
            let seconds = date_ob.getSeconds();

            var eventTitle = request.body.event_title;
            var eventDesc = request.body.event_desc;
            var timestamp = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
            const file = request.file;
            const fileName = timestamp + "__" + file.originalname;
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

            var imageUrl = 'https://drive.google.com/uc?id=' + uploadedFile.data.id

            // Write to database.
            var query = `
    INSERT INTO EventCover
    (EventTitle, EventDescription, EventCoverPic, ImageUrl, createdAt, LastModified)
    VALUES ("${eventTitle}", "${eventDesc}", "${uploadedFile.data.id}", "${imageUrl}", "${timestamp}", "${timestamp}")
    `;

            database.query(query, function (error, data) {
                if (error) {
                    throw error;
                } else {
                    request.flash('success', 'Event posted successfully.');
                    response.redirect('/add-event');
                }
            });
        } catch (error) {
            console.error(error);
            response.send(error);
        }
    }
});

/* POST Update Event. */
router.post('/update_event', function (request, response, next) {
    if (!request.session.FamilyID) {
        response.redirect('/');
    } else {
        let date_ob = new Date();
        let date = ("0" + date_ob.getDate()).slice(-2);
        let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
        let year = date_ob.getFullYear();
        let hours = date_ob.getHours();
        let minutes = date_ob.getMinutes();
        let seconds = date_ob.getSeconds();
        var timestamp = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;

        var eventId = request.body.eventId.trim();
        var eventTitle = request.body.eventTitle.trim();
        var eventDesc = request.body.eventDesc.trim();

        var query = `
    UPDATE EventCover
    SET EventTitle = "${eventTitle}", 
    EventDescription = "${eventDesc}", 
    LastModified = "${timestamp}"
    WHERE EventID = "${eventId}"
    `;

        database.query(query, function (error, data) {
            if (error) {
                throw error;
            } else {
                request.flash('success', '#' + eventId + ' Event updated successfully.');
                response.redirect('/view-events');
            }
        });
    }
});

/* GET Delete Event. */
router.get('/delete_event/:EventID', function (request, response, next) {
    if (!request.session.FamilyID) {
        response.redirect('/');
    } else {
        var eventId = request.params.EventID;

        var query = `
    DELETE FROM EventCover WHERE EventID = "${eventId}"
    `;
        database.query(query, function (error, data) {
            if (error) {
                throw error;
            } else {
                request.flash('danger', '#' + eventId + ' Event removed successfully.');
                response.redirect("/view-events");
            }
        });
    }
});

module.exports = router;