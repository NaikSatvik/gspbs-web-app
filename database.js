const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    database: 'gspbs',
    user: 'root',
    password: 'password'
});

connection.connect(function (error) {
    if (error) {
        throw error;
    } else {
        console.log('DB Connected Successfully.');
    }
});

module.exports = connection;